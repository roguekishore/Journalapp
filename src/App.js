import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import HabitTracker from "./components/HabitTracker";
import JournalComponent from "./components/JournalComponent";
import Entries from "./components/Entries";
import TrackerTemplate from "./components/TrackerTemplate";

import DayTracker from "./trackers/DayTracker";
import SleepTracker from "./trackers/SleepTracker";
import AnxietyTracker from "./trackers/AnxietyTracker";
import StressTracker from "./trackers/StressTracker";
import ScreenTracker from "./trackers/ScreenTracker";
import MoodTracker from "./trackers/MoodTracker";
import EnergyTracker from "./trackers/EnergyTracker";
import DisciplineTracker from "./trackers/DisciplineTracker";
import ThoughtsTracker from "./trackers/ThoughtsTracker";

import { auth } from "./firebase"; // Import your Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import ShowTrackers from "./components/ShowTrackers";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      {user && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route
            path="/trackers/DayTracker"
            element={user ? <TrackerTemplate trackerComponent={DayTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/SleepTracker"
            element={user ? <TrackerTemplate trackerComponent={SleepTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/AnxietyTracker"
            element={user ? <TrackerTemplate trackerComponent={AnxietyTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/StressTracker"
            element={user ? <TrackerTemplate trackerComponent={StressTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/ScreenTracker"
            element={user ? <TrackerTemplate trackerComponent={ScreenTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/MoodTracker"
            element={user ? <TrackerTemplate trackerComponent={MoodTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/EnergyTracker"
            element={user ? <TrackerTemplate trackerComponent={EnergyTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/DisciplineTracker"
            element={user ? <TrackerTemplate trackerComponent={DisciplineTracker} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trackers/ThoughtsTracker"
            element={user ? <TrackerTemplate trackerComponent={ThoughtsTracker} /> : <Navigate to="/login" />}
          />

          <Route path="/habit-tracker" element={user ? <HabitTracker /> : <Navigate to="/login" />} />
          <Route path="/tracker" element={user ? <ShowTrackers /> : <Navigate to="/login" />} />
          <Route path="/journal/*" element={user ? <JournalComponent /> : <Navigate to="/login" />} />
          <Route path="/entries" element={user ? <Entries /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
