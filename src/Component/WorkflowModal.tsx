import { ArrowRight, User, Calendar, Stethoscope, TestTube, FileText, MessageSquare } from "lucide-react"

interface WorkflowPanelProps {
  isVisible: boolean
  userRole?: string
}

const WorkflowPanel = ({ isVisible, userRole = "doctor" }: WorkflowPanelProps) => {

  const workflowSteps = [
    {
      id: 1,
      title: "Patient Registration",
      description: "Add new patients with personal information, medical history, and contact details",
      icon: User,
      color: "bg-blue-500",
      component: "AddPatient",
      roles: ["admin", "doctor", "nurse"]
    },
    {
      id: 2,
      title: "Appointment Scheduling",
      description: "Schedule appointments, select time slots, and assign doctors",
      icon: Calendar,
      color: "bg-green-500",
      component: "AppointmentModal",
      roles: ["admin", "doctor", "nurse"]
    },
    {
      id: 3,
      title: "Diagnostic Tests",
      description: "Order and track diagnostic tests like blood tests, X-rays, and MRIs",
      icon: Stethoscope,
      color: "bg-purple-500",
      component: "Diagnostics",
      roles: ["doctor"]
    },
    {
      id: 4,
      title: "Lab Results",
      description: "Upload and review laboratory test results and reports",
      icon: TestTube,
      color: "bg-orange-500",
      component: "LabResult",
      roles: ["doctor", "nurse"]
    },
    {
      id: 5,
      title: "Reports Generation",
      description: "Generate clinical, administrative, and financial reports",
      icon: FileText,
      color: "bg-red-500",
      component: "ReportPages",
      roles: ["admin", "doctor", "nurse", "pharmacy"]
    },
    {
      id: 6,
      title: "Communication",
      description: "Chat with patients, colleagues, and support team",
      icon: MessageSquare,
      color: "bg-indigo-500",
      component: "ChatPage",
      roles: ["admin", "doctor", "nurse", "pharmacy", "patient"]
    }
  ]

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor": return "Doctor"
      case "nurse": return "Nurse"
      case "pharmacy": return "Pharmacist"
      case "admin": return "Administrator"
      default: return "User"
    }
  }

  const accessibleSteps = workflowSteps.filter(step =>
    step.roles.includes(userRole) || step.roles.includes("admin")
  )

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-2xl border-l border-gray-200 transition-transform duration-300 z-40 ${isVisible ? 'translate-x-0' : 'translate-x-full'} w-96`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-semibold text-white">EMR Workflow Process</h2>
            <p className="text-blue-100 text-sm">
              {getRoleDisplayName(userRole)} Portal - Complete Patient Care Journey
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Care Workflow</h3>
          <p className="text-gray-600">
            Follow the complete journey from patient registration to final reporting.
            Each step builds upon the previous one to ensure comprehensive care.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {accessibleSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-lg flex items-center justify-center`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {step.id}. {step.title}
                    </h4>
                    <span className="px-2 py-1 bg-white text-xs font-medium text-gray-600 rounded-full">
                      {step.component}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Roles: {step.roles.map(role => getRoleDisplayName(role)).join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < accessibleSteps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Workflow Summary */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Workflow Summary</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Patient Registration:</strong> Foundation of all care activities</p>
            <p>• <strong>Appointment Scheduling:</strong> Coordinates timing and resources</p>
            <p>• <strong>Diagnostic Tests:</strong> Identifies medical conditions and needs</p>
            <p>• <strong>Lab Results:</strong> Provides detailed test analysis and findings</p>
            <p>• <strong>Reports Generation:</strong> Documents care and enables analysis</p>
            <p>• <strong>Communication:</strong> Ensures continuous patient engagement</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowPanel