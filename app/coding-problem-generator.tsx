"use client"
import React, { useState, useEffect } from 'react';

const CodingProblemGenerator = () => {
  const [problemList, setProblemList] = useState([]);
  const [dailyProblems, setDailyProblems] = useState([]);
  const [completedProblems, setCompletedProblems] = useState([]);

  useEffect(() => {
    // Load problem list and completed problems from local storage
    const storedProblemList = localStorage.getItem('problemList');
    const storedCompletedProblems = localStorage.getItem('completedProblems');

    if (storedProblemList) {
      const problems = JSON.parse(storedProblemList);
      setProblemList(problems);
      generateDailyProblems(problems);
    }

    if (storedCompletedProblems) {
      setCompletedProblems(JSON.parse(storedCompletedProblems));
    }
  }, []);

  useEffect(() => {
    // Save problem list and completed problems to local storage
    localStorage.setItem('problemList', JSON.stringify(problemList));
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
  }, [problemList, completedProblems]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const problems = event.target.result.trim().split('\n');
        setProblemList(problems);
        generateDailyProblems(problems);
      };
      reader.readAsText(file);
    }
  };

  const generateDailyProblems = (problems) => {
    const currentDate = new Date();
    const daysSinceStart = Math.floor((currentDate.getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = daysSinceStart * 10;
    const endIndex = startIndex + 10;
    setDailyProblems(problems.slice(startIndex, endIndex));
  };

  const toggleProblemCompletion = (problem) => {
    if (completedProblems.includes(problem)) {
      setCompletedProblems(completedProblems.filter((p) => p !== problem));
    } else {
      setCompletedProblems([...completedProblems, problem]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Coding Problem Generator</h2>
        <div className="mb-4">
          <label htmlFor="problem-file" className="block font-medium mb-2">
            Upload Problem List
          </label>
          <input
            id="problem-file"
            type="file"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFileUpload}
          />
        </div>
        {dailyProblems.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <ul className="space-y-2">
              {dailyProblems.map((problem, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 bg-gray-100 rounded-md text-gray-800 flex justify-between items-center ${
                    completedProblems.includes(problem)
                      ? 'line-through text-gray-400'
                    : ''
                  }`}
                >
                  {problem}
                  <button
                    className={`px-2 py-1 rounded-md text-sm ${
                      completedProblems.includes(problem)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                    onClick={() => toggleProblemCompletion(problem)}
                  >
                    {completedProblems.includes(problem) ? 'Undo' : 'Complete'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingProblemGenerator;
