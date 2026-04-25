import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/courceService";
import { applyToCourse, getMyApplications } from "../services/applicatinService";
import { useAuth } from "../context/AuthContext";

const Courses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [appliedIds, setAppliedIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const [coursesRes, applicationsRes] = await Promise.all([
                    getCourses(),
                    user?.role === "student" ? getMyApplications() : Promise.resolve(null),
                ]);

                setCourses(coursesRes.data);

                if (applicationsRes) {
                    const existingAppliedIds = applicationsRes.data.map(
                        (application: { courseId?: number; course_id?: number }) =>
                            application.courseId ?? application.course_id
                    );
                    setAppliedIds(
                        existingAppliedIds.filter((id: number | undefined): id is number => typeof id === "number")
                    );
                } else {
                    setAppliedIds([]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user?.role]);

    const handleApply = async (id: number) => {
        try {
            await applyToCourse({ courseId: id }); // IMPORTANT FIX

            setAppliedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

            alert("Applied successfully");
        } catch (err: any) {
            if (!err?.response) {
                console.error(err);
            }
            alert(err.response?.data?.message || "Error applying");
        }
    };

    if (loading) return <p className="page page-message">Loading courses...</p>;

    return (
        <div className="page">
            <div className="page-header">
                <h2>Courses</h2>
                <p className="muted-text">Browse available electives and apply before the deadline.</p>
            </div>

            {courses.length === 0 ? (
                <p className="empty-state">No courses available</p>
            ) : (
                <div className="course-grid">
                {courses.map((c) => {
                    const isExpired = new Date(c.deadline) < new Date();
                    const isApplied = appliedIds.includes(c.id);

                    return (
                        <CourseCard
                            key={c.id}
                            course={c}
                            onApply={handleApply}
                            isApplied={isApplied}
                            isExpired={isExpired}
                            canApply={user?.role === "student"}
                        />
                    );
                })}
                </div>
            )}
        </div>
    );
};

export default Courses;