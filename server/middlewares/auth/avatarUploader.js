// internal imports
const multiFileUploader = require("../../utilities/fileUploader");

const avatarUploader = (req, res, next) => {
    const uploader = multiFileUploader(
        "Avatars",
        ["image/jpeg", "image/jpg", "image/png"],
        1000000, // bytes
        1
    );
    uploader.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        } else {
            next();
        }
    });
};

module.exports = avatarUploader;
