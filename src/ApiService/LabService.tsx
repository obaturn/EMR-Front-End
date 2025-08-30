import api from "./Api"; // Assuming axios instance with multipart support

// Get all lab reports
export const getLabResults = async () => {
  const response = await api.get("/lab-reports/");
  return response.data;
};

// Create a new lab report with file
export const createLabResult = async (formData: FormData) => {
  const response = await api.post("/lab-reports/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};