import express from "express";
import mongoose from "mongoose";

import { config } from "dotenv";

config();

mongoose
	.connect(process.env.MONGO)
	.then(() => console.log("connected to db"))
	.catch((err) => console.log(err));

const app = express();
const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
