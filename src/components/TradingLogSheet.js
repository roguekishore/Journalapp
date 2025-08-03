import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import app from '../firebase';
import { db } from '../firebase';
import '../css/TradingLogSheets.css'

const TradingLogSheet = () => {
  // State for managing columns and their options
  const [columns, setColumns] = useState({
    pair: {
      options: ['EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'USDCAD'],
      allowCustom: true
    },
    date: {
      options: null, // Date doesn't have predefined options
      allowCustom: false
    },
    position: {
      options: ['Short', 'Long'],
      allowCustom: false
    },
    strategy: {
      options: ['Trend Following', 'Breakout', 'Range'],
      allowCustom: true
    },
    session: {
      options: ['New York', 'London', 'Asian'],
      allowCustom: false
    },
    day: {
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      allowCustom: false
    }
  });

  // State for table rows
  const [rows, setRows] = useState([]);

  // Determine cell background color
  const getCellColorClass = (column, value) => {
    switch (column) {
      case 'position':
        return value === 'Short' ? 'cell-negative' : value === 'Long' ? 'cell-positive' : '';
      case 'result':
        return value === '✓' ? 'cell-positive' : value === '✗' ? 'cell-negative' : '';
      case 'profitLoss':
        return value.includes('-') ? 'cell-negative' : 'cell-positive';
      default:
        return '';
    }
  };

  // Fetch existing data from Firestore on component mount
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const tradesCollection = collection(db, 'trades');
        const querySnapshot = await getDocs(tradesCollection);
        const fetchedTrades = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure date is correctly formatted
          date: doc.data().date || format(new Date(), 'yyyy-MM-dd')
        }));
        setRows(fetchedTrades);
      } catch (error) {
        console.error("Error fetching trades: ", error);
      }
    };

    fetchTrades();
  }, []);

  // Add a new row
  const addRow = () => {
    const newRow = {
      forexpair: '',
      position: '',
      lotSize: 0.01,
      result: '',
      profitLoss: '',
      strategy: '',
      session: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      day: '',
      learning: ''
    };
    setRows([...rows, newRow]);
  };

  // Update a specific cell
  const updateCell = (rowIndex, column, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][column] = value;
    setRows(updatedRows);
  };

  // Add a new option to a column
  const addColumnOption = (columnName, newOption) => {
    setColumns(prev => ({
      ...prev,
      [columnName]: {
        ...prev[columnName],
        options: [...prev[columnName].options, newOption]
      }
    }));
  };

  // Remove a row from both local state and Firestore
  const removeRow = async (rowIndex) => {
    const rowToRemove = rows[rowIndex];
    
    try {
      // If the row exists in Firestore (has an ID), delete it
      if (rowToRemove.id) {
        const docRef = doc(db, 'trades', rowToRemove.id);
        await deleteDoc(docRef);
      }
      
      // Remove the row from local state
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
    } catch (error) {
      console.error("Error removing trade: ", error);
      alert('Failed to remove trade');
    }
  };

  // Save data to Firestore
  const saveTrades = async () => {
    try {
      const tradesCollection = collection(db, 'trades');
      
      // Save or update each row
      const savePromises = rows.map(async (row) => {
        // Ensure date is set to today's date if not already present
        const rowWithDate = {
          ...row,
          date: row.date || format(new Date(), 'yyyy-MM-dd')
        };

        if (row.id) {
          // If row has an ID, it exists in Firestore - update it
          const docRef = doc(db, 'trades', row.id);
          await updateDoc(docRef, rowWithDate);
        } else {
          // If no ID, it's a new row - add it
          await addDoc(tradesCollection, rowWithDate);
        }
      });

      await Promise.all(savePromises);
      alert('Trades saved successfully!');
    } catch (error) {
      console.error("Error saving trades: ", error);
      alert('Failed to save trades');
    }
  };

  return (
    <div className="trading-log-container">
      <div className="overflow-x-auto">
        <table className="trading-log-table">
          <thead>
            <tr>
            {Object.keys(columns).map((column) => (
  <th key={column}>
    {column.charAt(0).toUpperCase() + column.slice(1)}
    {column === 'date' ? null : columns[column].allowCustom && (
      <button 
        onClick={() => {
          const newOption = prompt(`Enter new option for ${column}:`);
          if (newOption) addColumnOption(column, newOption);
        }}
        className="trading-log-btn btn-remove"
      >+</button>
    )}
  </th>
))}
              <th>Lot Size</th>
              <th>P/L</th>
              <th>Learning</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(columns).map((column) => (
                  <td key={column}>
                    {columns[column].options ? (
                      <select
                        value={row[column] || ''}
                        onChange={(event) => updateCell(rowIndex, column, event.target.value)}
                        className={getCellColorClass(column, row[column])}
                      >
                        <option value="">Select</option>
                        {columns[column].options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : column === 'date' ? (
                      <input
                        type="date"
                        value={row.date || ''}
                        onChange={(event) => updateCell(rowIndex, 'date', event.target.value)}
                      />
                    ) : (
                      <input
                        type={column === 'lotSize' ? 'number' : 'text'}
                        step={column === 'lotSize' ? '0.01' : undefined}
                        value={row[column] || ''}
                        onChange={(event) => updateCell(rowIndex, column, event.target.value)}
                        className={getCellColorClass(column, row[column])}
                      />
                    )}
                  </td>
                ))}
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={row.lotSize || 0.01}
                    onChange={(event) => updateCell(rowIndex, 'lotSize', parseFloat(event.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.profitLoss || ''}
                    onChange={(event) => updateCell(rowIndex, 'profitLoss', event.target.value)}
                    className={getCellColorClass('profitLoss', row.profitLoss)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.learning || ''}
                    onChange={(event) => updateCell(rowIndex, 'learning', event.target.value)}
                  />
                </td>
                <td>
                  <button 
                    onClick={() => removeRow(rowIndex)}
                    className="trading-log-btn btn-remove"
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="trading-log-buttons">
        <button 
          onClick={addRow}
          className="trading-log-btn btn-add"
        >
          Add Row
        </button>
        <button 
          onClick={saveTrades}
          className="trading-log-btn btn-save"
        >
          Save Trades
        </button>
      </div>
    </div>
  );
};

export default TradingLogSheet;