interface DashboardContentProps {
  doctorName?: string;
}

const DashboardContent = ({ doctorName = "Doctor Name" }: DashboardContentProps) => {
  return (
    <div className="p-6">
      {/* Greeting Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Good Morning, <span className="text-orange-500">{doctorName}</span>
            </h2>
            <p className="text-gray-600">Have a nice day at work</p>
          </div>
          
          {/* Doctor Illustration */}
          <div className="flex-shrink-0 ml-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Simple doctor illustration using CSS */}
              <div className="relative">
                {/* Doctor figure */}
                <div className="w-16 h-20 bg-blue-500 rounded-t-full relative">
                  {/* Head */}
                  <div className="w-8 h-8 bg-orange-200 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
                  {/* Stethoscope */}
                  <div className="w-1 h-6 bg-gray-600 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                </div>
                {/* Medical elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="absolute top-4 -right-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional dashboard content can go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Stats</h3>
          <p className="text-gray-600">Dashboard metrics will appear here</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-gray-600">Recent activities will appear here</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          <p className="text-gray-600">System notifications will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
