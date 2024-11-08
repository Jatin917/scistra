import { Connection } from "./db/db.js";
import express from 'express'
import { route } from "./routes/route.js";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // or '*' to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you are sending cookies or HTTP authentication
}));

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});

app.use("/app/v1", route);

// Connection();