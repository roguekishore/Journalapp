import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import "../css/Entries.css";

const Entries = () => {
  const [entries, setEntries] = useState([]); // Stores all journal entries
  const [displayedEntries, setDisplayedEntries] = useState([]); // Stores entries of the selected month
  const [selectedMonth, setSelectedMonth] = useState(null); // Tracks the selected month for entry display
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page for pagination
  const monthsPerPage = 12; // Number of months displayed per page

  // Fetch entries from Firestore
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, "journalEntries"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const entriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(entriesList);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  // Generate months list
  const generateMonthsList = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 = January
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(2024, 10); // November 2024
    const totalMonths = (currentYear - 2024) * 12 + currentMonth - 10 + 1; // Total months since November 2024

    const months = [];

    // Add all months from November 2024 to the current month
    for (let i = totalMonths - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = date.toLocaleString("default", { month: "long" });
      months.push({
        name: `${monthName.toUpperCase()} ${date.getFullYear()}`,
        index: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    // Add months after the current month (up to 2 years in the future)
    for (let i = 1; i <= 24; i++) {
      const date = new Date(currentYear, currentMonth + i);
      const monthName = date.toLocaleString("default", { month: "long" });
      months.push({
        name: `${monthName.toUpperCase()} ${date.getFullYear()}`,
        index: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    return months;
  };

  const monthsList = generateMonthsList();

  // Paginate months
  const paginatedMonths = monthsList.slice(
    currentPage * monthsPerPage,
    (currentPage + 1) * monthsPerPage
  );

  // Handle month click
  const handleMonthClick = (monthIndex, year) => {
    setSelectedMonth({ monthIndex, year });

    // Filter entries for the selected month
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp.seconds * 1000);
      return entryDate.getMonth() === monthIndex && entryDate.getFullYear() === year;
    });

    setDisplayedEntries(filteredEntries);
  };

  // Handle page navigation
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => Math.max(0, prevPage + direction));
  };

  return (
    <div>
      <div className="hover-cards-container">
        {!selectedMonth ? (
          <div>
            <div className="hover-cards-grid1">
              {paginatedMonths.map((month, index) => (
                <div
                  key={index}
                  className="hover-card1"
                  onClick={() => handleMonthClick(month.index, month.year)}
                >
                  <h4 className="hover-card-title1">{month.name}</h4>
                  <div className="hover-card-shine"></div>
                  <div className="hover-card-background">
                    <div className="hover-card-tiles">
                      {[...Array(10)].map((_, tileIndex) => (
                        <div
                          key={tileIndex}
                          className={`hover-card-tile hover-card-tile-${tileIndex + 1}`}
                        ></div>
                      ))}
                    </div>
                    <div className="hover-card-line hover-card-line-1"></div>
                    <div className="hover-card-line hover-card-line-2"></div>
                    <div className="hover-card-line hover-card-line-3"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={() => handlePageChange(-1)} disabled={currentPage === 0}>
                Previous
              </button>
              <button
                onClick={() => handlePageChange(1)}
                disabled={(currentPage + 1) * monthsPerPage >= monthsList.length}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setSelectedMonth(null)} className="entries-back-button">
              Back to Months
            </button>
            <div className="hover-cards-grid">
              {displayedEntries.length === 0 ? (
                <p className="no-month">
                  Not so fast kid, Chapter{" "}
                  {new Date(selectedMonth.year, selectedMonth.monthIndex).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                  {" "}Locked.
                </p>
              ) : (
                displayedEntries.map((entry) => (
                  <div key={entry.id} className="hover-card">
                    <h4 className="hover-card-title">
                      {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}
                    </h4>
                    <p className="hover-card-content">{entry.content}</p>
                    <div className="hover-card-shine"></div>
                    <div className="hover-card-background">
                      <div className="hover-card-tiles">
                        {[...Array(10)].map((_, tileIndex) => (
                          <div
                            key={tileIndex}
                            className={`hover-card-tile hover-card-tile-${tileIndex + 1}`}
                          ></div>
                        ))}
                      </div>
                      <div className="hover-card-line hover-card-line-1"></div>
                      <div className="hover-card-line hover-card-line-2"></div>
                      <div className="hover-card-line hover-card-line-3"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Entries;
