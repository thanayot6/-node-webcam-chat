/*This is a Node.js server-side script that uses
 the Express and Socket.io libraries to create a real-time 
 WebRTC video chat application. */


 /**
 * These lines import the Express and uuid libraries, 
 * and create an instance of the Express application and an HTTP server.
 */

const express = require("express");  
const app = express(); 
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
//import ตัวแปร Express และ uuid และสร้า instance ของแอปพลิเคชัน Express และเซิร์ฟเวอร์ HTTP

/**
 * This line imports the ExpressPeerServer module from the peer library, 
 * and the next line creates an options object with the debug property 
 * set to true.
 */
const { ExpressPeerServer } = require("peer");//นำเข้าโมดูล ExpressPeerServer จาก ตัวแปร peer
const opinions = {
    debug: true,
}/*สร้าง opinions ตัวเลือก debug และตั้งค่าเป็น true */

/**
 * This line sets the view engine for the Express application to EJS, 
 * and the next line imports the Socket.io library 
 * and attaches it to the HTTP server. 
 * The cors property is used to allow connections from any origin.
 */
app.set("view engine", "ejs");//บรรทัดนี้ตั้งค่า view engine สำหรับแอปพลิเคชัน Express ให้เป็น EJS
const io = require("socket.io")(server, { //import Socket.io และแนบกับเซิร์ฟเวอร์ HTTP
    cors: {
        origin: '*'
    }
});//กำหนด cors เพื่ออนุญาตการเชื่อมต่อจากต้นทาง

/**
 * These lines mount the ExpressPeerServer middleware on the /peerjs route 
 * and serve the contents of the public directory as static assets.
 */

app.use("/peerjs", ExpressPeerServer(server, opinions)); //ติดตั้งmiddleware ExpressPeerServer บน peerjs 
app.use(express.static("public"));//ตั้งค่าการใช้งานเป็น public 


/**
 * This code creates a route for the root URL and 
 * redirects the user to a randomly generated room ID 
 * created by uuidv4()
 */

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
}); //สร้าง URL สำหรับการเข้าถึงของผู้ใช้


/**
 * This code creates a route for URLs with a room parameter 
 * and renders the room.ejs view with the roomId parameter passed in.
 */

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});
//รหัสนี้สร้างเส้นทางสำหรับ URL ด้วยพารามิเตอร์ห้องและแสดงมุมมอง room.ejs ด้วยพารามิเตอร์ roomId ที่ส่งผ่านเข้ามา



/**
 * This code listens for a "connection" event from the client, 
 * and when a client connects it listens for a "join-room" event 
 * and joins the room with a certain roomId. 
 * It also emits an event "user-connected" with a certain userId 
 * after 1 sec. It also listens for a "message" event, 
 * and when a message is received, 
 * it emits the message and the userName to all clients in the room.
 */
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        setTimeout(() => {
            socket.to(roomId).broadcast.emit("user-connected", userId);
        }, 1000)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
}); //เป็นการเชื่อมต่อ เมื่อผู้ใช้กดเข้าร่วมห้องโดยเก็บตัวแปร roomId, userId, userName และเชื่อมต่อข้อความเมื่อมีคนส่งข้อความมา

/**This line starts the server and 
 * listens on the port specified in the 
 * PORT environment variable or port 3030 if it is not set. */
server.listen(process.env.PORT || 3030); //เป็นการเชื่อมต่อ server โดยกำหนด port เป็น 3030 

