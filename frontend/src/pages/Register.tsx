import RegisterForm from "../components/auth/RegisterForm";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (data: any) => {
        try {
            await registerUser(data);

            alert("Registration successful");

            navigate("/login");
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="page auth-page">
            <RegisterForm onRegister={handleRegister} />
        </div>
    );
};

export default Register;