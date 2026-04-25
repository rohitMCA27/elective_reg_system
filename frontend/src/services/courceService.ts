import API from "./api";


export const getCourses = () => API.get("/courses");

export const finalizeCourse = (courseId: number) =>
    API.put(`/courses/finalize/${courseId}`);

export const createCourse = (data: any) =>
    API.post("/courses", data);

export const updateCourse = (id: number, data: any) =>
    API.put(`/courses/${id}`, data);

export const deleteCourse = (id: number) =>
    API.delete(`/courses/${id}`);