import { useState, useEffect } from 'react';
import '../css/ShowTrackers.css'; // Import the CSS file

import DayTracker from '../trackers/DayTracker';
import SleepTracker from '../trackers/SleepTracker';
import ScreenTimeTracker from '../trackers/ScreenTracker';
import AnxietyTracker from '../trackers/AnxietyTracker';
import StressTracker from '../trackers/StressTracker';
import MoodTracker from '../trackers/MoodTracker';
import EnergyTracker from '../trackers/EnergyTracker';
import DisciplineTracker from '../trackers/DisciplineTracker';
import ThoughtsTracker from '../trackers/ThoughtsTracker';
import Tracker from '../trackers/Trackers';
import MEDS from './MEDS';
import SAS from './SAS';
import SasMeds from './SasMeds';

function ShowTrackers() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="show-trackers__container">
      <SasMeds></SasMeds>
      <DayTracker />
      <SleepTracker />
      <ScreenTimeTracker />
      <AnxietyTracker />
      <StressTracker />
      <MoodTracker />
      <EnergyTracker />
      <DisciplineTracker />
      <ThoughtsTracker />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="back-to-top-button"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default ShowTrackers;
