import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import "../css/HabitTracker.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const db = getFirestore(app);
const auth = getAuth(app);

const createMonthDocument = async (monthKey, habits) => {
  try {
    const monthDocRef = doc(db, "habitTracker", monthKey);
    const monthData = {};
    const [year, month] = monthKey.split("-");
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dailyHabits = {};
      habits.forEach((habit) => {
        dailyHabits[habit] = false;
      });
      monthData[day] = dailyHabits;
    }

    await setDoc(monthDocRef, monthData);
    console.log(`Created document for ${monthKey}`);
  } catch (error) {
    console.error("Error creating month document:", error);
  }
};

const fetchMonthData = async (monthKey) => {
  try {
    const monthDocRef = doc(db, "habitTracker", monthKey);
    const docSnap = await getDoc(monthDocRef);

    if (docSnap.exists()) {
      console.log(`Fetched data for month: ${monthKey}`);
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching month data:", error);
    return null;
  }
};

const updateHabitData = async (monthKey, day, habit, isCompleted) => {
  try {
    const monthDocRef = doc(db, "habitTracker", monthKey);
    await updateDoc(monthDocRef, {
      [`${day}.${habit}`]: isCompleted,
    });
    console.log(`Updated habit: ${habit}, day: ${day}, month: ${monthKey}`);
  } catch (error) {
    console.error("Error updating habit data:", error);
  }
};

const HabitTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits] = useState([
    "Alarm",
    "Meditate",
    "Cold Shower",
    "Read",
    "3L H20",
    "Workout",
    "8Hr Sleep",
    "NO LUST",
    "Less Screen",
    "Plan",
  ]);
  const [calendarData, setCalendarData] = useState({});
  const [graphData, setGraphData] = useState([]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthKey = currentDate.toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      let data = await fetchMonthData(monthKey);
      if (!data) {
        await createMonthDocument(monthKey, habits);
        data = await fetchMonthData(monthKey);
      }
      setCalendarData(data || {});
      updateGraphData(data || {});
    };

    fetchData();
  }, [currentDate]);

  const handleCheckboxChange = async (day, habit) => {
    const updatedData = { ...calendarData };
    if (!updatedData[day]) updatedData[day] = {};
    updatedData[day][habit] = !updatedData[day][habit];
    setCalendarData(updatedData);
    await updateHabitData(monthKey, day, habit, updatedData[day][habit]);
    updateGraphData(updatedData);
  };

  const updateGraphData = (data) => {
    const graph = Array.from({ length: daysInMonth }, (_, day) => {
      const dayData = data[day + 1] || {};
      return Object.values(dayData).filter(Boolean).length;
    });
    setGraphData(graph);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
    setCurrentDate(newDate);
  };

  return (
    <div>
    <div className="habit-tracker">
      <div className="header">
        <button onClick={() => changeMonth(-1)}>{"<"}</button>
        <h1>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h1>
        <button onClick={() => changeMonth(1)}>{">"}</button>
      </div>
      <div className="calendar">
        <table className="habit-tracker-table">
          <thead>
            <tr>
              <th>Date</th>
              {Array.from({ length: daysInMonth }, (_, day) => (
                <th key={day}>{day + 1}</th>
              ))}
            </tr>
            <tr>
              <th>Day</th>
              {Array.from({ length: daysInMonth }, (_, day) => {
                const weekDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toLocaleString("default", {
                  weekday: "short",
                });
                const initials = weekDay === "Thur" ? "Th" : weekDay[0];
                return <th key={day}>{initials}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIndex) => (
              <tr key={habitIndex}>
                <td className="habitname">{habit}</td>
                {Array.from({ length: daysInMonth }, (_, day) => (
                  <td key={day}>
                    <div className="checkbox-wrapper-30">
                      <span className="checkbox">
                        <input
                          type="checkbox"
                          checked={calendarData[day + 1]?.[habit] || false}
                          onChange={() => handleCheckboxChange(day + 1, habit)}
                        />
                        <svg>
                          <use xlinkHref="#checkbox-30" />
                        </svg>
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                        <symbol id="checkbox-30" viewBox="0 0 22 22">
                          <path
                            fill="none"
                            stroke="currentColor"
                            d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                          />
                        </symbol>
                      </svg>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <div className="graph">
        <Line
          data={{
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            datasets: [
              {
                
                data: graphData,
                fill: false,
                borderColor: "white",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          }}
          options={{
            scales: {
              y: { beginAtZero: true, max: habits.length },
            },
            plugins: {
              legend: {
                display: false, // Optionally hide the legend if you don't need it
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default HabitTracker;
