
import express from "express";
import { joinRoom, getRoom } from "../controllers/room.controllers.js";

const router = express.Router();

router.post("/rooms/join", joinRoom);

router.get("/rooms/:roomId", getRoom);

export default router;