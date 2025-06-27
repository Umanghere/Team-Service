import React from 'react';
import BarGraph from '../../Elements/BarGraph/BarGraph';
import Cards from '../../Elements/Cards/Cards';
import PieChart from '../../Elements/PieChart/PieChart';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your team management dashboard</p>
      </div>
      
      {/* Info Cards */}
      <div className="mb-10">
        <Cards />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Performance</h2>
          <div className="h-80">
            <BarGraph />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribution</h2>
          <div className="h-80">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;