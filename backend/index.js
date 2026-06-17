const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(express.json());
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

io.on("connection",(Socket)=> {
    console.log("Connected:",Socket.id);

    Socket.on("disconnect", ()=>{
        console.log("Disconnected:", Socket.id);
    })
});
httpServer.listen(3000,() => {
    console.log("Server Running");
})