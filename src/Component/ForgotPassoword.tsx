import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (mobileNumber.trim() !== "") {
      // Show success and navigate
      alert("A reset link has been sent to your mobile number.");
      navigate("/reset-password");
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left orange gradient side */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/2 bg-gradient-to-br from-orange-300 to-orange-400 items-center justify-center relative"></div>

      {/* Right form container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-[350px] bg-white p-6 rounded-lg shadow-lg">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-4">
            <span className="text-3xl font-bold mb-2 text-yellow-500">S10</span>
            <span className="text-2xl font-bold mb-4 text-black">Clinic</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-semibold mb-4 text-black text-center">Forgot Password</h1>

          {/* Description */}
          <p className="text-gray-600 mb-4 text-center text-sm">
            Please enter your mobile number to reset your password.
          </p>

          {/* Input */}
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />

          {/* Send Button */}
          <button
            onClick={handleClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg mb-3 text-sm transition-colors"
          >
            Send
          </button>

          {/* Footer / Link */}
          <p className="text-gray-600 text-center text-xs">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
