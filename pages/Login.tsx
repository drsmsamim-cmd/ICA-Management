import React, { useState } from 'react';
import { Campus, Role, LoginCredentials, SignupDetails } from '../types';
import { CAMPUSES, ROLES } from '../constants';
import { requestPasswordReset, resetPassword } from '../services/mockApiService';

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<any>;
  onSignup: (details: SignupDetails) => Promise<any>;
}

type View = 'login' | 'signup' | 'forgotPassword' | 'resetPassword';

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [view, setView] = useState<View>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('Teacher');
  const [campus, setCampus] = useState<Campus>('Brindabanpur');
  const [resetCode, setResetCode] = useState('');

  const clearFormStates = () => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setResetCode('');
  };

  const handleViewChange = (newView: View) => {
    clearFormStates();
    setView(newView);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'login') {
        await onLogin({ email, password, role, campus });
      } else if (view === 'signup') {
         if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }
        await onSignup({ name, email, password, role, campus });
      } else if (view === 'forgotPassword') {
        await requestPasswordReset(email);
        setSuccess('If an account with this email exists, a reset code has been sent. For this demo, the code is 123456.');
        setView('resetPassword');
      } else if (view === 'resetPassword') {
        if (password !== confirmPassword) {
            throw new Error("New passwords do not match.");
        }
        await resetPassword(email, resetCode, password);
        clearFormStates();
        setSuccess('Password has been reset successfully. Please sign in with your new password.');
        setView('login');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const titles = {
      login: 'ICA Management',
      signup: 'Create Account',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Your Password'
  };

  const buttonTexts = {
      login: 'Sign In',
      signup: 'Sign Up',
      forgotPassword: 'Send Reset Code',
      resetPassword: 'Reset Password'
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {titles[view]}
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <button type="button" onClick={() => handleViewChange('forgotPassword')} className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none">
                        Forgot Password?
                    </button>
                </div>
                <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </>
          )}

          {/* SIGNUP VIEW */}
          {view === 'signup' && (
              <>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
            </>
          )}

          {/* COMMON ROLE & CAMPUS SELECTOR */}
          {(view === 'login' || view === 'signup') && (
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <select id="role" name="role" value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="campus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
                    <select id="campus" name="campus" value={campus} onChange={e => setCampus(e.target.value as Campus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgotPassword' && (
             <>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">Enter the email for your account and we'll send a reset code.</p>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
            </>
          )}
          
          {/* RESET PASSWORD VIEW */}
          {view === 'resetPassword' && (
              <>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input id="email" name="email" type="email" required value={email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                    <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reset Code</label>
                    <input id="resetCode" name="resetCode" type="text" required value={resetCode} onChange={e => setResetCode(e.target.value)} placeholder="Enter code from email" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
            </>
          )}

          {error && <p className="text-sm text-center text-red-600 dark:text-red-400">{error}</p>}
          {success && <p className="text-sm text-center text-green-600 dark:text-green-400">{success}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
              {loading ? 'Processing...' : buttonTexts[view]}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {view === 'login' && "Don't have an account?"}
          {view === 'signup' && "Already have an account?"}
          {(view === 'forgotPassword' || view === 'resetPassword') && "Remember your password?"}
          <button onClick={() => handleViewChange(view === 'signup' || view === 'forgotPassword' || view === 'resetPassword' ? 'login' : 'signup')} className="ml-1 font-medium text-primary-600 hover:text-primary-500 focus:outline-none">
            {view === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;