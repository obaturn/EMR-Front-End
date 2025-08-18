"use client"

import { useState } from "react"
import { User, Edit, Save, X, Camera, Phone, Mail, MapPin, CreditCard, GraduationCap, Award } from "lucide-react"
import DashboardLayout from "./AdminDashboardLayout"

interface ProfilePageProps {
  userName?: string
  userRole?: string
  specialty?: string
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  education: string
  certifications: string[]
  bio: string
  profileImage?: string
}

const ProfilePage = ({ userName = "User", userRole = "doctor", specialty = "" }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: userName.split(" ")[0] || "John",
    lastName: userName.split(" ")[1] || "Doe",
    email: `${userName.toLowerCase().replace(" ", ".")}@clinic.com`,
    phone: "+1 (555) 123-4567",
    address: "123 Medical Center Dr, Healthcare City, HC 12345",
    licenseNumber: userRole === "doctor" ? "MD123456" : userRole === "nurse" ? "RN789012" : "PH345678",
    education:
      userRole === "doctor"
        ? "MD from Harvard Medical School"
        : userRole === "nurse"
          ? "BSN from Johns Hopkins"
          : "PharmD from University of California",
    certifications:
      userRole === "doctor"
        ? ["Board Certified Internal Medicine", "CPR Certified"]
        : userRole === "nurse"
          ? ["ACLS Certified", "BLS Certified"]
          : ["Licensed Pharmacist", "Immunization Certified"],
    bio: `Dedicated ${userRole} with extensive experience in ${specialty || "healthcare"}. Committed to providing excellent patient care and staying current with medical advances.`,
  })

  const [editData, setEditData] = useState<ProfileData>(profileData)

  const handleEdit = () => {
    setEditData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "doctor":
        return "Dr."
      case "nurse":
        return "Nurse"
      case "pharmacy":
        return "Pharmacist"
      default:
        return ""
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor"
      case "nurse":
        return "Nurse"
      case "pharmacy":
        return "Pharmacist"
      default:
        return "Healthcare Professional"
    }
  }

  return (
    <DashboardLayout userName={userName} userRole={userRole} specialty={specialty}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600">Manage your professional information</p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.firstName.charAt(0)}
                    {profileData.lastName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Name and Role */}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {getRoleTitle(userRole)} {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-orange-600 font-medium mb-2">{getRoleDisplayName(userRole)}</p>
                {specialty && <p className="text-gray-500 text-sm mb-4">{specialty}</p>}

                {/* Quick Contact */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{profileData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                Professional Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.licenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 flex items-center gap-2">
                      <GraduationCap className="w-3 h-3 text-gray-500" />
                      {profileData.education}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                  {isEditing ? (
                    <textarea
                      value={editData.certifications.join(", ")}
                      onChange={(e) => handleInputChange("certifications", e.target.value.split(", "))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="Separate certifications with commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                        >
                          <Award className="w-2 h-2" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
