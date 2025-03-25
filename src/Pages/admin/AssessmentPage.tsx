import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import image from "../Quiz/book.png";

const isValidUUID = (id: string | undefined) => {
  return (
    id &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id
    )
  );
};

export const AssessmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [matricNumber, setMatricNumber] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    if (currentQuestion < assessment?.questions.length - 1) {
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

    console.log("Valid Assessment ID:", id);

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
          setAssessment(data);
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
    if (!isValidUUID(id)) {
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

    const formattedAnswers = assessment.questions.map(
      (q: any, index: number) => ({
        question: q.question,
        selected_answer: answers[index] || null,
      })
    );

    setSubmitting(true);

    try {
      console.log("Submitting assessment with ID:", id);

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
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-6 max-w-lg w-full shadow-md rounded-lg text-center">
          {currentQuestion === 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">{assessment?.title}</h2>
              <p className="mb-4">{assessment?.description}</p>
              <input
                type="text"
                placeholder="Enter your Matric Number"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                disabled={submitting}
              />
            </>
          )}

          {assessment?.questions.length > 0 ? (
            <div className="mb-6 p-4 border rounded-lg">
              <p className="font-semibold text-lg">
                {assessment.questions[currentQuestion].question}
              </p>
              {assessment.questions[currentQuestion].options.map(
                (option: string, oIndex: number) => (
                  <div key={oIndex} className="flex items-center gap-2 mt-2">
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() =>
                        setAnswers({ ...answers, [currentQuestion]: option })
                      }
                      disabled={submitting}
                    />
                    <label>{option}</label>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No questions available for this assessment.
            </p>
          )}

          <div className="flex justify-between mt-4">
            {currentQuestion > 0 && (
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                onClick={handlePrev}
              >
                Previous
              </button>
            )}
            {currentQuestion < assessment?.questions.length - 1 ? (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={submitAssessment}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
