import React from 'react';
import API from '../api';

const Login = () => {
  const handleLogin = async () => {
    try {
      // Call the backend to get the Kerliix OAuth URL
      const res = await API.get('/auth/kerliix');
      // Redirect the user to the OAuth provider
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('No redirect URL returned from backend.');
      }
    } catch (error) {
      console.error('OAuth login failed:', error);
      alert('Failed to start login. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Demo Client for Kerliix OAuth</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This is an example application demonstrating Kerliix OAuth integration.
          You are interacting with a demo client, not the official Kerliix website.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-white bg-gradient-to-br from-blue-900 via-black to-gray-900 hover:opacity-90 transition-all duration-300"
          >
            <img
              src="https://www.kerliix.com/assets/kerliix-icon.png"
              alt="Kerliix Logo"
              className="w-5 h-5"
            />
            Continue with Kerliix
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-blue-500">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
