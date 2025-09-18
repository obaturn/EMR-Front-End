"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, AlertCircle } from "lucide-react"

import api from "../ApiService/Api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password/', { email: email.trim() })
      setSuccess(true)
      localStorage.setItem('resetEmail', email.trim())

      // Navigate after showing success message
      setTimeout(() => {
        navigate("/reset-password")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OTP Sent!</h2>
              <p className="text-gray-600 mt-2 text-sm">
                A password reset OTP has been sent to your email address. Please check your email.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              <p className="text-sm text-gray-500">Redirecting you to reset password page...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold">OBT</h1>
              <h2 className="text-2xl lg:text-3xl font-semibold">Clinic</h2>
            </div>
            <p className="text-lg lg:text-xl text-orange-100">Secure and reliable healthcare management system</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo - Only visible on small screens */}
          <div className="md:hidden text-center space-y-2">
            <h1 className="text-3xl font-bold text-orange-500">OBT</h1>
            <h2 className="text-xl font-semibold text-gray-900">Clinic</h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToLogin}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  aria-label="Go back to login"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Forgot Password</h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 ml-10">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    onClick={handleBackToLogin}
                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors focus:outline-none focus:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional help text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Having trouble? Contact our support team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
