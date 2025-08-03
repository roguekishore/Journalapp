import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firestore db
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import "./DisciplineTracker.css";

// Function to create year document if it doesn't exist
const createYearDocument = async (yearKey) => {
  try {
    const yearDocRef = doc(db, "trackMyDiscipline", yearKey);
    const yearData = {};

    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(yearKey, month, 0).getDate();
      const monthData = Array.from({ length: daysInMonth }, () => ({
        rating: null,
      }));
      yearData[month] = monthData;
    }

    await setDoc(yearDocRef, yearData);
    console.log(`Created document for year: ${yearKey}`);
  } catch (error) {
    console.error("Error creating year document:", error);
  }
};

// Function to fetch year data from Firestore
const fetchYearData = async (yearKey, setYearData) => {
  try {
    const yearDocRef = doc(db, "trackMyDiscipline", yearKey);
    const yearDocSnap = await getDoc(yearDocRef);

    if (yearDocSnap.exists()) {
      setYearData(yearDocSnap.data());
    } else {
      console.log("Year document not found. Creating new document...");
      createYearDocument(yearKey);
    }
  } catch (error) {
    console.error("Error fetching year data:", error);
  }
};

// Main DisciplineTracker component
const DisciplineTracker = () => {
  const [yearData, setYearData] = useState(null);
  const [yearKey, setYearKey] = useState(new Date().getFullYear().toString());
  const [selectedColor, setSelectedColor] = useState({ rating: null, hex: "white" });

  useEffect(() => {
    fetchYearData(yearKey, setYearData);
  }, [yearKey]);

  const handleCellClick = async (month, day) => {
    if (!yearData) return;

    const updatedYearData = { ...yearData };

    if (!updatedYearData[month]) {
      updatedYearData[month] = [];
    }

    if (!updatedYearData[month][day - 1]) {
      updatedYearData[month][day - 1] = { rating: null };
    }

    const currentRating = updatedYearData[month][day - 1].rating;
    updatedYearData[month][day - 1].rating = currentRating ? null : selectedColor;

    setYearData(updatedYearData);

    try {
      const yearDocRef = doc(db, "trackMyDiscipline", yearKey);

      await updateDoc(yearDocRef, {
        [`${month}.${day - 1}.rating`]: updatedYearData[month][day - 1].rating,
      });

      console.log(`Updated discipline rating for day ${day} of month ${month}`);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const handleColorSelect = (rating, hex) => {
    setSelectedColor({ rating, hex });
  };

  const handleYearChange = (direction) => {
    const newYear = parseInt(yearKey, 10) + direction;
    setYearKey(newYear.toString());
  };

  const renderTable = () => {
    if (!yearData) return null;

    const rows = [];
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(yearKey, month, 0).getDate();
      const cells = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const rating = yearData[month][day - 1]?.rating?.rating || null;
        const color = yearData[month][day - 1]?.rating?.hex || "transparent";
        cells.push(
          <td
            key={day}
            className="discipline-tracker__cell"
            onClick={() => handleCellClick(month, day)}
            style={{ backgroundColor: color, cursor: "pointer" }}
          >{rating}</td>
        );
      }
      rows.push(
        <tr key={month}>
          <td className="discipline-tracker__month-label">
            {new Date(yearKey, month - 1).toLocaleString("default", { month: "short" })}
          </td>
          {cells}
        </tr>
      );
    }
    return rows;
  };

  const disciplineColors = [
    { rating: 10, color: "Highly Disciplined", hex: "#00FF00" },
    { rating: 9, color: "Very Disciplined", hex: "#33FF00" },
    { rating: 8, color: "Good Discipline", hex: "#66FF00" },
    { rating: 7, color: "Above Average Discipline", hex: "#99FF00" },
    { rating: 6, color: "Average Discipline", hex: "#FFFF00" },
    { rating: 5, color: "Slightly Undisciplined", hex: "#FFCC00" },
    { rating: 4, color: "Low Discipline", hex: "#FF9900" },
    { rating: 3, color: "Very Low Discipline", hex: "#FF6600" },
    { rating: 2, color: "Negligible Discipline", hex: "#FF3300" },
    { rating: 1, color: "No Discipline", hex: "#FF0000" },
    { rating: 0, color: "Chaotic", hex: "#CC0000" },
  ];

  return (
    <div className="discipline-tracker__container">
      <h1 className="discipline-tracker__header">Discipline Tracker - {yearKey}</h1>
      <div className="discipline-tracker__year-navigation">
        <button onClick={() => handleYearChange(-1)}>←</button>
        <button onClick={() => handleYearChange(1)}>→</button>
      </div>

      <div className="discipline-tracker__color-palette">
        {disciplineColors.map((item) => (
          <button
            key={item.rating}
            className="discipline-tracker__color"
            style={{ backgroundColor: item.hex }}
            onClick={() => handleColorSelect(item.rating, item.hex)}
          >
            {item.rating}
          </button>
        ))}
      </div>
      <div className="discipline-tracker__content">
        <table className="discipline-tracker__calendar">
          <thead>
            <tr>
              <th>Month</th>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DisciplineTracker;
