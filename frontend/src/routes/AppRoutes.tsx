import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import FacultyDashboard from "../pages/FacultyDashboard";
import StudentDashboard from "../pages/StudentDashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/my-applications" element={<StudentDashboard />} />
        </Routes>
    );
};

export default AppRoutes;