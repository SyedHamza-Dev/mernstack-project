import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

// Password strength checker function
const checkPasswordStrength = (password) => {
  let strength = 0;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[\W]/.test(password);

  if (password.length >= 8) strength += 1; // Length check
  if (hasUppercase) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecialChar) strength += 1;

  return {
    strength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
  };
};

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, hasUppercase: false, hasNumber: false, hasSpecialChar: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordStrength.hasUppercase || !passwordStrength.hasNumber || !passwordStrength.hasSpecialChar) {
      setError('Password must include at least one uppercase letter, one number, and one special character.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccess(data.message);
      setLoading(false);
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };
  
  const getPasswordStrengthLabel = () => {
    switch (passwordStrength.strength) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Too weak';
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg w-full"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            required
          />
          {/* Password Strength Meter */}
          {showPasswordRequirements && (
            <div className="absolute top-full mt-2 left-0 p-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg">
              <div className="text-sm mb-2">Password Strength: 
                <span className={`font-semibold ${passwordStrength.strength >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                  {getPasswordStrengthLabel()}
                </span>
              </div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li className={`${passwordStrength.hasUppercase ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasUppercase ? '✔ Includes an uppercase letter' : '✘ Must include an uppercase letter'}
                </li>
                <li className={`${passwordStrength.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasNumber ? '✔ Includes a number' : '✘ Must include a number'}
                </li>
                <li className={`${passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasSpecialChar ? '✔ Includes a special character' : '✘ Must include a special character'}
                </li>
              </ul>
            </div>
          )}
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">{success}</p>}
    </div>
  );
}
