import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicatinService";

type Application = {
    id: number;
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected";
};

const StudentDashboard = () => {
    const [apps, setApps] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await getMyApplications();
                setApps(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApps();
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <h2>My Applications</h2>
                <p className="muted-text">Track the status of all your submitted applications.</p>
            </div>

            {apps.length === 0 ? (
                <p className="empty-state">No applications yet</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {apps.map((a) => (
                            <tr key={a.id}>
                                <td>{a.title}</td>
                                <td>{a.description}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(a.status)}`}>
                                        {a.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const getStatusClass = (status: string) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
};

export default StudentDashboard;