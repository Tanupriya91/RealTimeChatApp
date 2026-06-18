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

const { getAuth } = require ("firebase-admin/auth");
io.use(async(socket,next)=>{
    try{
        const token = socket.handshake.auth.token;

        if(!token){
            return next(new Error("Token required"));
        }
        const decoded = await getAuth().verifyIdToken(token);
        socket.data.user = decoded;
        next();
    }
    catch(error){
        console.log(error.message);
        next(new Error("Unauthorized"));
    }
});
io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    
    console.log(
        "User.UID:",
        socket.data.user.uid
    );

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});

httpServer.listen(3000, () =>{
    console.log("Server Running");
});