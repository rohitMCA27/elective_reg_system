import API from "./api";


export const applyToCourse = (data: { courseId: number }) =>
    API.post("/applications", data);


// GET APPLICATIONS (faculty)
export const getApplications = (courseId: number) =>
    API.get(`/applications/${courseId}`);


// GET MY APPLICATIONS (student)
export const getMyApplications = () =>
    API.get("/applications/my");


export const updateApplicationStatus = (
    id: number,
    status: "approved" | "rejected"
) =>
    API.put(`/applications/${id}`, { status });