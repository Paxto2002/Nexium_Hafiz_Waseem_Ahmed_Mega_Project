'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, checkUserExists } from '@/lib/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const supabase = createClient();

      // Check if user exists (optional - for better UX)
      const userExists = await checkUserExists(email);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          shouldCreateUser: false, // Don't create new users on sign in
          data: {
            is_signup: false
          }
        },
      });

      if (error) {
        console.error('Sign in error:', error);
        setMessage({ type: 'error', content: error.message });
      } else {
        const messageText = userExists 
          ? '✅ Check your email for the login link!'
          : '❓ Check your email. If you don\'t have an account, please sign up first.';
          
        setMessage({
          type: 'success',
          content: messageText,
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage({
        type: 'error',
        content: 'An unexpected error occurred. Please try again.'
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign In</h1>

        {error === 'auth_failed' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            Authentication failed. Please try again.
          </div>
        )}

        {message.content && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending login link...
              </>
            ) : 'Send Login Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Don't have an account?{' '}
            <a href="/signup" className="text-green-600 hover:underline font-medium">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}