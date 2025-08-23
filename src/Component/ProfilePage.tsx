"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Camera, Phone, Mail, VideoOff, Circle, Upload, AlertCircle } from "lucide-react";
import DashboardLayout from "./AdminDashboardLayout";
import { getProfile, updateProfile } from "../ApiService/ProfileService";
import useCamera from "./UseCamera";

interface ProfilePageProps {
  userName?: string;
  userRole?: string;
  specialty?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  education: string;
  certifications: string[];
  bio: string;
  profileImage?: string;
}

const ProfilePage = ({ userName = "User", userRole = "doctor", specialty = "" }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: userName.split(" ")[0] || "John",
    lastName: userName.split(" ")[1] || "Doe",
    email: `${userName.toLowerCase().replace(" ", ".")}@clinic.com`,
    phone: "+1 (555) 123-4567",
    address: "123 Medical Center Dr, Healthcare City, HC 12345",
    licenseNumber: userRole === "doctor" ? "MD123456" : userRole === "nurse" ? "RN789012" : "PH345678",
    education: userRole === "doctor" ? "MD from Harvard Medical School" : userRole === "nurse" ? "BSN from Johns Hopkins" : "PharmD from University of California",
    certifications: userRole === "doctor" ? ["Board Certified Internal Medicine", "CPR Certified"] : userRole === "nurse" ? ["ACLS Certified", "BLS Certified"] : ["Licensed Pharmacist", "Immunization Certified"],
    bio: `Dedicated ${userRole} with extensive experience in ${specialty || "healthcare"}. Committed to providing excellent patient care and staying current with medical advances.`,
    profileImage: "",
  });
  const [editData, setEditData] = useState<ProfileData>(profileData);

  const {
    isCapturing,
    cameraSupported,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    handleImageUpload,
  } = useCamera(setEditData, setError);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProfile();
        setProfileData({
          firstName: data.first_name || profileData.firstName,
          lastName: data.last_name || profileData.lastName,
          email: data.email || profileData.email,
          phone: data.phone_number || profileData.phone,
          address: data.address || profileData.address,
          licenseNumber: data.license_number || profileData.licenseNumber,
          education: data.education || profileData.education,
          certifications: data.certifications || profileData.certifications,
          bio: data.bio || profileData.bio,
          profileImage: data.profile_image || profileData.profileImage,
        });
      } catch (error: any) {
        setError(error.message || "Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userName, userRole, specialty]);

  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await updateProfile({
        first_name: editData.firstName,
        last_name: editData.lastName,
        email: editData.email,
        phone_number: editData.phone,
        address: editData.address,
        license_number: editData.licenseNumber,
        education: editData.education,
        certifications: editData.certifications,
        bio: editData.bio,
        profile_image: editData.profileImage || null,
      });

      setProfileData({
        firstName: response.first_name || editData.firstName,
        lastName: response.last_name || editData.lastName,
        email: response.email || editData.email,
        phone: response.phone_number || editData.phone,
        address: response.address || editData.address,
        licenseNumber: response.license_number || editData.licenseNumber,
        education: response.education || editData.education,
        certifications: response.certifications || editData.certifications,
        bio: response.bio || editData.bio,
        profileImage: response.profile_image || editData.profileImage,
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    setError(null);
    if (isCapturing) {
      stopCamera();
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "doctor": return "Dr.";
      case "nurse": return "Nurse";
      case "pharmacy": return "Pharmacist";
      default: return "";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor": return "Doctor";
      case "nurse": return "Nurse";
      case "pharmacy": return "Pharmacist";
      default: return "Healthcare Professional";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userName={userName} userRole={userRole} specialty={specialty}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName} userRole={userRole} specialty={specialty}>
      <div className="p-6 max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 right-0 p-3 text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {editData.profileImage ? (
                    <img
                      src={editData.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
                      onError={(e) => {
                        console.error("Error loading profile image");
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {editData.firstName.charAt(0)}{editData.lastName.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={isCapturing ? stopCamera : startCamera}
                        disabled={!cameraSupported}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={cameraSupported ? "Take profile picture" : "Camera not supported"}
                      >
                        {isCapturing ? (
                          <VideoOff className="w-3 h-3" />
                        ) : cameraSupported ? (
                          <Camera className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="absolute bottom-0 right-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 cursor-pointer"
                        title="Upload profile picture"
                      >
                        <Upload className="w-3 h-3" />
                      </label>
                    </>
                  )}
                </div>

                {isCapturing && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-4">Capture Profile Picture</h3>
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 bg-gray-200 rounded-lg"
                        />
                        <div className="flex justify-center mt-4 space-x-4">
                          <button
                            onClick={capturePhoto}
                            className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                          >
                            <Circle className="w-6 h-6" />
                          </button>
                          <button
                            onClick={stopCamera}
                            className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {getRoleTitle(userRole)} {editData.firstName} {editData.lastName}
                </h2>
                <p className="text-orange-600 font-medium mb-2">{getRoleDisplayName(userRole)}</p>
                {specialty && <p className="text-gray-500 text-sm mb-4">{specialty}</p>}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-3 h-3" /> <span>{editData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-3 h-3" /> <span>{editData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
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
                    <p className="text-gray-800">{profileData.address}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
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
                    <p className="text-gray-800">{profileData.education}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                  {isEditing ? (
                    <textarea
                      value={editData.certifications.join(", ")}
                      onChange={(e) => handleInputChange("certifications", e.target.value.split(", ").filter(c => c.trim()))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="Separate certifications with commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                        >
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
  );
};

export default ProfilePage;