📁 Project Structure
elective_reg_system/
│
├── backend/
├── frontend/
├── db_query.sql
└── README.md
⚙️ Setup Instructions

Follow these steps carefully.

1️⃣ Clone the Repository
git clone https://github.com/rohitanil2603/elective_reg_system.git
cd elective_reg_system

2️⃣ Setup Database (MySQL)

Make sure MySQL is installed and running.

Open MySQL:
mysql -u root -p

Run the SQL file:
SOURCE db_query.sql;


3️⃣ Backend Setup
cd backend
npm install

Create .env file inside backend/
PORT=5000
DB_HOST=localhost
DB_USER=elective_user
DB_PASSWORD=password123
DB_NAME=elective_system
JWT_SECRET=your_secret_key

Run Backend
npm start

Server will run at:

http://localhost:5000
4️⃣ Frontend Setup

Open new terminal:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
