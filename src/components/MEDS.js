import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/MEDS.css';

const MEDS = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);

  const fetchMonthlyData = async () => {
    const year = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1;
    const today = currentDate.getDate();

    try {
      const cacheKey = `meds-monthlyData-${year}-${month}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        console.log('Retrieved cached data:', JSON.parse(cachedData));
        setMonthData(JSON.parse(cachedData));
        return;
      }

      const trackerCollections = [
        { name: 'Mood', collection: 'moodTracker', field: 'rating' },
        { name: 'Energy', collection: 'trackMyEnergy', field: 'rating' },
        { name: 'Discipline', collection: 'trackMyDiscipline', field: 'rating' },
        { name: 'ScreenTime', collection: 'screenTimeTracker', field: 'screenTime' },
      ];

      const monthlyData = [];
      for (let day = 1; day <= today; day++) {
        const dayData = { day };
        for (const tracker of trackerCollections) {
          const yearDocRef = doc(db, tracker.collection, year);
          const yearDocSnap = await getDoc(yearDocRef);

          if (yearDocSnap.exists()) {
            const monthData = yearDocSnap.data()[month];
            const dayRating = monthData?.[day - 1]?.[tracker.field];

            console.log(`${tracker.name} Day ${day} Rating:`, dayRating);

            dayData[tracker.name] =
              tracker.name === 'ScreenTime' ? dayRating || null : dayRating ? dayRating.rating : null;
          }
        }

        if (Object.keys(dayData).length > 1) {
          monthlyData.push(dayData);
        }
      }

      console.log('Prepared Monthly Data:', monthlyData);

      // Cache data in localStorage
      localStorage.setItem(cacheKey, JSON.stringify(monthlyData));

      setMonthData(monthlyData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const clearCache = () => {
    const year = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1;
    const cacheKey = `meds-monthlyData-${year}-${month}`;
    localStorage.removeItem(cacheKey);
    fetchMonthlyData();
  };

  useEffect(() => {
    console.log(currentDate);
    fetchMonthlyData();
  }, [currentDate]);

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);

    // Clear cache when month changes
    const year = newDate.getFullYear().toString();
    const month = newDate.getMonth() + 1;
    const cacheKey = `meds-monthlyData-${year}-${month}`;
    localStorage.removeItem(cacheKey);
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="meds-monthly-health-tracker">
      <div className="meds-month-navigation">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h2>{formatMonthYear()}</h2>
        <button onClick={() => changeMonth(1)}>→</button>
        <button className='refresh-button' onClick={clearCache}>⟳</button>
      </div>
      <div className="meds-chart-container">
        {monthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Mood" stroke="#00FF00" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Energy" stroke="#FF0000" />
              <Line type="monotone" dataKey="Discipline" stroke="#00FE8F" />
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

export default MEDS;
