# MovieReview
A simple web application for users who can create a movie and post it on the application. they can also rate or leave a review to a certain movie and leave a comment in the movie posted. it is built with react.js for the frontend and REST API for the backend. 

**Features**
Movie Management: Users can add new movies to the system.

User Ratings & Reviews: Leave comments and star ratings on any posted movie.

Smart Review Logic: Prevents "review spamming." If a user tries to review the same movie again, the system updates their existing review instead of creating a new one.

Full Stack Integration: Built with a React frontend and a REST API backend.

**Tech Stack**
Frontend: React + Vite.

Backend: Node.js + Express.js.

Database: MongoDB.

**Installation and Setup**
Backend (Node.js + MongoDB): Clone the Repository
git clone https://github.com/icrenzandreipambuena-png/MovieReview.git

Navigate to the project directory:
-cd MovieReview
-Install Dependencies
-npm install
Start the Backend Server
node server.js
Frontend (React + Vite):
Navigate to the frontend directory:
-cd client

Install Dependencies:
-npm install
-Run the Development Server
-npm run dev
Frontend runs by default on: http://localhost:5173

**Folder Structure**
/client: Contains the React frontend files.
server.js: The main entry point for the Express backend.
models/: Database schemas (e.g., movie.js).

.gitignore: Configured to ignore node_modules and environment files to keep the repository clean.
