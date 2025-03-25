import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // Import Supabase client
import image from "../images/book.png"; // Import background image

export const Login = () => {
  const [matricnumber, setMatricnumber] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!matricnumber || !surname) {
      setError("Both fields are required.");
      return;
    }

    try {
      // Check if user exists in the database
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("matricnumber", matricnumber)
        .eq("surname", surname)
        .single(); // Expect only one match

      if (fetchError) {
        setError("Invalid Matric Number or Surname.");
        return;
      }

      console.log("User logged in:", data);
      navigate("/quiz/sample"); // Redirect to dashboard if successful
    } catch (error: any) {
      setError("Something went wrong. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
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

      {/* Login Form */}
      <motion.div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Matric Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={matricnumber}
              onChange={(e) => setMatricnumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Surname</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};
