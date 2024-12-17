"use client";
import React, { useState, useEffect } from "react";
import "./app.css"; // Custom CSS for styles

const CodingProblemGenerator = () => {
  const [dailyProblemSets, setDailyProblemSets] = useState([]);
  const [completedProblems, setCompletedProblems] = useState([]);
  const [uploadDate, setUploadDate] = useState(null);
  const [chunkSize, setChunkSize] = useState(6); // Default chunk size

  useEffect(() => {
    const storedDailyProblemSets = localStorage.getItem("dailyProblemSets");
    const storedCompletedProblems = localStorage.getItem("completedProblems");
    const storedUploadDate = localStorage.getItem("uploadDate");

    if (storedDailyProblemSets) {
      setDailyProblemSets(JSON.parse(storedDailyProblemSets));
    }

    if (storedCompletedProblems) {
      setCompletedProblems(JSON.parse(storedCompletedProblems));
    }

    if (storedUploadDate) {
      setUploadDate(new Date(storedUploadDate));
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result as string;
        const problems = result.trim().split("\n");
        const sets = generateDailyProblemSets(problems, chunkSize);
        setDailyProblemSets(sets);
        setUploadDate(new Date());
        localStorage.setItem("dailyProblemSets", JSON.stringify(sets));
        localStorage.setItem("uploadDate", new Date().toISOString());
      };
      reader.readAsText(file);
    }
  };

  const generateDailyProblemSets = (problems, chunk_size) => {
    const shuffledProblems = [...problems];
    for (let i = shuffledProblems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledProblems[i], shuffledProblems[j]] = [
        shuffledProblems[j],
        shuffledProblems[i],
      ];
    }

    const sets = [];
    for (let i = 0; i < shuffledProblems.length; i += chunk_size) {
      sets.push(shuffledProblems.slice(i, i + chunk_size));
    }
    return sets;
  };

  const toggleProblemCompletion = (problem) => {
    if (completedProblems.includes(problem)) {
      setCompletedProblems(completedProblems.filter((p) => p !== problem));
    } else {
      setCompletedProblems([...completedProblems, problem]);
    }
    localStorage.setItem("completedProblems", JSON.stringify(completedProblems));
  };

  const getDaysSinceUpload = () => {
    if (!uploadDate) return 0;
    const currentDate = new Date();
    return Math.floor(
      (currentDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const daysSinceUpload = getDaysSinceUpload();

  return (
    <div className="terminal-container">
      <header className="terminal-header">
        <h1>🎄 Advent of LeetCode 🎄</h1>
      </header>
      <main className="terminal-main">
        <div className="upload-section">
          <label htmlFor="chunk-size">🛠️ Set Chunk Size:</label>
          <input
            id="chunk-size"
            type="number"
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            min="1"
            className="chunk-size-input"
          />
          <label htmlFor="problem-file">📁 Upload Problem List:</label>
          <input
            id="problem-file"
            type="file"
            className="file-input"
            onChange={handleFileUpload}
          />
        </div>
        <div className="problem-list">
          {uploadDate && (
            <p>📅 Problems since {uploadDate.toLocaleDateString("en-US")}:</p>
          )}
          <ul className="problems-grid">
            {dailyProblemSets.map((set, dayIndex) => {
              const dayDate = new Date(
                uploadDate.getTime() + dayIndex * 24 * 60 * 60 * 1000
              );
              const isVisible = dayIndex < daysSinceUpload;

              return (
                <li key={dayIndex} className="problem-item">
                  <h4 className="day-header">
                    Day {dayIndex + 1} - {dayDate.toLocaleDateString("en-US")}
                  </h4>
                  {isVisible ? (
                    <ul className="problem-set">
                      {set.map((problem, index) => (
                        <li key={index} className="problem">
                          <span
                            className={`problem-text ${
                              completedProblems.includes(problem)
                                ? "completed"
                                : ""
                            }`}
                          >
                            {problem}
                          </span>
                          <button
                            className={`toggle-button ${
                              completedProblems.includes(problem)
                                ? "completed"
                                : ""
                            }`}
                            onClick={() => toggleProblemCompletion(problem)}
                          >
                            {completedProblems.includes(problem) ? "⭐ " : "❌"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="hidden-message">
                      🤫 Come back on {dayDate.toLocaleDateString("en-US")} to
                      see the problems!
                    </p>
                  )}
                </li>
              );
            })}
            {daysSinceUpload > dailyProblemSets.length && (
              <p className="text-gray-600">
                No more problems available for future days.
              </p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CodingProblemGenerator;
