import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const navigate = useNavigate();

  return (
    // Container: full screen, flex layout, responsive
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left side: orange background, only on md+ screens */}
      <div className="flex-1 bg-gradient-to-br from-orange-300 to-orange-400 md:w-1/2 flex items-center justify-center p-4">
        {/* Optional: add logo or branding here */}
      </div>
      
      {/* Right side: login form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="text-orange-500">S10</span>
              <span className="text-gray-600">.Clinic</span>
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-2">LOGIN</h2>
          </div>

          
          <form className="space-y-6">
        
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Password & Forgot Password */}
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
              <div className="flex items-center mb-2 md:mb-0">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2">
                  Remember Password
                </label>
              </div>
              <button
                className="text-orange-500 hover:underline focus:outline-none"
                onClick={() => {
                  navigate("/forgot-password");
                  
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300"
              type="submit"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-4 text-sm">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-orange-500 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;