import SidebarAdmin from './SideBarAdmin';
import TopBarAdmin from './TopBarAdmin';
import { type ReactNode } from 'react';

interface AdminDashboardLayoutProps {
  children: ReactNode;
  doctorName?: string;
}

const AdminDashboardLayout = ({ children, doctorName = "Doctor" }: AdminDashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <SidebarAdmin />
      
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBarAdmin doctorName={doctorName} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
