import { useNavigate } from "react-router-dom";

type Props = {
    user: {
        name: string;
        role: string;
    } | null;
    onLogout: () => void;
};

const Navbar = ({ user, onLogout }: Props) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="brand-button" onClick={() => navigate("/")}>
                    Elective System
                </button>

                {user && (
                    <>
                        <button className="btn btn-ghost" onClick={() => navigate("/")}>
                            Courses
                        </button>

                        {user.role === "student" && (
                            <button className="btn btn-ghost" onClick={() => navigate("/my-applications")}>
                                My Applications
                            </button>
                        )}

                        {user.role === "faculty" && (
                            <button className="btn btn-ghost" onClick={() => navigate("/faculty")}>
                                Dashboard
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="navbar-right">
                {user ? (
                    <>
                        <span className="user-chip">
                            {user.name} ({user.role})
                        </span>
                        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-secondary" onClick={() => navigate("/login")}>Login</button>
                        <button className="btn" onClick={() => navigate("/register")}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;