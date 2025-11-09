import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from React app
app.use(cors());

import profileRoutes from "./routes/profile.routes.js";
import projectRouters from "./routes/project.routes.js";
import spotifyRoutes from "./routes/spotify.routes.js";

//portfolio routes
app.use("/users", profileRoutes);
app.use("/projects", projectRouters);

//spotify
app.use("/spotify", spotifyRoutes);

app.get("/", (req, res) => {
  return res.send(
    `
      <div>
        <h1>Welcome to Abdul Kalam's Portfolio Backend APIs</h1>
        <p>Access my Spotify API integration below:</p>
        <a href="https://abdul-portfolio-backend-eac01.vercel.app/spotify/auth/login" target="_blank">
          https://abdul-portfolio-backend-eac01.vercel.app/spotify/auth/login
        </a>
      </div>
    `
  );
});

export default app;
