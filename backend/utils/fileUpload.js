import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10MB file limit
}).fields([
    { name: "image", maxCount: 1 },
]);

export default upload;
