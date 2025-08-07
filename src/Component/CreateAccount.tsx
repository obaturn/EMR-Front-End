import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [DoctorName, setDoctorName] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (agreeToTerms) {
      // Logic to create account goes here
      console.log("Account created for:", DoctorName, email, speciality);
      navigate("/admin/dashboard",{ state: { doctorName: DoctorName } }); // Redirect to login after account creation
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 relative flex flex-col md:flex-row md:space-x-8">
        {/* Left side for branding (desktop only) */}
        <div className="hidden md:flex md:flex-col justify-center items-center w-1/2 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg p-8 text-white">
          <div className="text-5xl font-bold flex items-center space-x-2">
            <span className="text-white font-medium text-4xl">S10</span>
            <span className="text-gray-100 text-3xl">.Clinic</span>
          </div>
        </div>

        {/* Right side for form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {/* Branding for both mobile and desktop (in form section) */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold flex items-center justify-center space-x-1">
              <span className="text-orange-400">S10</span>
              <span className="text-gray-600">.Clinic</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-1 text-center md:text-left">Create an account</h2>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Sign up to continue
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="text"
              placeholder="Doctor Name"
              value={DoctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />

            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="" disabled>Select Speciality</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex space-x-2">
              <div className="w-1/3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                  defaultValue="+91"
                >
                  <option value="+91">+91</option>
                </select>
              </div>
              <div className="w-2/3">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="text"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-orange-400 hover:underline">Terms and Conditions</a> and the <a href="#" className="text-orange-400 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button 
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-white font-semibold py-3 rounded mt-4 transition duration-300" 
              type="submit"
              disabled={!agreeToTerms}
            >
              Verify
            </button>

            <p className="text-center text-sm mt-4 text-gray-700">
              Already have an account?{" "}
              <a href="/login" className="text-orange-400 hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}