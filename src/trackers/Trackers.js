import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom"; // Importing routing components
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
} from "react-icons/fa";
import "./Tracker.css";
import FloatingNavbar from "../components/FloatingNavbar";

const Tracker = () => {
    const navigate = useNavigate();

    const entries = [
        { id: 1, title: "Day Tracker", content: "How was your day?", icon: <FaRegSun />, route: "/trackers/DayTracker" },
        { id: 2, title: "Sleep Tracker", content: "How many hours did you sleep?", icon: <FaBed />, route: "/trackers/SleepTracker" },
        { id: 3, title: "Anxiety Tracker", content: "Were your mind restless today?", icon: <FaBrain />, route: "/trackers/AnxietyTracker" },
        { id: 4, title: "Stress Tracker", content: "How tensed was your day?", icon: <FaRegFrown />, route: "/trackers/StressTracker" },
        { id: 5, title: "Screen Tracker", content: "How many hours did your body rest?", icon: <FaMobileAlt />, route: "/trackers/ScreenTracker" },
        { id: 6, title: "Mood Tracker", content: "How was your mood today?", icon: <FaSmile />, route: "/trackers/MoodTracker" },
        { id: 7, title: "Energy Tracker", content: "How much energy did you have?", icon: <FaBolt />, route: "/trackers/EnergyTracker" },
        { id: 8, title: "Discipline Tracker", content: "How disciplined were you today?", icon: <FaClipboardList />, route: "/trackers/DisciplineTracker" },
        { id: 9, title: "Thoughts Tracker", content: "How many thoughts were racing today?", icon: <FaCommentDots />, route: "/trackers/ThoughtsTracker" },
    ];

    return (
        <div>
            <FloatingNavbar />
            <div className="hover-cards-container">
                <div className="hover-cards-grid">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="hover-card"
                            onClick={() => navigate(entry.route)}
                        >
                            <div className="hover-card-icon">{entry.icon}</div>
                            <h4 className="hover-card-title">{entry.title}</h4>
                            <p className="hover-card-content">{entry.content}</p>
                            <div className="hover-card-shine"></div>
                            <div className="hover-card-background">
                                <div className="hover-card-tiles">
                                    {[...Array(10)].map((_, tileIndex) => (
                                        <div
                                            key={tileIndex}
                                            className={`hover-card-tile hover-card-tile-${tileIndex + 1}`}
                                        ></div>
                                    ))}
                                </div>
                                <div className="hover-card-line hover-card-line-1"></div>
                                <div className="hover-card-line hover-card-line-2"></div>
                                <div className="hover-card-line hover-card-line-3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tracker;
