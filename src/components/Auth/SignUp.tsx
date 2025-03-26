import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import image from "../images/book.png"; // Import your background image

export const Signup = () => {
  const [matricnumber, setMatricnumber] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!matricnumber || !surname) {
      setError("All fields are required.");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ matricnumber, surname }]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      console.log("User registered:", { matricnumber, surname });
      navigate("/login"); // Redirect to login page
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

      {/* Signup Form */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSignup}>
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
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
