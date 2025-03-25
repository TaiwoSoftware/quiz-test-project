import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import image from "../Quiz/book.png";
import { useMediaQuery } from "react-responsive";
export const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Mobile
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // Tablet

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into Supabase
      const { error: insertError } = await supabase.from("admins").insert([
        {
          email,
          password: hashedPassword,
        },
      ]);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      console.log("Admin registered:", email);
      navigate("/admin_login"); // Redirect to login page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("Something went wrong. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Registration Container */}
      <div
        className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full"
        style={{
          maxWidth: isMobile ? "90%" : isTablet ? "70%" : "400px", // Adjust width dynamically
        }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Admin Registration
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/admin_login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
