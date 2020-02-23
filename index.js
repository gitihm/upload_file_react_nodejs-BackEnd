const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const port = 8000
const server = `http://localhost:${port}`

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req,file,cb)=>{
      cb(null,Date.now()+'_'+file.originalname.split(' ').join().replace(',','_'))
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
                res.json({message:'file uploaded', url : `${server}/upload/${req.file.filename}`})
            }
        }
    })
    
});
app.get("/upload/:path",(req,res)=>{
    return res.sendFile(req.params.path, { root: 'uploads/' });
});

app.listen(port,(err)=>{
    if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    
})