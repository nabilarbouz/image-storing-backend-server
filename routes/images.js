var express = require('express');
var router = express.Router();
const {uploadFile, getFileStream} = require('../s3');

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


const multer = require("multer");
const upload = multer({dest: "uploads/"});

router.post('/', upload.single('image'), async (req, res ) => {
    const file = req.file;
    console.log(file)
    const result = await uploadFile(file);
    await unlinkFile(file.path)
    console.log(result);
    res.send({imagePath: `/images/${result.Key}`});
});

router.get('/:key', (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res)
})

module.exports = router;