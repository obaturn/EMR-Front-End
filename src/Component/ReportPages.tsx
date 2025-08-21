"use client";

import { useState, useEffect } from "react";
import { FaChartBar, FaUserMd, FaShieldAlt, FaMoneyBillWave, FaDownload, FaEye, FaFilter, FaPlus, FaTimes } from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { reportService} from "../ApiService/reportService";
import type{ GeneratedReport, GenerateReportData, ReportData } from "../ApiService/reportService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ReportsPageProps {
  userRole?: string;
  userName?: string;
}

const ReportsPage = ({ userRole = "doctor", userName = "Dr. Akintoye" }: ReportsPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportForGeneration, setSelectedReportForGeneration] = useState<string>("");
  const [dateRangeStart, setDateRangeStart] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("all");
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [includeDemographics, setIncludeDemographics] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [includeDetailedRecords, setIncludeDetailedRecords] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<ReportData | null>(null);

  const reportCategories = [
    {
      id: "clinical",
      title: "Clinical Reports",
      icon: FaUserMd,
      color: "bg-blue-500",
      description: "Patient care and medical reports",
      reports: [
        { name: "Patient Summary Report", description: "Complete medical history and current status" },
        { name: "Lab Results Trends", description: "Laboratory test results over time" },
        { name: "Medication Reports", description: "Current prescriptions and drug interactions" },
        { name: "Vital Signs Tracking", description: "Blood pressure, weight, temperature trends" },
        { name: "Chronic Disease Management", description: "Diabetes, hypertension monitoring" },
      ],
    },
    {
      id: "administrative",
      title: "Administrative Reports",
      icon: FaChartBar,
      color: "bg-green-500",
      description: "Operational and management reports",
      reports: [
        { name: "Appointment Analytics", description: "No-shows, cancellations, scheduling efficiency" },
        { name: "Provider Productivity", description: "Patients seen per day, appointment duration" },
        { name: "Revenue Reports", description: "Billing, insurance claims, payment tracking" },
        { name: "Capacity Planning", description: "Room utilization, staff scheduling" },
        { name: "Patient Demographics", description: "Age groups, insurance types, locations" },
      ],
    },
    {
      id: "quality",
      title: "Quality & Compliance",
      icon: FaShieldAlt,
      color: "bg-purple-500",
      description: "Quality measures and regulatory compliance",
      reports: [
        { name: "HIPAA Audit Logs", description: "Patient data access tracking" },
        { name: "Quality Measures", description: "Preventive care compliance rates" },
        { name: "Patient Safety Reports", description: "Adverse events, medication errors" },
        { name: "Regulatory Reporting", description: "Government-required health statistics" },
        { name: "Accreditation Reports", description: "Joint Commission compliance" },
      ],
    },
    {
      id: "financial",
      title: "Financial Reports",
      icon: FaMoneyBillWave,
      color: "bg-orange-500",
      description: "Billing and financial analysis",
      reports: [
        { name: "Revenue Analysis", description: "Monthly and quarterly revenue trends" },
        { name: "Insurance Claims", description: "Claims status and reimbursement rates" },
        { name: "Outstanding Balances", description: "Patient payment tracking" },
        { name: "Cost Analysis", description: "Operational costs and profitability" },
        { name: "Budget vs Actual", description: "Financial performance comparison" },
      ],
    },
  ];

  const getAccessibleCategories = () => {
    switch (userRole) {
      case "doctor":
        return reportCategories;
      case "nurse":
        return reportCategories.filter((cat) => cat.id === "clinical" || cat.id === "quality");
      case "pharmacy":
        return reportCategories.filter((cat) => cat.id === "administrative" || cat.id === "financial");
      default:
        return reportCategories.filter((cat) => cat.id === "clinical");
    }
  };

  const accessibleCategories = getAccessibleCategories();

  const filteredCategories = accessibleCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.reports.some((report) => report.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isReportGenerated = (reportName: string) => {
    return generatedReports.some((report) => report.name === reportName);
  };

  const getGeneratedReport = (reportName: string) => {
    return generatedReports.find((report) => report.name === reportName);
  };

  const handleGenerateReport = (reportName: string) => {
    setSelectedReportForGeneration(reportName);
    setShowGenerateModal(true);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await reportService.getReports(selectedCategory);
        setGeneratedReports(reports);
      } catch (error) {
        toast.error("Failed to fetch reports. Please try again.");
        console.error("Failed to fetch reports:", error);
      }
    };
    fetchReports();
  }, [selectedCategory]);

  const handleConfirmGenerate = async () => {
    try {
      const reportData: GenerateReportData = {
        name: selectedReportForGeneration,
        date_range_start: dateRangeStart || undefined,
        date_range_end: dateRangeEnd || undefined,
        department,
        format: reportFormat,
        include_demographics: includeDemographics,
        include_statistics: includeStatistics,
        include_detailed_records: includeDetailedRecords,
        category: reportCategories.find((cat) =>
          cat.reports.some((r) => r.name === selectedReportForGeneration)
        )?.id,
      };
      const newReport = await reportService.generateReport(reportData);
      setGeneratedReports((prev) => [
        ...prev.filter((r) => r.name !== selectedReportForGeneration),
        newReport,
      ]);
      setShowGenerateModal(false);
      setSelectedReportForGeneration("");
      toast.success("Report generated successfully!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || "Failed to generate report.";
      toast.error(errorMessage);
      console.error("Failed to generate report:", error);
    }
  };

  const handleViewReport = async (reportName: string) => {
    try {
      const report = generatedReports.find((r) => r.name === reportName);
      if (!report?.id) {
        toast.error("Report ID not found.");
        return;
      }
      console.log('Fetching report data for ID:', report.id);
      const reportData = await reportService.getReportData(report.id);
      console.log('Report data:', reportData);
      setSelectedReportData(reportData);
      setShowViewModal(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to view report data.";
      toast.error(errorMessage);
      console.error("Failed to view report:", error);
    }
  };

  const handleDownloadReport = async (reportName: string) => {
    try {
      const report = generatedReports.find((r) => r.name === reportName);
      if (!report?.id) {
        toast.error("Report ID not found.");
        return;
      }
      const fileName = `${reportName.replace(' ', '_')}_${report.generatedDate}.${report.format}`;
      await reportService.viewReport(report.id, fileName);
      toast.success("Report downloaded successfully!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to download report.";
      toast.error(errorMessage);
      console.error("Failed to download report:", error);
    }
  };

  const handleExportAll = async () => {
    try {
      await reportService.exportAllReports();
      toast.success("All reports exported successfully!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to export all reports.";
      toast.error(errorMessage);
      console.error("Failed to export all reports:", error);
    }
  };

  const getTotalGeneratedReports = () => {
    return generatedReports.length;
  };

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view comprehensive EMR reports</p>
          <p className="text-sm text-gray-500 mt-1">
            {getTotalGeneratedReports() === 0
              ? "No reports generated yet"
              : `${getTotalGeneratedReports()} report${getTotalGeneratedReports() > 1 ? "s" : ""} generated`}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <button
              onClick={handleExportAll}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                getTotalGeneratedReports() > 0
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={getTotalGeneratedReports() === 0}
            >
              <FaDownload className="w-4 h-4" />
              Export All ({getTotalGeneratedReports()})
            </button>
          </div>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCategories.map((category) => {
              const categoryGeneratedCount = category.reports.filter((report) => isReportGenerated(report.name)).length;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${category.color} p-3 rounded-lg`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.title}</h3>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <div>{category.reports.length} reports available</div>
                          <div className="text-xs">
                            {categoryGeneratedCount === 0 ? "None generated" : `${categoryGeneratedCount} generated`}
                          </div>
                        </div>
                        <span className="text-orange-500 text-sm font-medium">View Reports →</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedCategory(undefined)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                ← Back to Categories
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {reportCategories.find((cat) => cat.id === selectedCategory)?.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reportCategories
                .find((cat) => cat.id === selectedCategory)
                ?.reports.map((report, index) => {
                  const generated = getGeneratedReport(report.name);
                  const hasBeenGenerated = isReportGenerated(report.name);

                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.name}</h3>
                          <p className="text-gray-600 mb-2">{report.description}</p>
                          <div className="text-sm text-gray-500">
                            {hasBeenGenerated ? (
                              <div>
                                <div>Last generated: {generated?.generatedDate}</div>
                                <div>Generated by: {generated?.generatedBy}</div>
                              </div>
                            ) : (
                              <div className="text-gray-400">Never generated</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasBeenGenerated && (
                            <>
                              <button
                                onClick={() => handleViewReport(report.name)}
                                className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                                title="View the last generated report"
                              >
                                <FaEye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadReport(report.name)}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                title="Download the last generated report"
                              >
                                <FaDownload className="w-4 h-4" />
                                Download
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleGenerateReport(report.name)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            title={
                              hasBeenGenerated
                                ? "Generate a new report with current data"
                                : "Generate this report for the first time"
                            }
                          >
                            <FaPlus className="w-4 h-4" />
                            {hasBeenGenerated ? "Generate New" : "Generate"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Generate Report: {selectedReportForGeneration}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="General">General</option>
                  <option value="Emergency">Emergency</option>
                  <option value="OPD">OPD</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value as "pdf" | "excel" | "csv")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Include</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeDemographics}
                      onChange={(e) => setIncludeDemographics(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Patient Demographics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeStatistics}
                      onChange={(e) => setIncludeStatistics(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Summary Statistics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeDetailedRecords}
                      onChange={(e) => setIncludeDetailedRecords(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Detailed Records</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGenerate}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedReportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Report: {selectedReportData.report_name}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Generated on: {new Date(selectedReportData.generated_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">Generated by: {selectedReportData.generated_by}</p>
            {selectedReportData.patients.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Patient ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReportData.patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{patient.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.first_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.last_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.age ?? 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.gender}</td>
                      <td className="border border-gray-300 px-4 py-2">{patient.category}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(patient.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No patient data available for this report.</p>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </AdminDashboardLayout>
  );
};

export default ReportsPage;