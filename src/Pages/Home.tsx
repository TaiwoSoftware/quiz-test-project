import { Link } from "react-router-dom";
import image from "../components/images/book.png";
import logo from "../components/images/logo.png";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export const Home = () => {
  // Define breakpoints
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Mobile
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // Tablet

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center px-4 sm:px-8">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      ></div>

      {/* Top Bar with Logo */}
      <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
        <img src={logo} alt="Logo" className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24`} />
      </div>

      {/* Sign Up Button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/role"
          className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
        >
          Sign Up
        </Link>
      </div>

      {/* Title */}
      <motion.h1
        className="relative text-white text-center font-bold mb-4"
        style={{
          fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to the Quiz Platform
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="relative text-gray-200 text-center mb-6"
        style={{
          fontSize: isMobile ? "0.9rem" : isTablet ? "1.1rem" : "1.25rem",
          maxWidth: "80%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Test your knowledge in HTML, CSS, and JavaScript.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="relative flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          to="/admin_login"
          className="px-5 py-3 text-sm sm:text-base bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Create a Quiz
        </Link>
        <Link
          to="/login"
          className="px-5 py-3 text-sm sm:text-base bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          Take a Quiz
        </Link>
      </motion.div>
    </div>
  );
};
