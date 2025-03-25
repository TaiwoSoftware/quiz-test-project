import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "./supabaseClient";
import type { Assessment, Question, Participant, Answer } from "./types";
import { useMediaQuery } from "react-responsive";
export const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [message, setMessage] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Mobile
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from("assessments")
      .select("*");
  
    if (error) {
      console.error("Error fetching assessments:", error);
      return;
    }
  
    if (data) {
      setAssessments(data as Assessment[]);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const handleSaveAssessment = async () => {
    if (!title || !description || questions.length === 0) {
      setMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("assessments").insert([
      {
        title,
        description,
        questions,
      },
    ]);

    if (error) {
      setMessage("Error saving assessment.");
      console.error(error);
    } else {
      setMessage("Assessment saved successfully!");
      fetchAssessments();
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/assessment/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard: " + link);
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    const { error } = await supabase
      .from("assessments")
      .delete()
      .eq("id", assessmentId);
      
    if (error) {
      console.error("Error deleting assessment:", error);
    } else {
      setAssessments(assessments.filter(a => a.id !== assessmentId));
    }
  };

  const fetchParticipants = async (assessmentId: string) => {
    setSelectedAssessment(assessmentId);

    const { data, error } = await supabase
      .from("submissions")
      .select("student_matric, answers")
      .eq("assessment_id", assessmentId);

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }

    if (data) {
      setParticipants(data as Participant[]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <motion.div
        className="mx-auto bg-white shadow-xl rounded-lg p-4 sm:p-6"
        style={{
          width: isMobile ? "95%" : isTablet ? "80%" : "700px",
        }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
          Admin Dashboard
        </h1>

        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Total Assessments: {assessments.length}
        </h2>

        <motion.div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Create Assessment</h2>
          <input
            type="text"
            placeholder="Assessment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg mb-2"
          />

          <textarea
            placeholder="Assessment Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg mb-4"
          />

          {questions.map((q, index) => (
            <motion.div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow mt-2">
              <p className="font-bold">Question {index + 1}:</p>
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="w-full p-2 border rounded-lg mb-2"
              />

              <div className="ml-2 sm:ml-4">
                <p className="font-semibold">Options:</p>
                {q.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full p-2 border rounded-lg mt-1"
                  />
                ))}
              </div>
            </motion.div>
          ))}

          <button 
            onClick={handleAddQuestion} 
            className="mt-4 bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg"
          >
            Add Question
          </button>
          <button 
            onClick={handleSaveAssessment} 
            className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg ml-4"
          >
            Save Assessment
          </button>

          {message && <p className="mt-2 text-green-500">{message}</p>}
        </motion.div>

        <motion.div className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Assessments</h2>
          {assessments.length === 0 ? (
            <p className="text-gray-500">No assessments created yet.</p>
          ) : (
            <motion.ul className="bg-white p-4 rounded-lg shadow-md">
              {assessments.map((assessment) => (
                <motion.li key={assessment.id} className="border-b py-2 last:border-none">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <span
                      className="text-gray-700 font-medium cursor-pointer mb-2 sm:mb-0"
                      onClick={() => fetchParticipants(assessment.id)}
                    >
                      {assessment.title}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleCopyLink(assessment.id)}
                        className="bg-blue-500 text-white px-3 sm:px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="bg-red-500 text-white px-3 sm:px-4 py-1 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {selectedAssessment === assessment.id && (
                    <motion.div className="bg-gray-50 p-3 sm:p-4 mt-4 rounded-lg">
                      <h3 className="text-md sm:text-lg font-bold">
                        Participants: {participants.length}
                      </h3>
                      {participants.length === 0 ? (
                        <p className="text-gray-500">No submissions yet.</p>
                      ) : (
                        <ul className="mt-2">
                          {participants.map((participant, idx) => (
                            <li key={idx} className="mb-2 p-2 border rounded-lg">
                              <p className="font-semibold">
                                Matric Number: {participant.student_matric}
                              </p>
                              <p className="text-sm text-gray-600">Answers:</p>
                              <ul className="pl-4">
                                {JSON.parse(participant.answers).map((ans:Answer, i: number) => (
                                  <li key={i} className="text-sm">
                                    <strong>Q{i + 1}:</strong> {ans.selected_answer}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};