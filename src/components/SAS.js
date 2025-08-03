import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/SAS.css';

const SAS = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);

  const fetchMonthlyData = async () => {
    const year = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1;
    const today = currentDate.getDate();

    try {
      const cacheKey = `sas-monthlyData-${year}-${month}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        console.log('Retrieved cached data:', JSON.parse(cachedData));
        setMonthData(JSON.parse(cachedData));
        return;
      }

      const trackerCollections = [
        { name: 'Sleep', collection: 'sleepTracker' },
        { name: 'Anxiety', collection: 'anxietyTracker' },
        { name: 'Stress', collection: 'stressTracker' },
      ];

      const monthlyData = [];
      for (let day = 1; day <= today; day++) {
        const dayData = { day };
        for (const tracker of trackerCollections) {
          const yearDocRef = doc(db, tracker.collection, year);
          const yearDocSnap = await getDoc(yearDocRef);

          if (yearDocSnap.exists()) {
            const monthData = yearDocSnap.data()[month];
            const dayRating = monthData?.[day - 1]?.rating;

            console.log(`${tracker.name} Day ${day} Rating:`, dayRating);

            // Adjust this line based on your exact data structure
            dayData[tracker.name] = dayRating
              ? (typeof dayRating === 'object' ? dayRating.rating : dayRating)
              : null;
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

  // Add a method to clear cache if needed
  const clearCache = () => {
    const year = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1;
    const cacheKey = `sas-monthlyData-${year}-${month}`;
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
    const cacheKey = `sas-monthlyData-${year}-${month}`;
    localStorage.removeItem(cacheKey);
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="sas-monthly-health-tracker">
      <div className="sas-month-navigation">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h2>{formatMonthYear()}</h2>
        <button onClick={() => changeMonth(1)}>→</button>
        <button className='refresh-button' onClick={clearCache}>⟳</button>
      </div>
      <div className="sas-chart-container">
        {monthData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={700}>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sleep" stroke="#00FF00" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Anxiety" stroke="#FF0000" />
                <Line type="monotone" dataKey="Stress" stroke="#00FE8F" />
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p>No data available for this month</p>
        )}
      </div>
    </div>
  );
};

export default SAS;
