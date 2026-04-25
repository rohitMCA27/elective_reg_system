import { useState } from "react";

type FormData = {
    name: string;
    email: string;
    password: string;
    role: "student" | "faculty";
    cgpa: number;
};

const RegisterForm = ({ onRegister }: { onRegister: (data: FormData) => void }) => {
    const [form, setForm] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        role: "student",
        cgpa: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "cgpa" ? Number(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.name || !form.email || !form.password) {
            alert("All fields are required");
            return;
        }

        if (form.role === "student" && (form.cgpa < 0 || form.cgpa > 10)) {
            alert("CGPA must be between 0 and 10");
            return;
        }

        onRegister(form);
    };

    return (
        <form onSubmit={handleSubmit} className="form-card auth-card">
            <h2>Register</h2>

            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />

            <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />

            <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
            </select>

            {/* Show CGPA only for students */}
            {form.role === "student" && (
                <input
                    name="cgpa"
                    placeholder="CGPA"
                    type="number"
                    step="0.1"
                    value={form.cgpa}
                    onChange={handleChange}
                />
            )}

            <button type="submit" className="btn">Register</button>
        </form>
    );
};

export default RegisterForm;