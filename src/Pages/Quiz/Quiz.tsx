import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import image from "../Quiz/book.png";
import { useMediaQuery } from "react-responsive";
// ✅ Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

const QUIZ_TIME_LIMIT = 60; // ✅ Time in seconds

export const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCorrectionIndex, setCurrentCorrectionIndex] = useState(0);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("id, question, options, correct_answer");

        if (error) throw error;
        setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 20) || []); // Shuffle and pick 20 questions
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !quizFinished) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleFinishQuiz();
    }
  }, [timeLeft, quizFinished]);

  const handleNextQuestion = () => {
    if (selectedOption) {
      const correct =
        selectedOption === questions[currentQuestionIndex].correct_answer;

      if (correct) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setIncorrectAnswers([...incorrectAnswers, currentQuestionIndex]);
      }

      setAnsweredQuestions((prev) => prev + 1);
      setSelectedOption(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        handleFinishQuiz();
      }
    }
  };

  const handleFinishQuiz = () => {
    setQuizFinished(true);
  };

  const handleNextCorrection = () => {
    if (currentCorrectionIndex < incorrectAnswers.length - 1) {
      setCurrentCorrectionIndex(currentCorrectionIndex + 1);
    }
  };

  const handleGoHome = () => {
    navigate("/"); // Redirect to home page
  };

  const percentageScore = Math.round((score / questions.length) * 100);
  const progressPercentage = Math.round(
    (answeredQuestions / questions.length) * 100
  );

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      ></div>

      {/* Quiz Container */}
      <div
        className="w-full bg-white p-4 sm:p-6 shadow-lg rounded-lg relative z-10"
        style={{ maxWidth: isMobile ? "90%" : isTablet ? "80%" : "700px" }}
      >
        <div className="absolute top-2 right-2 text-lg sm:text-xl font-bold text-red-600 animate-bounce">
          ⏳ {timeLeft}s
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Quiz</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {quizFinished ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="w-full bg-white p-4 sm:p-6 shadow-lg rounded-lg text-center max-w-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Quiz Completed!</h3>
              <p className="text-md sm:text-lg">
                Your Score: <span className="text-blue-500">{percentageScore}%</span>
              </p>

              {incorrectAnswers.length > 0 ? (
                <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded">
                  <h4 className="text-md sm:text-lg font-semibold text-red-600">
                    Incorrect Answer:
                  </h4>
                  <p className="text-red-700 mt-2">
                    {questions[incorrectAnswers[currentCorrectionIndex]]?.question}
                  </p>
                  <p className="text-gray-800 mt-2">
                    Correct Answer: <span className="font-bold text-green-600">
                      {questions[incorrectAnswers[currentCorrectionIndex]]?.correct_answer}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-gray-700">Great job! No incorrect answers. 🎉</p>
              )}

              <div className="mt-6 flex justify-between">
                {currentCorrectionIndex < incorrectAnswers.length - 1 ? (
                  <button
                    className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleNextCorrection}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleGoHome}
                  >
                    Back to Home
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          !loading &&
          !error &&
          questions.length > 0 && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-4">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="mb-4 p-4 border rounded bg-gray-100">
                <p className="font-semibold">
                  {questions[currentQuestionIndex]?.question}
                </p>

                <div className="mt-4">
                  {questions[currentQuestionIndex]?.options.map((option, index) => (
                    <label
                      key={index}
                      className="block w-full px-4 py-2 mt-2 rounded-lg bg-white border cursor-pointer hover:bg-gray-300"
                    >
                      <input
                        type="radio"
                        name="quiz-option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {selectedOption && (
                  <button
                    className="mt-4 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
                  </button>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};
