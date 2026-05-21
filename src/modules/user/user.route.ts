import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.createUser);

export const userRoute = router;
