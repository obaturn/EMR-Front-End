import api from "./Api"; // this is your axios setup

// Get profile
export const getProfile = async () => {
  const response = await api.get("profile/");
  return response.data;
};

// Update profile
export const updateProfile = async (profileData: any) => {
  const response = await api.put("profile/", profileData);
  return response.data;
};
