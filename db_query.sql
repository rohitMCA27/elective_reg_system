CREATE DATABASE elective_system;
USE elective_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    user_id INT PRIMARY KEY,
    course VARCHAR(100) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    admission_year YEAR NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    faculty_id INT NOT NULL,
    seat_limit INT NOT NULL,
    deadline DATETIME NOT NULL,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (faculty_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id) REFERENCES courses(id)
        ON DELETE CASCADE,

    UNIQUE (student_id, course_id)
);


CREATE INDEX idx_app_course ON applications(course_id);
CREATE INDEX idx_app_student ON applications(student_id);
CREATE INDEX idx_course_faculty ON courses(faculty_id);