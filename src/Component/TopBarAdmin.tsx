import { FaBell, FaEllipsisV } from 'react-icons/fa';

interface TopBarAdminProps {
  doctorName?: string;
}

const TopBarAdmin = ({ doctorName = "Doctor Name" }: TopBarAdminProps) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-gray-800">S10 Health Safecare Pvt Ltd</span>
          </div>
          <div className="ml-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Fit App Users</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <FaBell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{doctorName}</p>
              <p className="text-xs text-gray-500">Doctor</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {doctorName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <FaEllipsisV className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default TopBarAdmin;
