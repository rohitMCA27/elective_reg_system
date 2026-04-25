type Props = {
    course: any;
    onApply: (id: number) => void;
    isApplied: boolean;
    isExpired: boolean;
    canApply: boolean;
};

const CourseCard = ({ course, onApply, isApplied, isExpired, canApply }: Props) => {
    const approvedCount = course.approved_count || 0;
    const isFull = approvedCount >= course.seat_limit;
    const deadlineLabel = new Date(course.deadline).toLocaleString();

    return (
        <article className="card course-card">
            <h3>{course.title}</h3>
            <p className="muted-text">{course.description}</p>
            <p><strong>Seats:</strong> {approvedCount} / {course.seat_limit}</p>
            <p><strong>Deadline:</strong> {deadlineLabel}</p>

            {!canApply ? (
                <span className="status-badge status-neutral">Students only</span>
            ) : isApplied ? (
                <button className="btn btn-success" disabled>
                    Applied
                </button>
            ) : isExpired ? (
                <span className="status-badge status-rejected">Closed</span>
            ) : isFull ? (
                <span className="status-badge status-neutral">Full</span>
            ) : (
                <button
                    className="btn"
                    onClick={() => onApply(course.id)}
                    disabled={false}
                >
                    Apply
                </button>
            )}
        </article>
    );
};

export default CourseCard;