import Journal from '../components/Journal'
import AnxietyTracker from '../trackers/AnxietyTracker';
import DayTracker from '../trackers/DayTracker';
import DisciplineTracker from '../trackers/DisciplineTracker';
import EnergyTracker from '../trackers/EnergyTracker';
import MoodTracker from '../trackers/MoodTracker';
import ScreenTimeTracker from '../trackers/ScreenTracker';
import SleepTracker from '../trackers/SleepTracker';
import StressTracker from '../trackers/StressTracker';
import ThoughtsTracker from '../trackers/ThoughtsTracker';
import Tracker from '../trackers/Trackers';
import DailyMomentsTracker from './DailyMomentsTracker';

function JournalComponent(){
    return(
        <div className='journal-component-container'>
            <Journal></Journal>
            
            <DailyMomentsTracker></DailyMomentsTracker>
        </div>
    )
}

export default JournalComponent;