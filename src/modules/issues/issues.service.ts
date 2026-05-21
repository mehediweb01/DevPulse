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

const getSingleIssueFromDB = async (id: number) => {
  const data = await pool.query(
    `
        SELECT * FROM issues WHERE id=$1    
    `,
    [id],
  );

  if (data.rows.length === 0) {
    throw new Error(`Issue not found!`);
  }

  const reporter_id = data.rows[0].reporter_id;

  const reporter = await pool.query(
    `
    SELECT id,name,role FROM users WHERE id=$1    
    `,
    [reporter_id],
  );

  const result = data.rows.map((issue) => {
    delete issue.reporter_id;
    return {
      ...issue,
      reporter: reporter.rows[0],
    };
  });

  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getSingleIssueFromDB,
};
