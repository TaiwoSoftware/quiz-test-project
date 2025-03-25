import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const [questions, setQuestions] = useState([
    {
      question: "What is HTML?",
      options: [
        "Programming language",
        "Markup language",
        "Styling language",
        "Database",
      ],
      answer: "Markup language",
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheet",
        "Computer Style Sheet",
        "Creative Style System",
        "Colorful Style Sheet",
      ],
      answer: "Cascading Style Sheet",
    },
    {
      question: "Which JavaScript function is used to print to the console?",
      options: [
        "console.print()",
        "log.console()",
        "console.log()",
        "print.console()",
      ],
      answer: "console.log()",
    },
  ]);
  const navigate = useNavigate();

  const createQuiz = () => {
    const quizId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem(quizId, JSON.stringify(questions));
    navigate(`/quiz/${quizId}`);
  };
  return<div>
  <h2>Create a Quiz</h2>
  <button onClick={createQuiz}>Generate Quiz Link</button>
</div>;
};
