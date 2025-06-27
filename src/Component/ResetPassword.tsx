import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showRules, setShowRules] = useState(false);

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
            {[...Array(4)].map((_, i) => (
              <input
                key={i}
                maxLength={1}
                className="w-12 h-12 text-center border-b-2 border-gray-400 text-lg focus:outline-none"
              />
            ))}
          </div>
          <button className="text-sm text-gray-600 hover:underline">Resend OTP</button>
        </div>

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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={togglePassword}
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
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={toggleConfirm}
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
