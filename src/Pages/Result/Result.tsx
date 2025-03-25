import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
export const Result = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem(quizId!) || "[]");
    const storedAnswers = JSON.parse(
      localStorage.getItem(`${quizId}-answers`) || "{}"
    );

    const gradedResults = storedQuestions.map((q, index) => ({
      question: q.question,
      correct: q.answer === storedAnswers[index],
    }));
    setResults(gradedResults);
  }, [quizId]);
  return (
    <div>
      <h2>Results</h2>
      {results.map((res, index) => (
        <p key={index}>
          {res.question}: {res.correct ? "Correct" : "Incorrect"}
        </p>
      ))}
    </div>
  );
};
