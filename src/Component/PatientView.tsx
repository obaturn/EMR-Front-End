import { FaPlus, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"



export const PatientView = () => {
  const navigate = useNavigate()

  const handleAddPatientClick = () => {
    navigate("/admin/add-patient")
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Patient Management</h1>

        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients by name, ID, or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Add Patient Button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={handleAddPatientClick}
        >
          <FaPlus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Patient List/Grid would go here */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient List</h2>
        <div className="text-gray-500 text-center py-8">No patients found. Click "Add Patient" to get started.</div>
      </div>
    </div>
  )
}
