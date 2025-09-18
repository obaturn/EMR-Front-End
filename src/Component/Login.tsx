"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberPassword }),
      })

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        setErrorMessage(data.detail || "Login failed. Check your credentials.")
        setIsLoading(false)
        return
      }

      // Save tokens and user info
      localStorage.setItem("accessToken", data.tokens.access)
      localStorage.setItem("refreshToken", data.tokens.refresh)
      localStorage.setItem("user", JSON.stringify(data.user))

  setTimeout(() => {
  navigate("/admin/dashboard", {
    state: {
      userName: data.user.name,
      userRole: data.user.role,
      specialty: data.user.specialty || "",
    },
  })
  setIsLoading(false)
}, 3000)
 
    } catch (error) {
      console.error(error)
      setErrorMessage("An unexpected error occurred.")
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-lg"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-xl text-orange-100 leading-relaxed">
              Access your clinic dashboard and manage your practice with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden bg-gradient-to-r from-orange-400 to-orange-500 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">
              <span>OBT</span>
              <span className="text-orange-100">.Clinic</span>
            </h1>
            <p className="text-orange-100 mt-2">Welcome back to your dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Desktop header */}
            <div className="hidden lg:block text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                <span className="text-orange-500">OBT</span>
                <span className="text-gray-600">.Clinic</span>
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mt-3">Sign in to your account</h2>
              <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {errorMessage}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-700">Remember me</label>
                </div>
                <button
                  type="button"
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to OBT.Clinic?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
                  onClick={() => navigate("/signup")}
                >
                  Create your account →
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our{" "}
            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
