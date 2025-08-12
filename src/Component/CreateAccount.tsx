"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

type UserRole = "doctor" | "nurse" | "pharmacy" | ""

interface RoleConfig {
  title: string
  nameLabel: string
  specialtyLabel: string
  specialties: string[]
}

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
}

export default function CreateAccount() {
  const [role, setRole] = useState<UserRole>("")
  const [email, setEmail] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const navigate = useNavigate()

  const currentConfig = role ? roleConfigs[role] : null

  // Handle role change and reset dependent fields
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    setSpecialty("") // Reset specialty when role changes
    setLicenseNumber("") // Reset license number
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (agreeToTerms && role) {
      const accountData = {
        role,
        fullName,
        email,
        phoneNumber,
        specialty,
        licenseNumber: role !== "pharmacy" ? licenseNumber : undefined,
      }

      console.log("Account created:", accountData)

      // Navigate based on role
      const dashboardRoute =
        role === "doctor" ? "/admin/dashboard" : role === "nurse" ? "/nurse/dashboard" : "/pharmacy/dashboard"

      navigate(dashboardRoute, {
        state: {
          userName: fullName,
          userRole: role,
          specialty: specialty,
        },
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 relative flex flex-col md:flex-row md:space-x-8">
        {/* Left side for branding (desktop only) */}
        <div className="hidden md:flex md:flex-col justify-center items-center w-1/2 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg p-8 text-white">
          <div className="text-5xl font-bold flex items-center space-x-2">
            <span className="text-white font-medium text-4xl">S10</span>
            <span className="text-gray-100 text-3xl">.Clinic</span>
          </div>
          <p className="text-center mt-4 text-orange-100">Electronic Medical Records System</p>
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
                />

                <div className="relative">
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
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

                {/* License Number for Doctors and Nurses */}
                {role !== "pharmacy" && (
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="text"
                    placeholder={`${currentConfig.title} License Number`}
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                )}

                {/* Pharmacy Registration Number */}
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
            />

            <div className="flex space-x-2">
              <div className="w-1/3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                  defaultValue="+91"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
              </div>
              <div className="w-2/3">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
              disabled={!agreeToTerms || !role}
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
