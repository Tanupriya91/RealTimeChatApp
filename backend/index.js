const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { db } = require("./config/firebase");
const app = express();
app.use(express.json());

app.get("/firebase-test",async(req,res)=>{
    try{
        await db.collection("test").add({
            message: "Firebase Connected",
            createdAt: new Date(),
        });
        res.json({
            success: true,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
        });
    }
});




const httpServer = http.createServer(app);

const io = new Server(httpServer,{
    cors: {
        origin: "*",
    },
});
app.get("/health",(req,res)=>{
    res.json({
        success: true,
        message: "server running",
    });
});
const roomRoutes = require("./routes/rooms");
app.use("/rooms", roomRoutes);

io.on("connection",(socket)=> {
    console.log("Connected:",Socket.id);

    socket.on("disconnect", ()=>{
        console.log("Disconnected:", socket.id);
    })
});
httpServer.listen(3000,() => {
    console.log("Server Running");
})