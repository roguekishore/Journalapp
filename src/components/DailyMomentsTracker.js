import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query } from 'firebase/firestore';
import '../css/DailyMomentsTracker.css';
import app from '../firebase';
import { db } from '../firebase';
const DailyMomentsTracker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [moments, setMoments] = useState({});
    const [editingMoments, setEditingMoments] = useState({});

    // Generate month name
    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    // Get number of days in current month
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
        // Reset editing moments when changing month
        setEditingMoments({});
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
        // Reset editing moments when changing month
        setEditingMoments({});
    };

    // Save moments to Firebase
    const saveMoments = async () => {
        try {
            const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

            // Batch save all edited moments
            const savePromises = Object.entries(editingMoments).map(async ([day, moment]) => {
                const docRef = doc(db, 'dailyMoments', monthKey, 'days', `day-${day}`);

                await setDoc(docRef, {
                    moment: moment,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day))
                });
            });

            // Wait for all saves to complete
            await Promise.all(savePromises);

            // Update local moments state and clear editing moments
            setMoments(prev => ({
                ...prev,
                ...editingMoments
            }));
            setEditingMoments({});

            alert('Moments saved successfully!');
        } catch (error) {
            console.error("Error saving moments:", error);
            alert('Failed to save moments.');
        }
    };

    // Update editing moment for a specific day
    const updateEditingMoment = (day, moment) => {
        setEditingMoments(prev => ({
            ...prev,
            [day]: moment
        }));
    };

    // Fetch moments when component mounts or month changes
    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
                const q = query(
                    collection(db, 'dailyMoments', monthKey, 'days')
                );

                const querySnapshot = await getDocs(q);
                const fetchedMoments = {};

                querySnapshot.forEach((doc) => {
                    const dayMatch = doc.id.match(/day-(\d+)/);
                    if (dayMatch) {
                        const day = parseInt(dayMatch[1]);
                        fetchedMoments[day] = doc.data().moment;
                    }
                });

                setMoments(fetchedMoments);
            } catch (error) {
                console.error("Error fetching moments:", error);
            }
        };

        fetchMoments();
    }, [currentDate]);

    return (
        <div className="moments-container">
            <div className="month-navigation">
                <button
                    onClick={goToPreviousMonth}
                    className="moments-nav-button"
                >←</button>
                <h2 className="month-title">
                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="moments-nav-button"
                >→</button>
            </div>
            <div className="save-button-container">
                <button
                    onClick={saveMoments}
                    className="moments-save-button"
                    disabled={Object.keys(editingMoments).length === 0}
                >
                    Save Moments
                </button>
            </div>


            <div className="days-list">
                {[...Array(getDaysInMonth(currentDate))].map((_, index) => {
                    const day = index + 1;
                    return (
                        <div key={day} className="day-row">
                            <span className="day-number">{day}</span>
                            
                            <textarea
                                value={editingMoments[day] || moments[day] || ""}
                                onChange={(e) => {
                                    updateEditingMoment(day, e.target.value);
                                    e.target.style.height = "auto"; 
                                    e.target.style.height = `${e.target.scrollHeight}px`; 
                                }}
                                className="moment-textarea"
                                rows={1} // Minimum rows
                            />
                        </div>
                    );
                })}
            </div>



        </div>
    );
};

export default DailyMomentsTracker;