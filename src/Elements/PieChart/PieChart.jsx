import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./PieChart.css";

const PieChart = () => {
  const [data, setData] = useState([["Skill", "Count"]]);

  useEffect(() => {
    // Fetch employee data from MongoDB through the backend API
    axios.get("http://localhost:5000/employeesData")
      .then((response) => {
        const employees = response.data;
        calculateSkillDistribution(employees);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
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

    const chartData = [["Skill", "Count"]];
    skillCountMap.forEach((count, skill) => {
      chartData.push([skill, count]);
    });

    setData(chartData.length > 1 ? chartData : [["Skill", "Count"], ["No Data", 1]]);
  };

  const options = {
    title: "Team Competency",
    titleTextStyle: {
      fontSize: 20,
      bold: true,
    },
    legend: { position: "left", textStyle: { fontSize: 16 } },
    pieSliceTextStyle: { fontSize: 18 },
    chartArea: { width: "70%", height: "70%" },
    colors: ["#199555", "#F1C617", "#0082FF", "#93C747"],
  };

  return (
    <div className="pie-chart-container" style={{ boxShadow: "5px 5px 22px 8px rgba(0, 0, 0, 0.1)" }}>
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default PieChart;
