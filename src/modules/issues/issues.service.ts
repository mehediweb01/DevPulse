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

const updateIssueFromDB = async (
  payload: Omit<IIssues, "status">,
  id: number,
  userId: number,
) => {
  const { title, description, type } = payload;

  const issue = await pool.query(
    `
        SELECT reporter_id, status FROM issues WHERE id=$1    
    `,
    [id],
  );

  const reporter = await pool.query(
    `
        SELECT role FROM users WHERE id=$1
    `,
    [userId],
  );

  if (
    userId === (issue.rows[0].reporter_id && issue.rows[0].status === "open") ||
    reporter.rows[0].role === "maintainer"
  ) {
    const issue = await pool.query(
      `UPDATE issues SET title=$1, description=$2, type=$3 WHERE id=$4 RETURNING *
      `,
      [title, description, type, id],
    );

    return issue.rows[0];
  } else {
    throw new Error(`You are not authorized to modify this issue`);
  }
};

export const issuesService = {
  createIssuesIntoDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
};
