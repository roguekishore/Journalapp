import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/TrackerGraph.css';

const MonthlyComprehensiveTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);

  const fetchMonthlyData = async () => {
    const year = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1;

    try {
      const trackerCollections = [
        { name: 'Mood', collection: 'moodTracker', field: 'rating' },
        { name: 'Energy', collection: 'trackMyEnergy', field: 'rating' },
        { name: 'Discipline', collection: 'trackMyDiscipline', field: 'rating' },
        { name: 'ScreenTime', collection: 'screenTimeTracker', field: 'screenTime' }
      ];

      const monthlyData = [];

      for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
        const dayData = { day };

        for (const tracker of trackerCollections) {
          const yearDocRef = doc(db, tracker.collection, year);
          const yearDocSnap = await getDoc(yearDocRef);

          if (yearDocSnap.exists()) {
            const monthData = yearDocSnap.data()[month];
            const dayRating = monthData?.[day - 1]?.[tracker.field];
            
            if (tracker.name === 'ScreenTime') {
              dayData[tracker.name] = dayRating || null;
            } else {
              dayData[tracker.name] = dayRating ? dayRating.rating : null;
            }
          }
        }

        if (Object.keys(dayData).length > 1) {
          monthlyData.push(dayData);
        }
      }

      console.log('Final Monthly Data:', monthlyData);
      setMonthData(monthlyData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [currentDate]);

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="monthly-comprehensive-tracker">
      <div className="month-navigation">
        <button onClick={() => changeMonth(-1)}>← Previous</button>
        <h2>{formatMonthYear()}</h2>
        <button onClick={() => changeMonth(1)}>Next →</button>
      </div>

      <div className="chart-container">
        {monthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Mood" stroke="#FF6384" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Energy" stroke="#36A2EB" />
              <Line type="monotone" dataKey="Discipline" stroke="#FFCE56" />
              <Line type="monotone" dataKey="ScreenTime" stroke="#FF00FF" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for this month</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyComprehensiveTracker;