import express from "express";
import { postImages, getImages, downloadImages } from "../controllers/image.controller.js";
import upload from '../utils/fileUpload.js';
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/postImages", protectRoute, upload, postImages);

router.get('/getImages', getImages);
router.post('/downloadImages', protectRoute, downloadImages);

export default router;

