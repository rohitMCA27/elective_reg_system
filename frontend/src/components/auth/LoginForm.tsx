import React, { useState } from "react";

type Props = {
    onLogin: (data: { email: string; password: string }) => Promise<string | null>;
};

const LoginForm: React.FC<Props> = ({ onLogin }) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const loginError = await onLogin(form);
        if (loginError) {
            setError(loginError);
        }

        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="form-card auth-card">
            <h2>Login</h2>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                required
            />

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn" disabled={submitting}>
                {submitting ? "Signing in..." : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;