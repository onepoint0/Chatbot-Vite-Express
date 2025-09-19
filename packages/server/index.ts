import dotenv from "dotenv";
import express, { type Response, type Request } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log(`server is running in http://localhost:${port}`);
});
