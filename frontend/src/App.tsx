import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import "./App.css";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;