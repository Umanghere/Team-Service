import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import styles from "./WFO.module.css";

function CalendarTable() {
  const { userRole, userEmail } = useAuth();
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [daysInSelectedMonth, setDaysInSelectedMonth] = useState(30);
  const [userNameAndId, setUserNameAndId] = useState("");
  const [wfoPreferences, setWfoPreferences] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
  });

  const [cellStates, setCellStates] = useState({});
  const [toCount, setToCount] = useState(0);
  const [thCount, setThCount] = useState(0);
  const [tlCount, setTlCount] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users?email=${userEmail}`)
      .then((response) => {
        const user = response.data[0];
        if (user) {
          setUserNameAndId(`${user.Name}(${user.EmpId})`);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userEmail]);

  useEffect(() => {
    updateDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (userNameAndId) {
      fetchPreferences();
    }
  }, [userNameAndId, location]);

  const handleMonthChange = (event) => {
    const newMonth = new Date(event.target.value);
    setSelectedMonth(newMonth);
  };

  const updateDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    setDaysInSelectedMonth(days);
  };

  const handleCheckboxChange = (event) => {
    setWfoPreferences({
      ...wfoPreferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleApply = () => {
    const selectedDays = Object.keys(wfoPreferences).filter(
      (day) => wfoPreferences[day]
    );
    const newState = {};

    for (let i = 1; i <= daysInSelectedMonth; i++) {
      const currentDate = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        i
      );
      const dayName = getDayName(currentDate);
      let state;

      if (selectedDays.includes(dayName)) {
        state = "O"; // Office
      } else if (isWeekend(currentDate)) {
        state = "BH"; // Weekend
      } else {
        state = "H"; // Home
      }

      newState[i] = state;
    }

    setCellStates(newState);
    updateCounts(newState);
  };

  const updateCounts = (state) => {
    let to = 0; // Work from Office
    let th = 0; // Work from Home
    let tl = 0; // Leave/Holiday

    for (let i = 1; i <= daysInSelectedMonth; i++) {
      const dayState = state[i];
      if (dayState === "O") {
        to++;
      } else if (dayState === "H") {
        th++;
      } else if (
        dayState === "L" &&
        !isWeekend(
          new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i)
        )
      ) {
        tl++;
      }
    }

    setToCount(to);
    setThCount(th);
    setTlCount(tl);
  };

  const handleCellClick = (day) => {
    setCellStates((prev) => {
      const newState = { ...prev };
      if (newState[day] === "O") {
        newState[day] = "H";
      } else if (newState[day] === "H") {
        newState[day] = "L";
      } else if (newState[day] === "L") {
        newState[day] = "O";
      }
      updateCounts(newState);
      return newState;
    });
  };

  const getDayName = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[date.getDay()];
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday (0) or Saturday (6)
  };

  const fetchPreferences = () => {
    const monthYear = `${selectedMonth.getFullYear()}-${String(
      selectedMonth.getMonth() + 1
    ).padStart(2, "0")}`;
    axios
      .get(
        `http://localhost:8000/employeeAttendances?name=${encodeURIComponent(
          userNameAndId
        )}&month=${monthYear}`
      )
      .then((response) => {
        const data = response.data[0];
        if (data) {
          const savedStates = data.values.reduce((acc, obj) => {
            const [key, value] = Object.entries(obj)[0];
            const day = new Date(key).getDate();
            acc[day] = value;
            return acc;
          }, {});
          setCellStates(savedStates);
          setToCount(data.TO);
          setThCount(data.TH);
          setTlCount(data.TL);
        }
      })
      .catch((error) => console.error("Error fetching preferences:", error));
  };

  const handleSave = () => {
    const monthYear = `${selectedMonth.getFullYear()}-${String(
      selectedMonth.getMonth() + 1
    ).padStart(2, "0")}`;
    const data = {
      month: monthYear,
      name: userNameAndId,
      values: Object.keys(cellStates).map((day) => ({
        [`${selectedMonth.getFullYear()}-${String(
          selectedMonth.getMonth() + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`]: cellStates[day],
      })),
      TO: toCount,
      TH: thCount,
      TL: tlCount,
    };

    axios
      .get(
        `http://localhost:8000/employeeAttendances?name=${encodeURIComponent(
          userNameAndId
        )}&month=${monthYear}`
      )
      .then((response) => {
        const existingData = response.data[0];
        if (existingData) {
          axios
            .put(
              `http://localhost:8000/employeeAttendances/${existingData.id}`,
              data
            )
            .then(() => {
              setSnackbarMessage(
                `Attendance updated successfully for ${userNameAndId}`
              );
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              console.log("Preferences updated successfully");
            })
            .catch((error) => {
              setSnackbarMessage("Error updating preferences");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
              console.error("Error updating preferences:", error);
            });
        } else {
          axios
            .post("http://localhost:8000/employeeAttendances", data)
            .then(() => {
              setSnackbarMessage(
                `Attendance saved successfully for ${userNameAndId}`
              );
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              console.log("Preferences saved successfully");
            })
            .catch((error) => {
              setSnackbarMessage("Error saving preferences");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
              console.error("Error saving preferences:", error);
            });
        }
      })
      .catch((error) => {
        setSnackbarMessage("Error fetching existing data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error fetching existing data:", error);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="border-2 rounded-md bg-gray-50 py-4 m-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-6 px-4">
          <div className="flex items-center gap-3">
            <label htmlFor="monthSelector" className="text-lg font-medium">
              Forecast Month:
            </label>
            <input
              type="month"
              id="monthSelector"
              name="monthSelector"
              className="border-2 border-gray-400 rounded-md p-2 text-lg focus:border-blue-500 focus:outline-none"
              value={selectedMonth.toISOString().slice(0, 7)}
              onChange={handleMonthChange}
            />
          </div>

          {userRole === "viewer" && (
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-lg font-medium">WFO preferences:</label>
              <div className="flex gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <label key={day} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      name={day}
                      checked={wfoPreferences[day]}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  Apply
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <table className={styles.calendarTable}>
              <thead>
                <tr>
                  <th rowSpan="2" className="sticky left-0 bg-white z-10 min-w-[150px]">
                    Name
                  </th>
                  {Array.from({ length: daysInSelectedMonth }, (_, i) => (
                    <th key={i + 1}>{i + 1}</th>
                  ))}
                  <th rowSpan={2}>TH ({thCount})</th>
                  <th rowSpan={2}>TO ({toCount})</th>
                  <th rowSpan={2}>TL ({tlCount})</th>
                </tr>
                <tr>
                  {Array.from({ length: daysInSelectedMonth }, (_, i) => (
                    <th key={i + 1} className="text-xs">
                      {getDayName(
                        new Date(
                          selectedMonth.getFullYear(),
                          selectedMonth.getMonth(),
                          i + 1
                        )
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="sticky left-0 bg-white z-10 font-medium">
                    {userNameAndId}
                  </td>
                  {Array.from({ length: daysInSelectedMonth }, (_, i) => {
                    const day = i + 1;
                    const currentDate = new Date(
                      selectedMonth.getFullYear(),
                      selectedMonth.getMonth(),
                      day
                    );
                    return (
                      <td key={day} className="text-center p-1">
                        {isWeekend(currentDate) ? (
                          <button className={styles.weekend}>😊</button>
                        ) : cellStates[day] === "O" ? (
                          <button className={styles.O} onClick={() => handleCellClick(day)}>
                            O
                          </button>
                        ) : cellStates[day] === "H" ? (
                          <button className={styles.H} onClick={() => handleCellClick(day)}>
                            H
                          </button>
                        ) : (
                          <button className={styles.L} onClick={() => handleCellClick(day)}>
                            L
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center font-medium">{thCount}</td>
                  <td className="text-center font-medium">{toCount}</td>
                  <td className="text-center font-medium">{tlCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-8 pb-4">
        {userRole === "viewer" ? (
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-orange-500">ℹ️</span>
            <span className="text-sm italic">
              Click on a cell to change forecast of current and future dates
            </span>
          </div>
        ) : userRole !== "viewer" ? (
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-orange-500">ℹ️</span>
            <span className="text-sm italic">
              Click on a cell to change forecast
            </span>
          </div>
        ) : null}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default CalendarTable;