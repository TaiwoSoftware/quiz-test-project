import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import image from "../images/book.png";

export const RoleSelection = () => {
  const navigate = useNavigate();

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

      {/* Content */}
      <motion.div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Select Your Role</h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/admin_login")}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Admin
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          >
            Student
          </button>
        </div>
      </motion.div>
    </div>
  );
};
