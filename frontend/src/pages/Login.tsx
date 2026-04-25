import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleLogin = async (data: any) => {
        try {
            const res = await loginUser(data);

            login(res.data);

            // Redirect based on role
            if (res.data.user.role === "faculty") {
                navigate("/faculty");
            } else {
                navigate("/");
            }
            return null;

        } catch (err: any) {
            const message = err?.response?.data?.message;
            if (message === "Invalid credentials") {
                return "Incorrect email or password. Please try again.";
            }
            // Log only unexpected errors for easier debugging.
            if (!err?.response) {
                console.error(err);
            }
            return "Unable to log in right now. Please try again in a moment.";
        }
    };

    return (
        <div className="page auth-page">
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};


export default Login;