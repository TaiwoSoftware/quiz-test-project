import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { Admin } from "./Pages/admin/Admin";
import { Quiz } from "./Pages/Quiz/Quiz";
function App() {
  return <Router>
    <Routes>
      <Route  path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path='/quiz/:quizId' element={<Quiz />} />
    </Routes>
  </Router>;
}

export default App;
