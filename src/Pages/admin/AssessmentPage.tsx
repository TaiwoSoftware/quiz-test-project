import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import type { Assessment, FormattedAnswer, Question } from "./types";

const isValidUUID = (id: string | undefined): boolean => {
  return (
    !!id &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id
    )
  );
};

export const AssessmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [matricNumber, setMatricNumber] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isValidUUID(id)) {
      setError("Invalid assessment ID format.");
      setLoading(false);
      return;
    }

    const fetchAssessment = async () => {
      try {
        const { data, error } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          setError("Assessment not found.");
        } else {
          setAssessment(data as Assessment);
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const submitAssessment = async () => {
    if (!id || !isValidUUID(id)) {
      alert("Invalid assessment ID format.");
      return;
    }

    if (!matricNumber.trim()) {
      alert("Please enter your Matric Number.");
      return;
    }

    if (
      !assessment?.questions ||
      Object.keys(answers).length !== assessment.questions.length
    ) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers: FormattedAnswer[] = assessment.questions.map(
      (q: Question, index: number) => ({
        question: q.question,
        selected_answer: answers[index] || null,
      })
    );

    setSubmitting(true);

    try {
      const { error } = await supabase.from("submissions").insert([
        {
          assessment_id: id.trim(),
          student_matric: matricNumber,
          answers: JSON.stringify(formattedAnswers),
        },
      ]);

      if (error) throw error;

      alert("Assessment submitted successfully!");
      setAnswers({});
      setMatricNumber("");
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Failed to submit assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Assessment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 max-w-2xl w-full shadow-xl rounded-lg">
        {currentQuestion === 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{assessment.title}</h2>
            <p className="text-gray-600 mb-6">{assessment.description}</p>
            <input
              type="text"
              placeholder="Enter your Matric Number"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={submitting}
            />
          </div>
        )}

        {assessment.questions.length > 0 ? (
          <div className="mb-8">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / assessment.questions.length) * 100)}% Complete
              </span>
            </div>
            
            <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="font-semibold text-xl mb-4">
                {assessment.questions[currentQuestion].question}
              </p>
              <div className="space-y-3">
                {assessment.questions[currentQuestion].options.map((option: string, oIndex: number) => (
                  <div
                    key={oIndex}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => setAnswers({ ...answers, [currentQuestion]: option })}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() => setAnswers({ ...answers, [currentQuestion]: option })}
                      disabled={submitting}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label className="flex-1 cursor-pointer">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No questions available for this assessment.
          </p>
        )}

        <div className="flex justify-between mt-6">
          <button
            className={`px-6 py-2 rounded-lg transition ${
              currentQuestion > 0
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className={`px-6 py-2 rounded-lg transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
              onClick={submitAssessment}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Assessment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};