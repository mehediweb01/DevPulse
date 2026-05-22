import express, { type Application } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFoundHandler from "./middleware/notFoundHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
