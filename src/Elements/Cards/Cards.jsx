import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cards = () => {
  const [teamData, setTeamData] = useState({
    totalEmployees: 0,
    presentEmployees: 0,
    onLeave: 0,
    trainingCompleted: 0
  });

  useEffect(() => {
    // Fetch employees data
    axios.get("https://teamservices-backend.onrender.com/employeesData")
      .then(response => {
        setTeamData(prevData => ({
          ...prevData,
          totalEmployees: response.data.length
        }));
      })
      .catch(error => {
        console.error("Error fetching employees data:", error);
      });

    // Fetch attendance data
    axios.get("https://teamservices-backend.onrender.com/attendanceData")
      .then(response => {
        // Calculate present and leave counts
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = response.data.filter(item => item.date === today);
        
        if (todayAttendance.length > 0) {
          const presentCount = todayAttendance.filter(item => item.status === 'present').length;
          const leaveCount = todayAttendance.filter(item => item.status === 'leave').length;
          
          setTeamData(prevData => ({
            ...prevData,
            presentEmployees: presentCount,
            onLeave: leaveCount
          }));
        }
      })
      .catch(error => {
        console.error("Error fetching attendance data:", error);
      });
    
    // Fetch training data
    axios.get("https://teamservices-backend.onrender.com/trainingData")
      .then(response => {
        const completedTrainings = response.data.filter(item => 
          item.status === 'completed' || item.status === 'Completed'
        ).length;
        
        setTeamData(prevData => ({
          ...prevData,
          trainingCompleted: completedTrainings
        }));
      })
      .catch(error => {
        console.error("Error fetching training data:", error);
      });
  }, []);

  const cards = [
    {
      title: "Total Employees",
      value: teamData.totalEmployees,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-blue-100"
    },
    {
      title: "Present Today",
      value: teamData.presentEmployees,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "from-green-500 to-green-600",
      textColor: "text-green-100"
    },
    {
      title: "On Leave",
      value: teamData.onLeave,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-100"
    },
    {
      title: "Trainings Completed",
      value: teamData.trainingCompleted,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgColor: "from-purple-500 to-purple-600",
      textColor: "text-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-gradient-to-br ${card.bgColor} rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
        >
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className={`text-lg font-medium ${card.textColor} opacity-80`}>{card.title}</p>
              <p className="text-4xl font-bold text-white my-6">{card.value}</p>
            </div>
            <div className={`${card.textColor}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;