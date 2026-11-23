const cors = require("cors");

const corsOptions = {
    origin: [
        "https://dreamaz-project-yr6w-dun.vercel.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

module.exports = cors(corsOptions);