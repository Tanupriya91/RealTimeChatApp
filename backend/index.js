const express = require("express");

const app = express();

app.use(express.json());
app.get("/health",(req,res)=>{

    res.json({
        success: true,
        message: "server running",
    });
});

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});