import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import bcrypt from "bcryptjs";
import image from "../Quiz/book.png";
import { useMediaQuery } from "react-responsive";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Mobile
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // Tablet
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    // Fetch admin by email
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("email, password")
      .eq("email", email)
      .single();

    if (fetchError || !admin) {
      setError("Admin not found.");
      return;
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      setError("Invalid credentials.");
      return;
    }

    localStorage.setItem("isAdmin", "true");

    console.log("Admin logged in:", admin);
    navigate("/admin_dashboard"); // Redirect to admin page
  };

  return (
    <div
      className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Login Container */}
      <div
        className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full"
        style={{
          maxWidth: isMobile ? "90%" : isTablet ? "70%" : "400px", // Adjust width based on screen size
        }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
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
            className="w-full bg-blue-500 text-white p-2 rounded text-sm sm:text-base flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              "Login"
            )}
          </button>

          <p className="mt-4 text-center text-sm sm:text-base">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/admin_register")}
              className="text-blue-500"
            >
              Create Account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
