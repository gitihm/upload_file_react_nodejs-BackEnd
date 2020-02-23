const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const port = 8000
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req,file,cb)=>{
      cb(null,Date.now()+'_'+file.originalname.split(' ').join())
  }
});
app.use(cors())
let uploader = multer({storage}).single('file')
app.post("/upload",(req,res)=>{
    uploader(req,res,(err)=>{
        if(err) res.json({message:'error'})
        else{
            if(req.file == undefined){
                res.json({message:'error: no file selected'})
            }
            else{
                res.json({message:'file uploaded', url : `http://localhost:${port}/uploads/${req.file.filename}`})
            }
        }
    })
    
});
// app.get("/upload",uploader.single('file'),(req,res)=>{
//     res.json({message:uploader.single('file').name})
// });

app.listen(port,(err)=>{
    if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    
})