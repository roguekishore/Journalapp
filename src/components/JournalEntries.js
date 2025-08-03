import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import db from "../firebase";
import "../css/JournalEntries.css";

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, "journal_entries"), orderBy("entry_date", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedEntries = [];
        querySnapshot.forEach((doc) => {
          fetchedEntries.push({ id: doc.id, ...doc.data() });
        });
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching journal entries: ", error);
      }
    };

    fetchEntries();
  }, []);

  const openOverlay = (entry) => {
    setSelectedEntry(entry);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setSelectedEntry(null);
    setOverlayVisible(false);
  };

  return (
    <div className="journal-entries">
      <h1>Journal Entries</h1>
      <div className="grid-container">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid-item"
            onClick={() => openOverlay(entry)}
          >
            <h3>{entry.title || "Untitled Entry"}</h3>
            <p>{entry.entry_date}</p>
          </div>
        ))}
      </div>
      {overlayVisible && selectedEntry && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEntry.title || "Untitled Entry"}</h2>
            <p><strong>Date:</strong> {selectedEntry.entry_date}</p>
            <div className="entry-text">{selectedEntry.text}</div>
            <button className="close-btn" onClick={closeOverlay}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries;
