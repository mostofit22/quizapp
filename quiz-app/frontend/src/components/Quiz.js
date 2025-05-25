// src/components/Quiz.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Quiz() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [correctOption, setCorrectOption] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/questions/${topic}`)
      .then(res => setQuestions(res.data))
      .catch(() => alert("Couldn't load questions. Backend running?"));
  }, [topic]);

  const handleSubmit = () => {
    if (selectedOption === null) return alert("Please select an option!");

    const question = questions[currentIndex];
    axios.post("http://127.0.0.1:5000/answer", {
      topic,
      question_id: question.id,
      selected_option: selectedOption
    }).then(res => {
      setCorrectOption(res.data.correct_option);
      if (res.data.correct) {
        setScore(score + 1);
        setFeedback("Correct! 🎉");
      } else {
        setFeedback("Wrong! 😢 The correct answer was: " + question.options[res.data.correct_option]);
      }

      setTimeout(() => {
        setFeedback("");
        setCorrectOption(null);
        setSelectedOption(null);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setShowScore(true);
        }
      }, 2000);
    });
  };

  if (questions.length === 0) return <div>Loading...</div>;

  if (showScore)
    return (
      <div className="score-section">
        <h2>You scored {score} out of {questions.length}!</h2>
        <button onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    );

  const currentQ = questions[currentIndex];

  return (
    <div className="quiz">
      <h2>{topic} Quiz</h2>
      <div className="question-count">Question {currentIndex + 1}/{questions.length}</div>
      <div className="question-text">{currentQ.question}</div>
      <div className="answer-section">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-button ${
              selectedOption === idx ? "selected" : ""
            }`}
            onClick={() => setSelectedOption(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {feedback && <div className="feedback">{feedback}</div>}
      <br />
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
    </div>
  );
}

export default Quiz;
