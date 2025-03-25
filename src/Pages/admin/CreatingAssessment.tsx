import {  useState } from "react";
import { supabase } from "./supabaseClient";

export const CreateAssessment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [""], correctAnswer: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shareLink, setShareLink] = useState("");

  // Handle question text change
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  // Handle option text change
  const handleOptionChange = (qIndex:number, oIndex: number, value:string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [""], correctAnswer: "" }]);
  };

  // Add new option to a question
  const addOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  // Set correct answer
  const setCorrectAnswer = (qIndex: number, answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = answer;
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShareLink("");

    try {
      const { data, error } = await supabase
        .from("assessment")
        .insert([{ title, description, questions }])
        .select("uuid")
        .single();

      if (error) throw error;

      const link = `https://your-quiz-app.com/assessment/${data.uuid}`;
      setSuccess("Assessment created successfully!");
      setShareLink(link);
      setTitle("");
      setDescription("");
      setQuestions([{ text: "", options: [""], correctAnswer: "" }]);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Assessment</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Title:</label>
          <input type="text" className="w-full px-3 py-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Description:</label>
          <textarea className="w-full px-3 py-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded">
              <label className="block font-semibold">Question {qIndex + 1}:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded mb-2"
                placeholder="Enter question"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />

              <div className="mt-2">
                <h4 className="font-semibold">Options:</h4>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                    />
                    <input
                      type="radio"
                      name={`correct-answer-${qIndex}`}
                      checked={question.correctAnswer === option}
                      onChange={() => setCorrectAnswer(qIndex, option)}
                    />
                    <label className="text-sm">Correct</label>
                  </div>
                ))}
                <button type="button" className="text-blue-500 text-sm" onClick={() => addOption(qIndex)}>
                  + Add Option
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="block w-full bg-gray-300 text-black py-2 rounded-lg mt-2" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4">
          Create Assessment
        </button>
      </form>

      {shareLink && (
        <div className="mt-6 p-3 bg-gray-100 rounded text-center">
          <p className="mb-2 font-semibold">Share this link:</p>
          <input type="text" className="w-full px-3 py-2 border rounded mb-2" value={shareLink} readOnly />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigator.clipboard.writeText(shareLink)}>
            Share Link
          </button>
        </div>
      )}
    </div>
  );
};