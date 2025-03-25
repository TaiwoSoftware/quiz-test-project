import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { Admin } from "./Pages/admin/Admin";
import { Quiz } from "./Pages/Quiz/Quiz";
import { Signup } from "./components/Auth/SignUp";
import { Login } from "./components/Auth/Login";
import { RoleSelection } from "./components/Auth/RoleSelection";
import { CreateAssessment } from "./Pages/admin/CreatingAssessment";
import { AdminLogin } from "./Pages/admin/AdminLogin";
import AdminRoute from "./Pages/admin/AdminRoute";
import { AdminDashboard } from "./Pages/admin/AdminDashboard";
import { AdminRegister } from "./Pages/admin/AdminRegister";
import { AssessmentPage } from "./Pages/admin/AssessmentPage";
import { Error } from "./Pages/Error/Error";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/assesment" element={<CreateAssessment />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_register" element={<AdminRegister />} />
        <Route
          path="/admin_dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/assessment/:id" element={<AssessmentPage />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
