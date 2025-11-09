import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
import profileRoutes from "./routes/profile.routes.js";
import projectRouters from "./routes/project.routes.js";
import spotifyRoutes from "./routes/spotify.routes.js";

app.use("/users", profileRoutes);
app.use("/projects", projectRouters);
app.use("/spotify", spotifyRoutes);

app.get("/", (req, res) => {
  res.send(`
    <div>
      <h1>Welcome to Abdul Kalam's Portfolio Backend APIs</h1>
      <p>Access my Spotify API integration below:</p>
      <a href="https://spotify-portfolio-steel.vercel.app/spotify/auth/login" target="_blank">
          https://spotify-portfolio-steel.vercel.app/spotify/auth/login
        </a>
    </div>
  `);
});

export default app;
