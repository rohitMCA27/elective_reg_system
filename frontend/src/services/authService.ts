import API from "./api";

// LOGIN
export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const res = await API.post("/auth/login", data);

    // store token + user
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res;
};

// REGISTER
export const registerUser = async (data: any) => {
    const res = await API.post("/auth/register", data);
    return res;
};