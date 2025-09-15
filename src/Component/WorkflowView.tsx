import { ArrowRight, User, Calendar, Stethoscope, TestTube, FileText, MessageSquare } from "lucide-react"

interface WorkflowViewProps {
  userRole?: string
  userName?: string
}

export const WorkflowView = ({ userRole = "doctor", userName = "User" }: WorkflowViewProps) => {

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">EMR Workflow Process</h1>
              <p className="text-gray-600 mt-1">Complete patient care journey for {getRoleDisplayName(userRole)} - {userName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Care Workflow</h3>
            <p className="text-gray-600">
              Follow the complete journey from patient registration to final reporting.
              Each step builds upon the previous one to ensure comprehensive care.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            {accessibleSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`flex-shrink-0 w-16 h-16 ${step.color} rounded-lg flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {step.id}. {step.title}
                      </h4>
                      <span className="px-3 py-1 bg-white text-sm font-medium text-gray-600 rounded-full border">
                        {step.component}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-lg">{step.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">Accessible by:</span>
                      <span>{step.roles.map(role => getRoleDisplayName(role)).join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < accessibleSteps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Workflow Summary */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-xl font-semibold text-blue-800 mb-3">Workflow Summary</h4>
            <div className="text-base text-blue-700 space-y-2">
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
    </div>
  )
}