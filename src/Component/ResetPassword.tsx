import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character (!@#$%^&*)", valid: /[!@#$%^&*]/.test(password) },
  ];

  const isMatching = password && confirm && password === confirm;
  const otpString = otp.join('');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    if (!password) {
      setError('Please enter a new password');
      return;
    }

    if (!isMatching) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('https://emr-backend-f7k2.onrender.com/api/auth/reset-password/', {
        email,
        otp_code: otpString,
        new_password: password,
        confirm_password: confirm
      });

      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.otp_code?.[0] || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-300 to-yellow-300 px-4 py-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-10">
        
        {/* Logo */}
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="text-orange-500 font-extrabold">S10</span>
          <span className="text-gray-800">.Clinic</span>
        </h1>

        {/* OTP Section */}
        <div className="text-center mb-8">
          <p className="font-semibold text-gray-800">OTP Verification</p>
          <div className="flex gap-3 justify-center mt-2 mb-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-12 h-12 text-center border-b-2 border-gray-400 text-lg text-gray-900 bg-transparent focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                disabled={isLoading}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          <button className="text-sm text-gray-600 hover:underline" disabled={isLoading}>Resend OTP</button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Password Section */}
          <div className="w-full max-w-lg mx-auto">
            <label className="font-semibold text-gray-800 mb-1 block">Password</label>

            {/* Password Input */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setShowRules(true)}
                onFocus={() => setShowRules(false)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault()
                  togglePassword()
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          {/* Password Rules */}
          {showRules && (
            <ul className="text-sm text-left mb-3 space-y-1">
              {rules.map((rule, idx) => (
                <li key={idx} className={rule.valid ? "text-green-600" : "text-red-500"}>
                  {rule.valid ? "✔" : "✘"} {rule.label}
                </li>
              ))}
            </ul>
          )}

          {/* Confirm Password */}
          <div className="relative mb-2">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={(e) => {
                e.preventDefault()
                toggleConfirm()
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirm && !isMatching && (
            <p className="text-xs text-red-500 mb-2">Passwords do not match</p>
          )}
          {isMatching && (
            <p className="text-xs text-green-600 mb-2">Passwords match</p>
          )}

          {/* Remember Password */}
          <div className="flex items-center mt-3 mb-5">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Remember Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 rounded transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
       </form>
      </div>
    </div>
  );
}
