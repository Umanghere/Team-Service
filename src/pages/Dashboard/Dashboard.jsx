import React from 'react';
import BarGraph from '../../Elements/BarGraph/BarGraph';
import Cards from '../../Elements/Cards/Cards';
import PieChart from '../../Elements/PieChart/PieChart';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl pb-3 font-bold text-gray-700">"Welcome to your Team Management Dashboard"</h1>
        {/* <p className="text-gray-600 mt-2">Welcome to your team management dashboard</p> */}
      </div>
      
      {/* Info Cards */}
      <div className="mb-10">
        <Cards />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 hover:border-blue-200/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
            Team Performance
          </h2>
          <div className="relative min-h-80 w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent rounded-lg"></div>
            <div className="relative z-10 w-full">
              <BarGraph />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 hover:border-green-200/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></span>
            Distribution
          </h2>
          <div className="relative min-h-80 w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-transparent rounded-lg"></div>
            <div className="relative z-10 w-full">
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;