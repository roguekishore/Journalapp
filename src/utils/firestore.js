import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';

// Function to initialize habit data for a specific month
export const createMonthDocument = async (monthKey, habits) => {
    try {
      const monthDocRef = doc(db, "habitTracker", monthKey);
      const monthData = {};
  
      // Create data for each day of the month
      const daysInMonth = new Date(monthKey.split("-")[0], monthKey.split("-")[1], 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dailyHabits = {};
        habits.forEach(habit => {
          dailyHabits[habit] = false; // Set all habits as not done (false)
        });
        monthData[day] = dailyHabits;
      }
  
      // Set the document with the month data
      await setDoc(monthDocRef, monthData);
      console.log(`Document for ${monthKey} created successfully.`);
    } catch (error) {
      console.error("Error creating month document: ", error);
    }
  };

  export const fetchMonthData = async (monthKey) => {
    try {
      const monthDocRef = doc(db, "habitTracker", monthKey);
      const docSnap = await getDoc(monthDocRef);
  
      if (docSnap.exists()) {
        console.log(`Data for ${monthKey} fetched successfully.`);
        return docSnap.data(); // Returns the habit data for the month
      } else {
        console.log("No data found for this month.");
        return null; // No data for this month
      }
    } catch (error) {
      console.error("Error fetching month data: ", error);
    }
  };

  export const updateHabitData = async (monthKey, day, habit, isCompleted) => {
    try {
      const monthDocRef = doc(db, "habitTracker", monthKey);
      const dailyDataRef = doc(monthDocRef, String(day));
      
      // Update the habit completion status
      await updateDoc(dailyDataRef, {
        [habit]: isCompleted,
      });
  
      console.log(`Habit data for ${habit} on day ${day} updated successfully.`);
    } catch (error) {
      console.error("Error updating habit data: ", error);
    }
  };


export const addJournalEntry = async (entry) => {
    try {
        const docRef = await addDoc(collection(db, 'journalEntries'), entry);
        return docRef.id;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const fetchJournalEntries = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'journalEntries'));
        const entries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return entries;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const updateJournalEntry = async (id, updates) => {
    try {
        const docRef = doc(db, 'journalEntries', id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const deleteJournalEntry = async (id) => {
    try {
        const docRef = doc(db, 'journalEntries', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};
