import React, { useState } from "react";

type Props = {
    onCreate: (data: any) => void;
};

const CreateCourseForm: React.FC<Props> = ({ onCreate }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        seat_limit: "",
        deadline: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(form);
    };

    return (
        <form onSubmit={handleSubmit} className="form-card">
            <h2>Create Course</h2>

            <input name="title" placeholder="Title" onChange={handleChange} required />

            <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
            />

            <input
                name="seat_limit"
                type="number"
                placeholder="Seat Limit"
                onChange={handleChange}
                required
            />

            <input
                name="deadline"
                type="datetime-local"
                onChange={handleChange}
                required
            />

            <button type="submit" className="btn">Create</button>
        </form>
    );
};

export default CreateCourseForm;