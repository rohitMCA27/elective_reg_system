export type Application = {
    id: number;
    studentName: string;
    cgpa: number;
    status: "pending" | "approved" | "rejected";
};