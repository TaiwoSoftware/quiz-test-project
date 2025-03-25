import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import bcrypt from "bcryptjs";
import image from "../Quiz/book.png";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Background Overlay for Opacity */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Login Container */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>

          <p className="mt-4 text-center">
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
