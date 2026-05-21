import { Router } from "express";
import auth from "../../middleware/auth";
import { issuesController } from "./issues.controller";

const router = Router();

router.post(
  "/",
  auth("contributor", "maintainer"),
  issuesController.createIssues,
);

router.get("/:id", issuesController.getSingleIssue);

export const issuesRoute = router;
