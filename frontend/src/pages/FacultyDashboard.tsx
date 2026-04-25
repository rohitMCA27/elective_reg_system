import { useEffect, useState } from "react";

import {
    getApplications,
    updateApplicationStatus,
} from "../services/applicatinService";
import { createCourse, finalizeCourse, getCourses, updateCourse, deleteCourse } from "../services/courceService";
import CreateCourseForm from "../components/CreateCourseForm";

type Course = {
    id: number;
    title: string;
    description: string;
    seat_limit: number;
    deadline: string;
    is_finalized: number; // 0 or 1 from DB
};

type Application = {
    id: number;
    studentName: string;
    cgpa: number;
    status: "pending" | "approved" | "rejected";
};

const FacultyDashboard = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        seat_limit: "",
        deadline: "",
    });

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // load courses
    useEffect(() => {
        fetchCourses();
    }, []);

    // load applications
    useEffect(() => {
        if (!selectedCourse) return;

        const fetchApps = async () => {
            try {
                const res = await getApplications(selectedCourse);
                setApplications(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApps();
    }, [selectedCourse]);

    const selectedCourseObj = courses.find(
        (c) => c.id === selectedCourse
    );

    const approvedCount = applications.filter(
        (a) => a.status === "approved"
    ).length;

    const isFull =
        selectedCourseObj &&
        approvedCount >= selectedCourseObj.seat_limit;

    // approve / reject
    const handleStatus = async (
        id: number,
        status: "approved" | "rejected"
    ) => {
        try {
            await updateApplicationStatus(id, status);

            const res = await getApplications(selectedCourse!);
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // finalize
    const handleFinalize = async (courseId: number) => {
        try {
            await finalizeCourse(courseId);
            alert("Selection finalized");

            await fetchCourses();

            const resApps = await getApplications(courseId);
            setApplications(resApps.data);
        } catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (id: number) => {
        try {
            await deleteCourse(id);
            alert("Course deleted successfully");
            await fetchCourses();

            if (selectedCourse === id) {
                setSelectedCourse(null);
                setApplications([]);
            }

        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Unable to delete course");
        }
    };

    const toApiDateTime = (value: string) => {
        // Convert datetime-local format to MySQL-friendly datetime if needed.
        if (value.includes("T")) return `${value.replace("T", " ")}:00`;
        return value;
    };

    const handleCreate = async (data: {
        title: string;
        description: string;
        seat_limit: string;
        deadline: string;
    }) => {
        try {
            await createCourse({
                title: data.title.trim(),
                description: data.description.trim(),
                seat_limit: Number(data.seat_limit),
                deadline: toApiDateTime(data.deadline),
            });
            alert("Course created successfully");
            await fetchCourses();
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Unable to create course");
        }
    };

    const handleStartEdit = (course: Course) => {
        setEditingCourseId(course.id);
        setEditForm({
            title: course.title || "",
            description: course.description || "",
            seat_limit: String(course.seat_limit ?? ""),
            deadline: course.deadline?.replace(" ", "T")?.slice(0, 16) || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null);
        setEditForm({
            title: "",
            description: "",
            seat_limit: "",
            deadline: "",
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourseId) return;

        try {
            await updateCourse(editingCourseId, {
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                seat_limit: Number(editForm.seat_limit),
                deadline: toApiDateTime(editForm.deadline),
            });
            alert("Course updated successfully");
            await fetchCourses();
            handleCancelEdit();
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Unable to update course");
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Faculty Dashboard</h2>
                <p className="muted-text">Create courses and review applications in one place.</p>
            </div>

            <CreateCourseForm onCreate={handleCreate} />

            <section className="card">
                <h3>Your Courses</h3>
                <p className="muted-text">
                    Finalized courses are locked and cannot be edited or deleted.
                </p>

            <ul className="course-list">
                {courses.map((c) => (
                    <li key={c.id}>
                        <span
                            className={`course-list-title ${selectedCourse === c.id ? "is-selected" : ""}`}
                            onClick={() => setSelectedCourse(c.id)}
                        >
                            {c.title}
                        </span>

                        {c.is_finalized === 1 && (
                            <span className="status-badge status-neutral">Finalized</span>
                        )}

                        <button
                            className="btn btn-secondary"
                            onClick={() => handleStartEdit(c)}
                            disabled={c.is_finalized === 1}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(c.id)}
                            disabled={c.is_finalized === 1}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {editingCourseId && (
                <form className="form-card edit-course-form" onSubmit={handleEditSubmit}>
                    <h3>Edit Course</h3>

                    <input
                        name="title"
                        placeholder="Title"
                        value={editForm.title}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={editForm.description}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />

                    <input
                        name="seat_limit"
                        type="number"
                        min="1"
                        placeholder="Seat Limit"
                        value={editForm.seat_limit}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, seat_limit: e.target.value }))
                        }
                        required
                    />

                    <input
                        name="deadline"
                        type="datetime-local"
                        value={editForm.deadline}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, deadline: e.target.value }))
                        }
                        required
                    />

                    <div className="inline-actions">
                        <button type="submit" className="btn">
                            Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            </section>

            {selectedCourseObj && (
                <section className="card">
                    <h3>Applications</h3>

                    <button
                        className="btn"
                        onClick={() =>
                            handleFinalize(selectedCourseObj.id)
                        }
                        disabled={selectedCourseObj.is_finalized === 1}
                    >
                        {selectedCourseObj.is_finalized === 1
                            ? "Finalized"
                            : "Finalize Selection"}
                    </button>

                    <p>
                        Seats: {approvedCount} /{" "}
                        {selectedCourseObj.seat_limit}
                    </p>

                    {applications.length === 0 ? (
                        <p>No applications</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>CGPA</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.studentName}</td>
                                        <td>{a.cgpa}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(a.status)}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn"
                                                disabled={
                                                    a.status === "approved" ||
                                                    isFull ||
                                                    selectedCourseObj.is_finalized === 1
                                                }
                                                onClick={() =>
                                                    handleStatus(
                                                        a.id,
                                                        "approved"
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                disabled={
                                                    a.status !== "pending" ||
                                                    selectedCourseObj.is_finalized === 1
                                                }
                                                onClick={() =>
                                                    handleStatus(
                                                        a.id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}
        </div>
    );
};

const getStatusClass = (status: string) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
};

export default FacultyDashboard;