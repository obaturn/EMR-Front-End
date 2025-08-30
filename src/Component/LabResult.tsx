"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, X, AlertCircle, Upload } from "lucide-react";
import DashboardLayout from "./AdminDashboardLayout";
import { getLabResults, createLabResult } from "../ApiService/LabService";
import  api  from "../ApiService/Api"; // Import api instance

interface Patient {
  id: string;
  name: string;
}

interface LabResult {
  id: string;
  patient_name: string;
  test_type: string;
  date: string;
  notes: string;
  file_url?: string;
}

interface LabReportProps {
  userName?: string;
  userRole?: string;
  specialty?: string;
}

const LabReport = ({ userName = "User", userRole = "doctor", specialty = "" }: LabReportProps) => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedLab, setSelectedLab] = useState<LabResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newResult, setNewResult] = useState<Omit<LabResult, "id"> & { patientId?: string }>({
    patient_name: "",
    patientId: "",
    test_type: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    file_url: undefined,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [labData, patientData] = await Promise.all([
          getLabResults(),
          api.get("/patients/").then(res => res.data),
        ]);
        setLabResults(labData);
        setPatients(patientData.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
        })));
      } catch (error: any) {
        setError(error.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddResult = async () => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("patient_id", newResult.patientId || "");
      formData.append("test_type", newResult.test_type);
      formData.append("date", newResult.date);
      formData.append("notes", newResult.notes);
      if (file) {
        formData.append("file", file);
      }

      const createdResult = await createLabResult(formData);
      setLabResults([...labResults, createdResult]);
      resetForm();
      alert("Lab result added successfully!");
    } catch (error: any) {
      setError(error.message || "Failed to add lab result");
    }
  };

  const resetForm = () => {
    setNewResult({
      patient_name: "",
      patientId: "",
      test_type: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      file_url: undefined,
    });
    setFile(null);
    setIsAdding(false);
  };

  const handleInputChange = (field: keyof Omit<LabResult, "id"> | "patientId", value: string) => {
    if (field === "patientId") {
      const patient = patients.find(p => p.id === value);
      setNewResult((prev) => ({
        ...prev,
        patientId: value,
        patient_name: patient ? patient.name : "",
      }));
    } else {
      setNewResult((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.match(/^(image\/|application\/pdf)/)) {
        setError("Please upload an image or PDF file.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const isDoctor = userRole === "doctor";

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
      <div className="p-6 max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="absolute top-0 right-0 p-3 text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lab Reports</h1>
            <p className="text-gray-600">View and manage patient lab reports</p>
          </div>
          {isDoctor && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Lab Report
            </button>
          )}
        </div>

        {isDoctor && isAdding && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Lab Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  value={newResult.patientId}
                  onChange={(e) => handleInputChange("patientId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select
                  value={newResult.test_type}
                  onChange={(e) => handleInputChange("test_type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Test Type</option>
                  <option value="Blood Chemistry">Blood Chemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Advanced Imaging">Advanced Imaging (Doctor Only)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newResult.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newResult.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report File (PDF or Image)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="lab-file-upload"
                  />
                  <label
                    htmlFor="lab-file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
                  >
                    <Upload className="w-4 h-4" /> Choose File
                  </label>
                  <span className="text-sm text-gray-600">{file ? file.name : "No file selected"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddResult}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Report
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No lab reports available.</td>
                </tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.patient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.test_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLab(result)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setSelectedLab(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="border border-gray-300 p-6 font-sans text-gray-900">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Clinical Laboratory</h2>
                  <p className="text-sm">123 Lab Street, Health City, HC 12345</p>
                  <p className="text-sm">Phone: (555) 123-4567 | Email: info@lab.com</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">Laboratory Test Report</h3>
                  <p className="text-sm">Report Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Name:</span> {selectedLab.patient_name}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Test Type:</span> {selectedLab.test_type}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Date:</span> {selectedLab.date}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Test Results</h4>
                {selectedLab.file_url ? (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    {selectedLab.file_url.endsWith(".pdf") ? (
                      <iframe src={selectedLab.file_url} className="w-full h-96" title="Lab Report PDF" />
                    ) : (
                      <img src={selectedLab.file_url} alt="Lab Report" className="w-full max-h-96 object-contain" />
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No file uploaded for this report.</p>
                )}
              </div>
              {selectedLab.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm">{selectedLab.notes}</p>
                </div>
              )}
              <div className="mt-8 pt-4 border-t border-gray-300 text-sm">
                <p className="italic">This report is confidential and intended for the use of the requesting physician.</p>
                <div className="flex justify-between mt-2">
                  <p>Pathologist: Dr. Jane Smith</p>
                  <p>Page 1 of 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LabReport;