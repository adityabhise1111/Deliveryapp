import type { Server as HttpServer } from "http";
import { Server, Socket } from 'socket.io';
import userModel from "../model/user.model";
import captainModel from "../model/captain.model";

let io: Server | null = null;

export async function initializeSocket(server: HttpServer) {
    //initialization code here
    io = new Server(server, {
        cors: {
            origin: process.env.FRONT_END_URL,
            methods: ["GET", "POST"]
        }
    })

    //socket connection event

    //connection event is built-in event in socket.io
    //its triggered when a client connects to the server
    io.on('connection', (socket: Socket) => {
        console.log(`New client connected: ${socket.id}`);

        //some socket event listeners

        socket.on("join", async (data) => {
            console.log("👤 Join request data:", data);
            const { userId, role } = data;
            if (role === 'user') {
                const user = await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                });
                console.log("User joined:", user);
            } else if (role === 'captain') {
                const captain = await captainModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                });
                console.log("Captain joined:", captain);
            }

        });

        socket.on("locationUpdateCaptains", async (data) => {
            console.log("📍 Location update data:", data);
            const { userId, location } = data;
            if (!location || !location.ltd || !location.lng) {
                console.error("Invalid location data received:", location);
                return;
            }
            try {
                const response = await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                }, { new: true });
                if (response) {
                    console.log(`Updated location for captain ${userId}:`, location);
                } else {
                    console.error(`Failed to update location for captain ${userId}`);
                }
            } catch (error) {
                console.error("Error updating captain location:", error);

            }
        });

        socket.on("message", (data) => {
            console.log("📩 Message from client:", data);
        });

        //disconnect event is built-in event in socket.io
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

// Function to send message to a specific socket
export async function sendMessageToSocket(socketId: string, messageData: { event: string; data: any }) {
    if (io) {
        console.log(`[Socket] Sending event '${messageData.event}' to socket ${socketId}`);
        io.to(socketId).emit(messageData.event, messageData.data); // ✅ Emit the actual event name
    } else {
        console.error("Socket.io not initialized.");
    }
}