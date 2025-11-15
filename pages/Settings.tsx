import React, { useState } from 'react';
import { User } from '../types';
import { updateUserProfile, updateUserPassword } from '../services/mockApiService';

interface SettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const Settings: React.FC<SettingsProps> = ({ user, onUserUpdate }) => {
  // Profile form state
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setProfileMessage({ type: 'error', text: 'Image size should be less than 2MB.' });
          return;
      }
      const base64 = await fileToBase64(file);
      setAvatar(base64);
      setAvatarPreview(URL.createObjectURL(file));
      setProfileMessage({ type: '', text: '' });
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    try {
      const updatedUser = await updateUserProfile(user.id, {
        name,
        avatarUrl: avatar || user.avatarUrl,
      });
      onUserUpdate(updatedUser);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await updateUserPassword(user.id, currentPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Details Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your photo and personal details here.</p>
        </div>
        <form onSubmit={handleProfileSave} className="p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <img 
              src={avatarPreview || user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
              alt="Profile" 
              className="h-24 w-24 rounded-full object-cover"
            />
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
                Change Picture
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, PNG or GIF. 2MB max.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" id="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <input type="text" value={user.role} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
                <input type="text" value={user.campus} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4">
              {profileMessage.text && <p className={`text-sm ${profileMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{profileMessage.text}</p>}
              <button type="submit" disabled={profileLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your password for enhanced security.</p>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <div>
                <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input id="currentPassword" type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
             <div>
                <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input id="newPassword" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
             <div>
                <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input id="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
             <div className="flex justify-end items-center gap-4">
              {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{passwordMessage.text}</p>}
              <button type="submit" disabled={passwordLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
