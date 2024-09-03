// src/pages/EmailVerification.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {
  const [formData, setFormData] = useState({ email: '', code: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        setSuccess('Verification code resent successfully!');
      }
      setLoading(false);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Email Verification</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 rounded-lg"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Enter verification code"
          className="border p-3 rounded-lg"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      <button
        onClick={handleResendCode}
        disabled={loading}
        className="mt-4 text-blue-600 underline"
      >
        Resend Verification Code
      </button>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">{success}</p>}
    </div>
  );
}
