# Project Management Tool

This is a MERN stack (MongoDB, Express, React, Node.js) Project Management application.

## 1. Steps to Run Locally

You can easily run the entire application stack locally using Docker Compose.

### Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.
* [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop).

### Instructions
1. Open your terminal and navigate to the project's root directory.
2. Run the following command to build the images and start the containers:
   ```bash
   docker-compose up --build -d
   ```
3. Once the containers are running:
   * **Frontend**: Access the application in your browser at `http://localhost`
   * **Backend API**: The API is accessible at `http://localhost:5000`
   * **MongoDB**: The local database is running and mapped to port `27017`
4. To stop the application, run:
   ```bash
   docker-compose down
   ```

## 2. Docker Commands Used

Below are the key Docker commands utilized in this project:

* `docker-compose up --build -d`: Builds the images specified in the compose file and starts the containers in detached mode.
* `docker-compose down`: Stops and removes the containers, networks, and images created by `up`.
* `docker build -t pm_backend ./backend`: Builds the backend Docker image individually.
* `docker build -t pm_frontend --build-arg VITE_API_URL=http://localhost:5000 ./frontend`: Builds the frontend Docker image with the provided build arguments for the API URL.
* `docker run -p 5000:5000 pm_backend`: Runs the backend container locally.

## 3. Deployment Link

**Backend Live URL**: [YOUR_RENDER_BACKEND_URL_HERE] 
*(Note: Replace the placeholder above with your actual Render deployment URL once you deploy. You can deploy easily by connecting this repository to Render, as a `render.yaml` blueprint is already included in the project root.)*

## 4. Architecture Explanation

This application follows a traditional 3-tier architecture containerized with Docker:

1. **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite. In the production Docker environment, it is built statically and served using an **Nginx** web server. Nginx handles client-side routing by returning `index.html` for any unknown routes.
2. **Backend (API)**: A REST API built with Node.js and Express.js. It handles authentication (JWT), project/task management logic, real-time updates via Socket.io, and email invitations.
3. **Database**: MongoDB is used as the primary database to store users, projects, tasks, and invitations. In local development via Docker, a MongoDB container is spun up alongside the application for data persistence using Docker volumes. In production, it connects to MongoDB Atlas.
