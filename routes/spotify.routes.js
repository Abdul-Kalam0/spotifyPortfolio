import express from "express";
const router = express.Router();
import {
  getTopTracks,
  login,
  callback,
  currentPlayingSong,
  puaseNowPlayingSong,
  playAnyTrackSong,
  followArtists,
} from "../controllers/spotify.controllers.js";

//OAuth
router.get("/auth/login", login);
router.get("/auth/callback", callback);

//spotify
router.get("/top-tracks", getTopTracks); //Top 10 tracks
router.get("/currently-playing", currentPlayingSong); //now playing
router.post("/play-track/:uri", playAnyTrackSong); // play any song from top 10 tracks
router.get("/pause-current-song", puaseNowPlayingSong); // stop currently playing song
router.get("/artists", followArtists); //Following artists

export default router;
