import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Cards = () => {
  const { userRole, userName, userEmpId } = useAuth();
  
  const [employeesData, setEmployeesData] = useState([]);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [uniqueProjectCount, setUniqueProjectCount] = useState(0);
  const [trainingsToday, setTrainingsToday] = useState(0);
  const [trainingsThisWeek, setTrainingsThisWeek] = useState(0);
  const [viewerTrainingsToday, setViewerTrainingsToday] = useState(0);
  const [viewerTrainingsThisWeek, setViewerTrainingsThisWeek] = useState(0);

  useEffect(() => {
    fetchEmployeesData();
    fetchTrainingData();
  }, [userName, userRole]);

  const fetchEmployeesData = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/employeesData`)
      .then((response) => {
        setEmployeesData(response.data);
        setTeamMemberCount(response.data.length);
        calculateUniqueProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees data: ", error);
      });
  };

  const calculateUniqueProjects = (data) => {
    const uniqueProjects = new Set(data.map((employee) => employee.Project));
    setUniqueProjectCount(uniqueProjects.size);
  };

  const fetchTrainingData = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/trainingData`)
      .then((response) => {
        calculateTrainingData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching training data: ", error);
      });
  };

  const calculateTrainingData = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999); // Set end of the week to last millisecond

    let totalTrainingsTodayCount = 0;
    let totalTrainingsThisWeekCount = 0;
    let viewerTrainingsTodayCount = 0;
    let viewerTrainingsThisWeekCount = 0;

    data.forEach((training) => {
      const plannedDate = new Date(training.PlannedDate);
      const startDate = new Date(training.StartDate);
      const endDate = new Date(training.EndDate);
      const title = training.TrainingTitle;

      // Extract the name part from training.Name
      const namePart = training.Name.split("(")[0].trim();
      const isUserTraining = namePart === userName.trim();

      // Check if the training is scheduled to start or end today
      if (
        (startDate <= today && today <= endDate) ||
        plannedDate.toDateString() === today.toDateString()
      ) {
        if (userRole === "viewer" && isUserTraining) {
          viewerTrainingsTodayCount += title.includes(",")
            ? title.split(",").length
            : 1;
        } else if (userRole !== "viewer") {
          totalTrainingsTodayCount += title.includes(",")
            ? title.split(",").length
            : 1;
        }
      }

      // Check if the training falls within this week
      if (
        (startDate >= startOfWeek && startDate <= endOfWeek) ||
        (plannedDate >= startOfWeek && plannedDate <= endOfWeek)
      ) {
        if (userRole === "viewer" && isUserTraining) {
          viewerTrainingsThisWeekCount += title.includes(",")
            ? title.split(",").length
            : 1;
        } else if (userRole !== "viewer") {
          totalTrainingsThisWeekCount += title.includes(",")
            ? title.split(",").length
            : 1;
        }
      }
    });

    setTrainingsToday(totalTrainingsTodayCount);
    setTrainingsThisWeek(totalTrainingsThisWeekCount);
    setViewerTrainingsToday(viewerTrainingsTodayCount);
    setViewerTrainingsThisWeek(viewerTrainingsThisWeekCount);
  };

  const cards = [
    {
      title: "Team Employees",
      value: teamMemberCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "from-teal-500 to-teal-600",
      textColor: "text-teal-100"
    },
    {
      title: "Team Projects",
      value: uniqueProjectCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-blue-100"
    },
    {
      title: "WFO/WFH/Leave",
      value: "0 / 0 / 0",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v12" />
        </svg>
      ),
      bgColor: "from-purple-500 to-purple-600",
      textColor: "text-purple-100"
    },
    {
      title: "Training Today/Week",
      value: userRole === "viewer"
        ? `${viewerTrainingsToday}/${viewerTrainingsThisWeek}`
        : `${trainingsToday}/${trainingsThisWeek}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "from-orange-500 to-orange-600",
      textColor: "text-orange-100"
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