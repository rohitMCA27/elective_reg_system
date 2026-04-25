import pool from "../config/db.js";

// CREATE COURSE (faculty)
export const createCourse = async (req, res) => {
    try {
        const { title, description, seat_limit, deadline } = req.body;
        const faculty_id = req.user.id;

        const [result] = await pool.query(
            "INSERT INTO courses (title, description, faculty_id, seat_limit, deadline) VALUES (?, ?, ?, ?, ?)",
            [title, description, faculty_id, seat_limit, deadline]
        );

        res.status(201).json({
            message: "Course created",
            courseId: result.insertId,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, seat_limit, deadline } = req.body;
        const faculty_id = req.user.id;

        // check ownership
        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ? AND faculty_id = ?",
            [id, faculty_id]
        );

        if (!course) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (course.is_finalized) {
            return res.status(400).json({ message: "Cannot edit finalized course" });
        }

        await pool.query(
            "UPDATE courses SET title=?, description=?, seat_limit=?, deadline=? WHERE id=?",
            [title, description, seat_limit, deadline, id]
        );

        res.json({ message: "Course updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// DELETE COURSE
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty_id = req.user.id;

        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ? AND faculty_id = ?",
            [id, faculty_id]
        );

        if (!course) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (course.is_finalized) {
            return res.status(400).json({ message: "Cannot delete finalized course" });
        }

        // delete applications first (FK safety)
        await pool.query("DELETE FROM applications WHERE course_id = ?", [id]);

        await pool.query("DELETE FROM courses WHERE id = ?", [id]);

        res.json({ message: "Course deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const finalizeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const faculty_id = req.user.id;

        // check ownership
        const [[course]] = await pool.query(
            "SELECT * FROM courses WHERE id = ? AND faculty_id = ?",
            [courseId, faculty_id]
        );

        if (!course) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (course.is_finalized) {
            return res.status(400).json({ message: "Already finalized" });
        }

        // reject all pending
        await pool.query(
            "UPDATE applications SET status = 'rejected' WHERE course_id = ? AND status = 'pending'",
            [courseId]
        );

        // mark finalized
        await pool.query(
            "UPDATE courses SET is_finalized = TRUE WHERE id = ?",
            [courseId]
        );

        res.json({ message: "Course finalized" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET COURSES (FIXED)
export const getCourses = async (req, res) => {
    try {
        const user = req.user;

        let query = `
            SELECT 
                c.*,
                (
                    SELECT COUNT(*) 
                    FROM applications a 
                    WHERE a.course_id = c.id AND a.status = 'approved'
                ) AS approved_count
            FROM courses c
        `;

        let params = [];

        // ✅ SAME FILTER AS YOUR OLD WORKING VERSION
        if (user.role === "faculty") {
            query += " WHERE c.faculty_id = ?";
            params.push(user.id);
        }

        const [courses] = await pool.query(query, params);

        res.json(courses);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};