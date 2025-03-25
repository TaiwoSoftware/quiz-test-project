import { Link } from "react-router-dom";
import image from "../components/images/book.png";
import logo from "../components/images/logo.png"; // Import the logo
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center">
      {/* Background Image with Very Dark Opacity */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      ></div>

      {/* Top Bar with Logo and Signup Button */}
      <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
        <img src={logo} alt="Logo" className="w-24 h-24" />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/role"
          className="px-4 py-2 bg-yellow-500 text-white  rounded-lg shadow-md hover:bg-yellow-600"
        >
          Sign Up
        </Link>
      </div>

      <motion.h1
        className="relative text-4xl font-bold mb-4 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to the Quiz Platform
      </motion.h1>

      <motion.p
        className="relative text-lg text-gray-200 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Test your knowledge in HTML, CSS, and JavaScript.
      </motion.p>

      <motion.div
        className="relative space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          to="/admin_login"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Create a Quiz
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          Take a Quiz
        </Link>
      </motion.div>
    </div>
  );
};