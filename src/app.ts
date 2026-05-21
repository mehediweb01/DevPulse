import express, { type Application } from "express";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

export default app;
