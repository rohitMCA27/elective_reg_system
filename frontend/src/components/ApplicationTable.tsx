import React from "react";

export type Application = {
    id: number;
    studentName: string;
    cgpa: number;
    status: "pending" | "approved" | "rejected";
};

type Props = {
    applications: Application[];
    onUpdateStatus?: (
        id: number,
        status: "approved" | "rejected"
    ) => void;

    // NEW (safe additions)
    seatLimit?: number;
    approvedCount?: number;
    isFinalized?: boolean;
};

const ApplicationTable: React.FC<Props> = ({
    applications,
    onUpdateStatus,
    seatLimit,
    approvedCount,
    isFinalized,
}) => {
    // seat full logic
    const isFull =
        seatLimit !== undefined &&
        approvedCount !== undefined &&
        approvedCount >= seatLimit;

    // sort by CGPA (HIGH → LOW)
    const sortedApps = [...applications].sort(
        (a, b) => b.cgpa - a.cgpa
    );

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>CGPA ↓</th>
                    <th>Status</th>
                    {onUpdateStatus && <th>Action</th>}
                </tr>
            </thead>

            <tbody>
                {sortedApps.map((app) => (
                    <tr key={app.id}>
                        <td>{app.studentName}</td>
                        <td>{app.cgpa}</td>

                        <td>
                            <span className={`status-badge ${getStatusClass(app.status)}`}>
                                {app.status}
                            </span>
                        </td>

                        {onUpdateStatus && (
                            <td>
                                <button
                                    className="btn"
                                    disabled={
                                        app.status === "approved" ||
                                        isFull ||
                                        isFinalized
                                    }
                                    onClick={() =>
                                        onUpdateStatus(app.id, "approved")
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    disabled={
                                        app.status !== "pending" ||
                                        isFinalized
                                    }
                                    onClick={() =>
                                        onUpdateStatus(app.id, "rejected")
                                    }
                                >
                                    Reject
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const getStatusClass = (status: string) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
};

export default ApplicationTable;