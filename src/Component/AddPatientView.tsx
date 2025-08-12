import { PatientView } from "./PatientView";
import  AdminDashboardLayout  from "./AdminDashboardLayout";

export const AddPatientView = () => {
  return (
    <AdminDashboardLayout userName="Dr. Akintoye">
      <PatientView />
    </AdminDashboardLayout>
  );
}