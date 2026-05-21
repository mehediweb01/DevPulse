import { pool } from "../../db";
import { issuesStatus, issuesType, type IIssues } from "./issues.interface";

const createIssuesIntoDB = async (payload: IIssues, reporter_id: number) => {
  const { title, description, type, status } = payload;

  if (type && !issuesType.includes(type)) {
    throw new Error(`Invalid issue type`);
  }

  if (status && !issuesStatus.includes(status)) {
    throw new Error(`Invalid issue status`);
  }

  const result = await pool.query(
    `INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

export const issuesService = {
  createIssuesIntoDB,
};
