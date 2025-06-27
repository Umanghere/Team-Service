import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./PieChart.css";

const PieChart = () => {
  const [data, setData] = useState([["Skill", "Count"]]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch employee data from MongoDB through the backend API
    setLoading(true);
    axios.get("https://teamservices-backend.onrender.com/employeesData")
      .then((response) => {
        const employees = response.data;
        calculateSkillDistribution(employees);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setLoading(false);
      });
  }, []);

  const calculateSkillDistribution = (employees) => {
    const skillCountMap = new Map();

    employees.forEach((employee) => {
      const skillsArray = employee.Skills ? employee.Skills.split(",") : [];
      skillsArray.forEach((skill) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill) {
          skillCountMap.set(trimmedSkill, (skillCountMap.get(trimmedSkill) || 0) + 1);
        }
      });
    });

    // Get the top skills (limit to 8 to avoid overcrowding)
    const sortedSkills = [...skillCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const chartData = [["Skill", "Count"]];
    sortedSkills.forEach(([skill, count]) => {
      chartData.push([skill, count]);
    });

    setData(chartData.length > 1 ? chartData : [["Skill", "Count"], ["No Data", 1]]);
  };

  const options = {
    title: "Team Competency",
    titleTextStyle: {
      fontSize: 20,
      fontName: "Inter, sans-serif",
      bold: true,
      color: "#374151"
    },
    legend: { 
      position: "right", 
      alignment: "center",
      textStyle: { 
        fontSize: 12, 
        color: "#4B5563",
        fontName: "Inter, sans-serif"
      }
    },
    pieSliceTextStyle: { 
      fontSize: 14,
      color: "#ffffff",
      fontName: "Inter, sans-serif"
    },
    pieSliceBorderColor: "#ffffff",
    pieSliceText: "percentage",
    chartArea: { width: "80%", height: "80%" },
    colors: [
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#10B981", // Green
      "#3B82F6", // Blue
      "#F59E0B", // Amber
      "#6366F1", // Indigo
      "#EF4444", // Red
      "#06B6D4"  // Cyan
    ],
    backgroundColor: "transparent",
    is3D: false,
    sliceVisibilityThreshold: 0.03,
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <div className="pie-chart-container">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      )}
    </div>
  );
};

export default PieChart;