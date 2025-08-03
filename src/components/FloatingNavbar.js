import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegSun,
  FaBed,
  FaBrain,
  FaRegFrown,
  FaMobileAlt,
  FaSmile,
  FaBolt,
  FaClipboardList,
  FaCommentDots,
  FaBook,
  FaHome,
} from "react-icons/fa";
import "../css/FloatingNavbar.css";

function FloatingNavbar() {
  const navigate = useNavigate();

  const entries = [
    { id: 0, title: "Journal", icon: <FaBook />, route: "/journal" },
    { id: 1, title: "Day", icon: <FaRegSun />, route: "/trackers/DayTracker" },
    { id: 2, title: "Sleep", icon: <FaBed />, route: "/trackers/SleepTracker" },
    { id: 3, title: "Anxiety", icon: <FaBrain />, route: "/trackers/AnxietyTracker" },
    { id: 4, title: "Stress", icon: <FaRegFrown />, route: "/trackers/StressTracker" },
    { id: 5, title: "Screen", icon: <FaMobileAlt />, route: "/trackers/ScreenTracker" },
    { id: 6, title: "Mood", icon: <FaSmile />, route: "/trackers/MoodTracker" },
    { id: 7, title: "Energy", icon: <FaBolt />, route: "/trackers/EnergyTracker" },
    { id: 8, title: "Discipline", icon: <FaClipboardList />, route: "/trackers/DisciplineTracker" },
    { id: 9, title: "Thoughts", icon: <FaCommentDots />, route: "/trackers/ThoughtsTracker" },
  ];

  return (
    <div>
      <nav className="floating-navbar">
        <div className="floating-navbar-container">
          {/* Dynamic rendering of tracker buttons */}
          {entries.map((entry) => (
            <button
              key={entry.id}
              className="floating-nav-button"
              onClick={() => navigate(entry.route)}
            >
              {entry.icon}
              <span className="floating-nav-label">{entry.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default FloatingNavbar;
