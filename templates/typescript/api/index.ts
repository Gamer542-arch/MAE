import express from "express";\nconst app = express();\napp.get("/",(req,res)=>res.json({message:"Hello from {name}!"}));\napp.listen(3000,()=>console.log("{name} on :3000"));\n
