import React from "react";
import { useNavigate } from "react-router-dom";
import './App.css';  
const topics = ["DSA", "React", "JavaScript", "Python"];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Select a Topic</h1>
      <div className="dashboard-buttons">
        {topics.map((topic) => (
          <button key={topic} onClick={() => navigate(`/quiz/${topic.toLowerCase()}`)}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
