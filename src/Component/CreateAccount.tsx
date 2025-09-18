"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

type UserRole = "doctor" | "nurse" | "pharmacy" | "patient" | ""

interface RoleConfig {
  title: string
  nameLabel: string
  specialtyLabel: string
  specialties: string[]
}

interface Country {
  name: string
  code: string
  flag: string
}

const countries: Country[] = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "UAE", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
]

const roleConfigs: Record<Exclude<UserRole, "">, RoleConfig> = {
  doctor: {
    title: "Doctor",
    nameLabel: "Doctor Name",
    specialtyLabel: "Medical Speciality",
    specialties: [
      "Cardiology",
      "Dermatology",
      "Neurology",
      "Pediatrics",
      "Orthopedics",
      "Psychiatry",
      "Radiology",
      "Emergency Medicine",
      "Internal Medicine",
      "Surgery",
    ],
  },
  nurse: {
    title: "Nurse",
    nameLabel: "Nurse Name",
    specialtyLabel: "Nursing Department",
    specialties: [
      "Emergency Department",
      "Intensive Care Unit (ICU)",
      "Pediatric Ward",
      "Surgical Ward",
      "Medical Ward",
      "Maternity Ward",
      "Oncology",
      "Cardiology Unit",
      "Operating Room",
      "Outpatient Department",
    ],
  },
  pharmacy: {
    title: "Pharmacist",
    nameLabel: "Pharmacist Name",
    specialtyLabel: "Pharmacy Department",
    specialties: [
      "Clinical Pharmacy",
      "Hospital Pharmacy",
      "Outpatient Pharmacy",
      "Emergency Pharmacy",
      "Pediatric Pharmacy",
      "Oncology Pharmacy",
      "Critical Care Pharmacy",
      "Surgical Pharmacy",
    ],
  },
  patient: {
    title: "Patient",
    nameLabel: "Patient Name",
    specialtyLabel: "Medical Condition",
    specialties: [
      "General Checkup",
      "Cardiac Care",
      "Dental Care",
      "Orthopedic Care",
      "Mental Health",
      "Maternity Care",
      "Pediatric Care",
      "Oncology Care",
      "Emergency Care",
      "Chronic Disease Management",
    ],
  },
}

export default function CreateAccount() {
  const [role, setRole] = useState<UserRole>("")
  const [email, setEmail] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const navigate = useNavigate()

  const currentConfig = role ? roleConfigs[role] : null

  const togglePassword = () => setShowPassword(!showPassword)
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character (!@#$%^&*)", valid: /[!@#$%^&*]/.test(password) },
  ]

  
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    setSpeciality("") // Reset specialty when role changes
    setLicenseNumber("") // Reset license number
  }

  const passwordsMatch = password === confirmPassword
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  if (agreeToTerms && role && passwordsMatch) {
    const accountData = {
      role,
      first_name: firstName,
      last_name: lastName,
      username: email,  // Using email as username
      email,           // Required field
      password,
      password2: confirmPassword,
      phone_number: phoneNumber.replace(/\D/g, ""),
      country_code: selectedCountry.code,
      speciality,
      license_number: licenseNumber,
    };

    try {
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch (jsonError) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        // Extract validation errors from response
        const errorMessages = [];
        if (responseData) {
          for (const [field, errors] of Object.entries(responseData)) {
            errorMessages.push(
              `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
            );
          }
        }
        throw new Error(
          errorMessages.length > 0
            ? errorMessages.join('\n')
            : 'Registration failed'
        );
      }

      console.log("Account created:", responseData);

      // Navigate based on role
      const dashboardRoute =
        role === "doctor" ? "/admin/dashboard" :
        role === "nurse" ? "/nurse/dashboard" :
        role === "pharmacy" ? "/pharmacy/dashboard" :
        "/patient/dashboard";

      navigate(dashboardRoute, {
        state: {
          userName: fullName,
          userRole: role,
          speciality: speciality,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      alert(error instanceof Error ? error.message : "Registration failed");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 relative flex flex-col md:flex-row md:space-x-8">
        {/* Left side for branding (desktop only) */}
        <div className="hidden md:flex md:flex-col justify-center items-center w-1/2 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg p-8 text-white">
          <div className="text-5xl font-bold flex items-center space-x-2">
            <span className="text-white font-medium text-4xl">OBT</span>
            <span className="text-gray-100 text-3xl">.Clinic</span>
          </div>
          <p className="text-center mt-4 text-orange-100">Electronic Medical Records System</p>
        </div>

        {/* Right side for form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {/* Branding for both mobile and desktop (in form section) */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold flex items-center justify-center space-x-1">
              <span className="text-orange-400">OBT</span>
              <span className="text-gray-600">.Clinic</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-1 text-center md:text-left">Create an account</h2>
          <p className="text-gray-600 mb-6 text-center md:text-left">Sign up to continue to EMR system</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                required
              >
                <option value="" disabled>
                  Select Your Role
                </option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacy">Pharmacist</option>
                <option value="patient">Patient</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dynamic fields based on role */}
            {currentConfig && (
              <>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="text"
                  placeholder={currentConfig.nameLabel}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="off"
                />

                <div className="relative">
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {currentConfig.specialtyLabel}
                    </option>
                    {currentConfig.specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* License Number for Doctors, Nurses, and Pharmacists (not for Patients) */}
                {role !== "pharmacy" && role !== "patient" && (
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="text"
                    placeholder={`${currentConfig.title} License Number`}
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                )}

              
                {role === "pharmacy" && (
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="text"
                    placeholder="Pharmacy Registration Number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                )}
              </>
            )}

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />

            <div className="flex space-x-2">
              <div className="w-2/5">
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find((c) => c.code === e.target.value)
                      if (country) setSelectedCountry(country)
                    }}
                  >
                    {countries.map((country) => (
                      <option key={`${country.code}-${country.name}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-3/5">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-gray-600 text-sm">{selectedCountry.code}</span>
                  </div>
                  <input
                    className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <input
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setShowRules(true)}
                onFocus={() => setShowRules(false)}
                required
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

            {/* Confirm Password Input with Eye Toggle */}
            <div className="relative">
              <input
                className={`w-full px-4 py-2 pr-10 border rounded focus:outline-none focus:ring-2 ${
                  showPasswordError ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-orange-400"
                }`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault()
                  toggleConfirmPassword()
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showPasswordError && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-orange-400 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and the{" "}
                <a href="#" className="text-orange-400 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-white font-semibold py-3 rounded mt-4 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={!agreeToTerms || !role || !passwordsMatch}
            >
              Create {currentConfig?.title} Account
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
  )
}
