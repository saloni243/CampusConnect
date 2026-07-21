import fs from "fs";

const deleteFile = (filePath) => {

    if (!filePath) return;

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

};

export default deleteFile;