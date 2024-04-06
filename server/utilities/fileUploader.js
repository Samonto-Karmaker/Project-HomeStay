// external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const multiFileUploader = (folderName, fileType, maxSize, fileNum) => {
    // set file upload folder
    const upload_folder = `${__dirname}/../public/images/${folderName}/`;

    // set storage engine
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, upload_folder);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(ext, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now();
            cb(null, fileName + ext);
        },
    });

    // init upload
    const upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: (req, file, cb) => {
            if (req.files.length > fileNum) {
                cb(createError("You can only upload a maximum of " + fileNum + " files"));
            }
            else {
                if (fileType.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(createError(`Only ${fileType.join(", ")} types are allowed`));
                }
            }
        }
    })
    return upload;
};

module.exports = multiFileUploader;
