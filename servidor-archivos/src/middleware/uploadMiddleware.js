import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${file.originalname}`;
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage: storage });

export default upload;