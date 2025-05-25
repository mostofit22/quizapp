import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import BackButton from "./components/BackButton";

function App() {
  const [topics] = useState(["dsa", "react", "javascript", "python"]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // Fetch questions when topic changes
  useEffect(() => {
    if (!selectedTopic) return;
    axios
      .get(`http://127.0.0.1:5000/questions/${selectedTopic}`)
      .then((res) => {
        setQuestions(res.data);
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowScore(false);
        setFeedback("");
        setShowCorrectAnswer(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        alert("Could not load questions. Is your backend running?");
      });
  }, [selectedTopic]);

  const handleOptionClick = (index) => {
    if (showCorrectAnswer) return; // disable after answer submitted
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option!");
      return;
    }

    const question = questions[currentIndex];
    const isCorrect = selectedOption === question.correct_option;

    if (isCorrect) {
      setScore((score) => score + 1);
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Wrong! :( ");
      setShowCorrectAnswer(true);
    }

    if (isCorrect) {
      // auto move next after delay
      setTimeout(() => {
        setFeedback("");
        setSelectedOption(null);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setShowScore(true);
        }
      }, 1500);
    }
  };

  const handleNextAfterWrong = () => {
    // move next question after showing correct answer
    setFeedback("");
    setSelectedOption(null);
    setShowCorrectAnswer(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  // Back to dashboard
  const handleBackToDashboard = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
    setFeedback("");
    setShowCorrectAnswer(false);
  };

  // If no topic selected, show dashboard
  if (!selectedTopic) {
    return (
      <div className="app">
        <h1>Select a Topic</h1>
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic}>
              <button
                className="topic-button"
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // If loading questions
  if (questions.length === 0) return <div>Loading questions...</div>;

  // Show final score
  if (showScore)
    return (
      <div className="app score-section">
        <h2>
          You scored {score} out of {questions.length}!
        </h2>
        <button className="submit-button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="app">
      <BackButton onClick={handleBackToDashboard} />

      <div className="question-section">
        <div className="question-count">
          <strong>
            Question {currentIndex + 1} / {questions.length}
          </strong>
        </div>
        <div className="question-text">{currentQuestion.question}</div>
      </div>

      <div className="answer-section">
        {currentQuestion.options.map((option, index) => {
          let className = "option-button";
          if (selectedOption === index) className += " selected";
          if (
            showCorrectAnswer &&
            index === currentQuestion.correct_option
          )
            className += " correct";
          if (
            showCorrectAnswer &&
            selectedOption === index &&
            selectedOption !== currentQuestion.correct_option
          )
            className += " wrong";

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleOptionClick(index)}
              disabled={showCorrectAnswer}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!showCorrectAnswer ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      ) : (
        <button className="submit-button" onClick={handleNextAfterWrong}>
          Next
        </button>
      )}

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
}

export default App;
