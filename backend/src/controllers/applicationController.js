import pool from "../config/db.js";


// APPLY TO COURSE
export const applyToCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const student_id = req.user.id;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID required" });
        }

        // Check course exists
        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ?",
            [courseId]
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check deadline
        if (new Date() > new Date(course.deadline)) {
            return res.status(400).json({ message: "Deadline passed" });
        }

        // Check duplicate
        const [existing] = await pool.query(
            "SELECT id FROM applications WHERE student_id = ? AND course_id = ?",
            [student_id, courseId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Already applied" });
        }

        // Insert
        await pool.query(
            "INSERT INTO applications (student_id, course_id, status) VALUES (?, ?, 'pending')",
            [student_id, courseId]
        );

        res.status(201).json({ message: "Applied successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getCourses = async (req, res) => {
    try {
        const user = req.user;

        let query = "SELECT * FROM courses";
        let params = [];

        // if faculty → only their courses
        if (user.role === "faculty") {
            query += " WHERE faculty_id = ?";
            params.push(user.id);
        }

        const [courses] = await pool.query(query, params);

        res.json(courses);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// STUDENT: GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {
    try {
        const student_id = req.user.id;

        const [applications] = await pool.query(
            `
      SELECT 
        a.id,
        c.id AS courseId,
        c.title,
        c.description,
        a.status
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.id DESC
      `,
            [student_id]
        );

        res.json(applications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



// FACULTY: GET APPLICATIONS FOR A COURSE
export const getApplications = async (req, res) => {
    try {
        const { courseId } = req.params;
        const faculty_id = req.user.id;

        // Check ownership
        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ? AND faculty_id = ?",
            [courseId, faculty_id]
        );

        if (!course) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const [applications] = await pool.query(
            `
      SELECT 
        a.id,
        u.name AS studentName,
        s.cgpa,
        a.status
      FROM applications a
      JOIN users u ON a.student_id = u.id
      JOIN students s ON s.user_id = u.id
      WHERE a.course_id = ?
      ORDER BY s.cgpa DESC
      `,
            [courseId]
        );

        res.json(applications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



// FACULTY: APPROVE / REJECT
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const faculty_id = req.user.id;

        // Validate status
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Get application
        const [[app]] = await pool.query(
            "SELECT * FROM applications WHERE id = ?",
            [id]
        );

        if (!app) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check ownership
        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ? AND faculty_id = ?",
            [app.course_id, faculty_id]
        );

        if (!course) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Seat limit check
        const [[{ count }]] = await pool.query(
            "SELECT COUNT(*) as count FROM applications WHERE course_id = ? AND status = 'approved'",
            [app.course_id]
        );

        if (status === "approved" && count >= course.seat_limit) {
            return res.status(400).json({ message: "Seat limit reached" });
        }

        // Update
        await pool.query(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status, id]
        );

        res.json({ message: "Status updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};