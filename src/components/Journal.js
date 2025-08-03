import React, { useState, useEffect } from 'react';
import { addJournalEntry, fetchJournalEntries } from '../utils/firestore';
import '../css/Journal.css';

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');

    useEffect(() => {
        const fetchEntries = async () => {
            const fetchedEntries = await fetchJournalEntries();
            setEntries(fetchedEntries);
        };
        fetchEntries();
    }, []);

    const handleAddEntry = async () => {
        if (newEntry.trim()) {
            const entry = { content: newEntry, timestamp: new Date() };
            await addJournalEntry(entry);
            setEntries([...entries, entry]);
            setNewEntry('');
        }
    };

    return (
        <div className="journal-div">
        <div className="journal-container">
            {/* <h2 className="journal-header">JOURNAL</h2> */}
            <textarea
                className="journal-textarea"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="What did you take out from life today?"
            ></textarea>
            <button className="journal-button" onClick={handleAddEntry}>Add Entry</button>
        </div>
        </div>
    );
};

export default Journal;
