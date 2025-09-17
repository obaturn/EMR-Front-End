"use client"

import Button from "./ui/button"
import type { FC } from "react"
import { useNavigate } from "react-router-dom"

const Start: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      
      <div className="relative bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 flex-1 lg:flex-none lg:w-1/2 min-h-[45vh] lg:min-h-screen flex items-center justify-center">
        
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 right-12 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-8 w-8 h-8 bg-white/20 rounded-full"></div>

      
        <div className="relative z-10 text-white/90">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg lg:text-xl font-medium mb-2">Healthcare Excellence</p>
            <p className="text-sm lg:text-base text-white/80 max-w-xs mx-auto leading-relaxed">
              Professional medical consultation at your fingertips
            </p>
          </div>
        </div>
      </div>

      
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-20">
        <div className="w-full max-w-md space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl mb-4">
              <div className="w-6 h-6 bg-orange-400 rounded-md"></div>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight">
              <span className="text-orange-500 font-semibold">OBT</span>
              <span className="text-gray-800">.Clinic</span>
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl font-light max-w-sm mx-auto leading-relaxed">
              Your trusted partner in digital healthcare solutions
            </p>
          </div>

          
          <div className="space-y-4">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              size="lg"
              onClick={() => navigate("/create-account")}
            >
              <span className="flex items-center justify-center gap-2">
                CREATE-ACCOUNT
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>

            <Button
              variant="outline"
               className="w-full border-2 border-gray-300 hover:border-orange-400 text-gray-800 hover:text-orange-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 hover:bg-orange-50 bg-blue hover:shadow-md"
              size="lg"
               onClick={() => navigate("/login")}
            >
              LOGIN TO ACCOUNT
            </Button>
          </div>

          
          <div className="flex justify-center items-center space-x-3 pt-8">
            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"></div>
          </div>

          {/* Additional trust indicators */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start
