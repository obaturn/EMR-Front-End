"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserMd,
  FaHeartbeat,
  FaAllergies,
  FaSyringe,
  FaUsers,
  FaUserFriends,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { ehrService } from "../ApiService/EHRService";
import type {
  MedicalHistory,
  VitalSigns,
  Allergy,
  Immunization,
  FamilyHistory,
  SocialHistory,
  MedicalHistoryCreate,
  VitalSignsCreate,
  AllergyCreate,
  ImmunizationCreate,
  FamilyHistoryCreate,
  SocialHistoryCreate,
} from "../types/ehr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EHRPageProps {
  userName?: string;
}

const EHRPage = ({ userName = "Dr. Akintoye" }: EHRPageProps) => {
  const { patientId } = useParams<{ patientId: string }>();
  const patientIdNum = patientId ? parseInt(patientId) : null;

  // Data states
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [familyHistories, setFamilyHistories] = useState<FamilyHistory[]>([]);
  const [socialHistories, setSocialHistories] = useState<SocialHistory[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showImmunizationModal, setShowImmunizationModal] = useState(false);
  const [showFamilyHistoryModal, setShowFamilyHistoryModal] = useState(false);
  const [showSocialHistoryModal, setShowSocialHistoryModal] = useState(false);

  // Edit states
  const [editingMedicalHistory, setEditingMedicalHistory] = useState<MedicalHistory | null>(null);
  const [editingVitalSigns, setEditingVitalSigns] = useState<VitalSigns | null>(null);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [editingImmunization, setEditingImmunization] = useState<Immunization | null>(null);
  const [editingFamilyHistory, setEditingFamilyHistory] = useState<FamilyHistory | null>(null);
  const [editingSocialHistory, setEditingSocialHistory] = useState<SocialHistory | null>(null);

  // Form states
  const [medicalHistoryForm, setMedicalHistoryForm] = useState<MedicalHistoryCreate>({
    patient: patientIdNum || 0,
    condition: "",
    diagnosis_date: "",
    status: "active",
    severity: "mild",
    notes: "",
  });

  const [vitalSignsForm, setVitalSignsForm] = useState<VitalSignsCreate>({
    patient: patientIdNum || 0,
    recorded_at: new Date().toISOString().slice(0, 16),
    temperature_unit: "C",
  });

  const [allergyForm, setAllergyForm] = useState<AllergyCreate>({
    patient: patientIdNum || 0,
    allergen: "",
    allergy_type: "drug",
    severity: "mild",
    reaction: "",
    status: "active",
  });

  const [immunizationForm, setImmunizationForm] = useState<ImmunizationCreate>({
    patient: patientIdNum || 0,
    vaccine_name: "",
    administered_date: "",
  });

  const [familyHistoryForm, setFamilyHistoryForm] = useState<FamilyHistoryCreate>({
    patient: patientIdNum || 0,
    relationship: "father",
    condition: "",
    status: "living",
    notes: "",
  });

  const [socialHistoryForm, setSocialHistoryForm] = useState<SocialHistoryCreate>({
    patient: patientIdNum || 0,
  });

  useEffect(() => {
    if (patientIdNum) {
      fetchAllData();
    }
  }, [patientIdNum]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        medicalHistoriesData,
        vitalSignsData,
        allergiesData,
        immunizationsData,
        familyHistoriesData,
        socialHistoriesData,
      ] = await Promise.all([
        ehrService.getMedicalHistories(patientIdNum || undefined),
        ehrService.getVitalSigns(patientIdNum || undefined),
        ehrService.getAllergies(patientIdNum || undefined),
        ehrService.getImmunizations(patientIdNum || undefined),
        ehrService.getFamilyHistories(patientIdNum || undefined),
        ehrService.getSocialHistories(patientIdNum || undefined),
      ]);

      setMedicalHistories(medicalHistoriesData);
      setVitalSigns(vitalSignsData);
      setAllergies(allergiesData);
      setImmunizations(immunizationsData);
      setFamilyHistories(familyHistoriesData);
      setSocialHistories(socialHistoriesData);
    } catch (error) {
      console.error("Error fetching EHR data:", error);
      toast.error("Failed to load EHR data");
    } finally {
      setLoading(false);
    }
  };

  // Medical History handlers
  const handleMedicalHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicalHistory) {
        await ehrService.updateMedicalHistory(editingMedicalHistory.id, medicalHistoryForm);
        toast.success("Medical history updated successfully");
      } else {
        await ehrService.createMedicalHistory(medicalHistoryForm);
        toast.success("Medical history created successfully");
      }
      setShowMedicalHistoryModal(false);
      setEditingMedicalHistory(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save medical history");
    }
  };

  const handleDeleteMedicalHistory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this medical history?")) {
      try {
        await ehrService.deleteMedicalHistory(id);
        toast.success("Medical history deleted successfully");
        fetchAllData();
      } catch (error) {
        toast.error("Failed to delete medical history");
      }
    }
  };

  // Similar handlers for other types (I'll implement a few key ones)

  const handleVitalSignsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVitalSigns) {
        await ehrService.updateVitalSigns(editingVitalSigns.id, vitalSignsForm);
        toast.success("Vital signs updated successfully");
      } else {
        await ehrService.createVitalSigns(vitalSignsForm);
        toast.success("Vital signs recorded successfully");
      }
      setShowVitalSignsModal(false);
      setEditingVitalSigns(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save vital signs");
    }
  };

  const handleAllergySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAllergy) {
        await ehrService.updateAllergy(editingAllergy.id, allergyForm);
        toast.success("Allergy updated successfully");
      } else {
        await ehrService.createAllergy(allergyForm);
        toast.success("Allergy recorded successfully");
      }
      setShowAllergyModal(false);
      setEditingAllergy(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save allergy");
    }
  };

  const handleImmunizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingImmunization) {
        await ehrService.updateImmunization(editingImmunization.id, immunizationForm);
        toast.success("Immunization updated successfully");
      } else {
        await ehrService.createImmunization(immunizationForm);
        toast.success("Immunization recorded successfully");
      }
      setShowImmunizationModal(false);
      setEditingImmunization(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save immunization");
    }
  };

  const handleFamilyHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFamilyHistory) {
        await ehrService.updateFamilyHistory(editingFamilyHistory.id, familyHistoryForm);
        toast.success("Family history updated successfully");
      } else {
        await ehrService.createFamilyHistory(familyHistoryForm);
        toast.success("Family history recorded successfully");
      }
      setShowFamilyHistoryModal(false);
      setEditingFamilyHistory(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save family history");
    }
  };

  const handleSocialHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSocialHistory) {
        await ehrService.updateSocialHistory(editingSocialHistory.id, socialHistoryForm);
        toast.success("Social history updated successfully");
      } else {
        await ehrService.createSocialHistory(socialHistoryForm);
        toast.success("Social history recorded successfully");
      }
      setShowSocialHistoryModal(false);
      setEditingSocialHistory(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to save social history");
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout userName={userName}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Electronic Health Record</h1>
          <p className="text-gray-600">Patient ID: {patientIdNum}</p>
        </div>

        {/* Medical History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUserMd className="text-blue-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Medical History</h2>
            </div>
            <button
              onClick={() => setShowMedicalHistoryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Medical History
            </button>
          </div>
          <div className="space-y-3">
            {medicalHistories.length > 0 ? (
              medicalHistories.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.condition}</h3>
                      <p className="text-sm text-gray-600">Diagnosed: {new Date(item.diagnosis_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Status: {item.status} | Severity: {item.severity}</p>
                      {item.notes && <p className="text-sm text-gray-700 mt-2">{item.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMedicalHistory(item);
                          setMedicalHistoryForm({
                            patient: item.patient,
                            condition: item.condition,
                            diagnosis_date: item.diagnosis_date,
                            status: item.status,
                            severity: item.severity,
                            notes: item.notes,
                          });
                          setShowMedicalHistoryModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicalHistory(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No medical history records found</p>
            )}
          </div>
        </div>

        {/* Vital Signs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaHeartbeat className="text-red-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Vital Signs</h2>
            </div>
            <button
              onClick={() => setShowVitalSignsModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Record Vital Signs
            </button>
          </div>
          <div className="space-y-3">
            {vitalSigns.length > 0 ? (
              vitalSigns.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Recorded: {new Date(item.recorded_at).toLocaleString()}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {item.blood_pressure_systolic && (
                          <div>
                            <p className="text-xs text-gray-500">Blood Pressure</p>
                            <p className="font-semibold">{item.blood_pressure_systolic}/{item.blood_pressure_diastolic}</p>
                          </div>
                        )}
                        {item.heart_rate && (
                          <div>
                            <p className="text-xs text-gray-500">Heart Rate</p>
                            <p className="font-semibold">{item.heart_rate} bpm</p>
                          </div>
                        )}
                        {item.temperature && (
                          <div>
                            <p className="text-xs text-gray-500">Temperature</p>
                            <p className="font-semibold">{item.temperature}°{item.temperature_unit}</p>
                          </div>
                        )}
                        {item.weight && (
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="font-semibold">{item.weight} kg</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingVitalSigns(item);
                          setVitalSignsForm({
                            patient: item.patient,
                            recorded_at: item.recorded_at.slice(0, 16),
                            blood_pressure_systolic: item.blood_pressure_systolic,
                            blood_pressure_diastolic: item.blood_pressure_diastolic,
                            heart_rate: item.heart_rate,
                            temperature: item.temperature,
                            temperature_unit: item.temperature_unit,
                            respiratory_rate: item.respiratory_rate,
                            oxygen_saturation: item.oxygen_saturation,
                            weight: item.weight,
                            height: item.height,
                            notes: item.notes,
                          });
                          setShowVitalSignsModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No vital signs records found</p>
            )}
          </div>
        </div>

        {/* Allergies Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaAllergies className="text-yellow-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Allergies</h2>
            </div>
            <button
              onClick={() => setShowAllergyModal(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Allergy
            </button>
          </div>
          <div className="space-y-3">
            {allergies.length > 0 ? (
              allergies.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.allergen}</h3>
                      <p className="text-sm text-gray-600">Type: {item.allergy_type} | Severity: {item.severity}</p>
                      <p className="text-sm text-gray-700 mt-1">{item.reaction}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingAllergy(item);
                          setAllergyForm({
                            patient: item.patient,
                            allergen: item.allergen,
                            allergy_type: item.allergy_type,
                            severity: item.severity,
                            reaction: item.reaction,
                            diagnosed_date: item.diagnosed_date,
                            status: item.status,
                          });
                          setShowAllergyModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No allergy records found</p>
            )}
          </div>
        </div>

        {/* Immunizations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaSyringe className="text-green-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Immunizations</h2>
            </div>
            <button
              onClick={() => setShowImmunizationModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Immunization
            </button>
          </div>
          <div className="space-y-3">
            {immunizations.length > 0 ? (
              immunizations.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.vaccine_name}</h3>
                      <p className="text-sm text-gray-600">Administered: {new Date(item.administered_date).toLocaleDateString()}</p>
                      {item.dose_number && <p className="text-sm text-gray-600">Dose: {item.dose_number}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-800">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No immunization records found</p>
            )}
          </div>
        </div>

        {/* Family History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-purple-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Family History</h2>
            </div>
            <button
              onClick={() => setShowFamilyHistoryModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Family History
            </button>
          </div>
          <div className="space-y-3">
            {familyHistories.length > 0 ? (
              familyHistories.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.condition}</h3>
                      <p className="text-sm text-gray-600">Relationship: {item.relationship} | Status: {item.status}</p>
                      {item.age_at_diagnosis && <p className="text-sm text-gray-600">Age at diagnosis: {item.age_at_diagnosis}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-purple-600 hover:text-purple-800">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No family history records found</p>
            )}
          </div>
        </div>

        {/* Social History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUserFriends className="text-indigo-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Social History</h2>
            </div>
            <button
              onClick={() => setShowSocialHistoryModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Social History
            </button>
          </div>
          <div className="space-y-3">
            {socialHistories.length > 0 ? (
              socialHistories.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {item.occupation && <p className="text-sm text-gray-600">Occupation: {item.occupation}</p>}
                      {item.marital_status && <p className="text-sm text-gray-600">Marital Status: {item.marital_status}</p>}
                      {item.smoking_status && <p className="text-sm text-gray-600">Smoking: {item.smoking_status}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No social history records found</p>
            )}
          </div>
        </div>

        {/* Medical History Modal */}
        {showMedicalHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingMedicalHistory ? "Edit Medical History" : "Add Medical History"}
                </h3>
                <button
                  onClick={() => {
                    setShowMedicalHistoryModal(false);
                    setEditingMedicalHistory(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleMedicalHistorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <input
                    type="text"
                    value={medicalHistoryForm.condition}
                    onChange={(e) => setMedicalHistoryForm({ ...medicalHistoryForm, condition: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis Date</label>
                  <input
                    type="date"
                    value={medicalHistoryForm.diagnosis_date}
                    onChange={(e) => setMedicalHistoryForm({ ...medicalHistoryForm, diagnosis_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={medicalHistoryForm.status}
                    onChange={(e) => setMedicalHistoryForm({ ...medicalHistoryForm, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                    <option value="chronic">Chronic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={medicalHistoryForm.severity}
                    onChange={(e) => setMedicalHistoryForm({ ...medicalHistoryForm, severity: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={medicalHistoryForm.notes}
                    onChange={(e) => setMedicalHistoryForm({ ...medicalHistoryForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMedicalHistoryModal(false);
                      setEditingMedicalHistory(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vital Signs Modal */}
        {showVitalSignsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingVitalSigns ? "Edit Vital Signs" : "Record Vital Signs"}
                </h3>
                <button
                  onClick={() => {
                    setShowVitalSignsModal(false);
                    setEditingVitalSigns(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleVitalSignsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recorded At</label>
                  <input
                    type="datetime-local"
                    value={vitalSignsForm.recorded_at}
                    onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, recorded_at: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      value={vitalSignsForm.blood_pressure_systolic || ""}
                      onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, blood_pressure_systolic: Number(e.target.value) || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      value={vitalSignsForm.blood_pressure_diastolic || ""}
                      onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, blood_pressure_diastolic: Number(e.target.value) || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitalSignsForm.heart_rate || ""}
                    onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, heart_rate: Number(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalSignsForm.temperature || ""}
                      onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, temperature: Number(e.target.value) || undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      value={vitalSignsForm.temperature_unit}
                      onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, temperature_unit: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="C">Celsius</option>
                      <option value="F">Fahrenheit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalSignsForm.weight || ""}
                    onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, weight: Number(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={vitalSignsForm.notes || ""}
                    onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVitalSignsModal(false);
                      setEditingVitalSigns(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Allergy Modal */}
        {showAllergyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingAllergy ? "Edit Allergy" : "Add Allergy"}
                </h3>
                <button
                  onClick={() => {
                    setShowAllergyModal(false);
                    setEditingAllergy(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAllergySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergen</label>
                  <input
                    type="text"
                    value={allergyForm.allergen}
                    onChange={(e) => setAllergyForm({ ...allergyForm, allergen: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergy Type</label>
                  <select
                    value={allergyForm.allergy_type}
                    onChange={(e) => setAllergyForm({ ...allergyForm, allergy_type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="drug">Drug</option>
                    <option value="food">Food</option>
                    <option value="environmental">Environmental</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={allergyForm.severity}
                    onChange={(e) => setAllergyForm({ ...allergyForm, severity: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="life_threatening">Life Threatening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reaction</label>
                  <textarea
                    value={allergyForm.reaction}
                    onChange={(e) => setAllergyForm({ ...allergyForm, reaction: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
                  <input
                    type="date"
                    value={allergyForm.diagnosed_date || ""}
                    onChange={(e) => setAllergyForm({ ...allergyForm, diagnosed_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllergyModal(false);
                      setEditingAllergy(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Immunization Modal */}
        {showImmunizationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingImmunization ? "Edit Immunization" : "Add Immunization"}
                </h3>
                <button
                  onClick={() => {
                    setShowImmunizationModal(false);
                    setEditingImmunization(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleImmunizationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name</label>
                  <input
                    type="text"
                    value={immunizationForm.vaccine_name}
                    onChange={(e) => setImmunizationForm({ ...immunizationForm, vaccine_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Administered Date</label>
                  <input
                    type="date"
                    value={immunizationForm.administered_date}
                    onChange={(e) => setImmunizationForm({ ...immunizationForm, administered_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dose Number</label>
                  <input
                    type="number"
                    value={immunizationForm.dose_number || ""}
                    onChange={(e) => setImmunizationForm({ ...immunizationForm, dose_number: Number(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={immunizationForm.notes || ""}
                    onChange={(e) => setImmunizationForm({ ...immunizationForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImmunizationModal(false);
                      setEditingImmunization(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Family History Modal */}
        {showFamilyHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingFamilyHistory ? "Edit Family History" : "Add Family History"}
                </h3>
                <button
                  onClick={() => {
                    setShowFamilyHistoryModal(false);
                    setEditingFamilyHistory(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFamilyHistorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={familyHistoryForm.relationship}
                    onChange={(e) => setFamilyHistoryForm({ ...familyHistoryForm, relationship: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="grandfather">Grandfather</option>
                    <option value="grandmother">Grandmother</option>
                    <option value="uncle">Uncle</option>
                    <option value="aunt">Aunt</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <input
                    type="text"
                    value={familyHistoryForm.condition}
                    onChange={(e) => setFamilyHistoryForm({ ...familyHistoryForm, condition: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age at Diagnosis</label>
                  <input
                    type="number"
                    value={familyHistoryForm.age_at_diagnosis || ""}
                    onChange={(e) => setFamilyHistoryForm({ ...familyHistoryForm, age_at_diagnosis: Number(e.target.value) || undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={familyHistoryForm.status}
                    onChange={(e) => setFamilyHistoryForm({ ...familyHistoryForm, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="living">Living</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={familyHistoryForm.notes || ""}
                    onChange={(e) => setFamilyHistoryForm({ ...familyHistoryForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFamilyHistoryModal(false);
                      setEditingFamilyHistory(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Social History Modal */}
        {showSocialHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingSocialHistory ? "Edit Social History" : "Add Social History"}
                </h3>
                <button
                  onClick={() => {
                    setShowSocialHistoryModal(false);
                    setEditingSocialHistory(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSocialHistorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={socialHistoryForm.occupation || ""}
                    onChange={(e) => setSocialHistoryForm({ ...socialHistoryForm, occupation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={socialHistoryForm.marital_status || ""}
                    onChange={(e) => setSocialHistoryForm({ ...socialHistoryForm, marital_status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
                  <select
                    value={socialHistoryForm.smoking_status || ""}
                    onChange={(e) => setSocialHistoryForm({ ...socialHistoryForm, smoking_status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="never">Never Smoked</option>
                    <option value="former">Former Smoker</option>
                    <option value="current">Current Smoker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Use</label>
                  <select
                    value={socialHistoryForm.alcohol_use || ""}
                    onChange={(e) => setSocialHistoryForm({ ...socialHistoryForm, alcohol_use: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="none">None</option>
                    <option value="occasional">Occasional</option>
                    <option value="moderate">Moderate</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Frequency</label>
                  <select
                    value={socialHistoryForm.exercise_frequency || ""}
                    onChange={(e) => setSocialHistoryForm({ ...socialHistoryForm, exercise_frequency: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="none">None</option>
                    <option value="rare">Rare</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSocialHistoryModal(false);
                      setEditingSocialHistory(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <FaSave className="inline mr-2" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminDashboardLayout>
  );
};

export default EHRPage;