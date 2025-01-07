import express from "express";
import { postImages, getImages } from "../controllers/image.controller.js";
import upload from '../utils/fileUpload.js';
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/postImages", protectRoute, upload, postImages);

router.get('/getImages', getImages);

export default router;
