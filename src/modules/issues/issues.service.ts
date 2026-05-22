import { pool } from "../../db";
import {
  issuesStatus,
  issuesType,
  sortValue,
  type IIssues,
  type TIssuesStatus,
  type TIssuesType,
  type TSort,
} from "./issues.interface";

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

const getAllIssuesFromDB = async (
  sort: TSort,
  type: TIssuesType,
  status: TIssuesStatus,
) => {
  const issuesData = await pool.query(`
    SELECT * FROM issues
  `);

  if (
    (type && !issuesType.includes(type)) ||
    (status && !issuesStatus.includes(status)) ||
    (sort && !sortValue.includes(sort))
  ) {
    throw new Error(`Invalid filter criteria provided!`);
  }

  if (issuesData.rows.length === 0) {
    throw new Error(`No issues available!`);
  }

  let issues = issuesData.rows;

  const reporter_ids = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporter_ids],
  );

  const reporters = reporterResult.rows;

  const reporterMap = new Map(
    reporters.map((reporter) => [reporter.id, reporter]),
  );

  if (type) {
    issues = issues.filter((issue) => issue.type === type);
  }

  if (status) {
    issues = issues.filter((issue) => issue.status === status);
  }

  if (sort === "oldest") {
    issues = issues.sort(
      (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
    );
  } else {
    issues = issues.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
    );
  }

  if (issues.length === 0) {
    throw new Error(`Issues not found!`);
  }

  const formattedIssue = issues.map((issue) => {
    const { id, title, description, type, status, created_at, updated_at } =
      issue;

    return {
      id,
      title,
      description,
      type,
      status,
      reporter: reporterMap.get(issue.reporter_id),
      created_at,
      updated_at,
    };
  });

  return formattedIssue;
};

const getSingleIssueFromDB = async (id: number) => {
  const data = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  if (data.rows.length === 0) {
    throw new Error(`Issue not found!`);
  }

  const reporter_id = data.rows[0].reporter_id;

  const reporter = await pool.query(
    `SELECT id,name,role FROM users WHERE id=$1`,
    [reporter_id],
  );

  const result = data.rows.map((issue) => {
    const { id, title, description, type, status, created_at, updated_at } =
      issue;

    return {
      id,
      title,
      description,
      type,
      status,
      reporter: reporter.rows[0],
      created_at,
      updated_at,
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

  if (issue.rows.length === 0) {
    throw new Error(`Issue not found!`);
  }

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

const deleteIssueFromDB = async (id: number) => {
  const issue = await pool.query(
    `
        SELECT id FROM issues WHERE id=$1    
    `,
    [id],
  );

  if (id && issue.rows.length === 0) {
    throw new Error(`Issue not found!`);
  }

  const result = await pool.query(
    `
        DELETE FROM issues WHERE id=$1    
    `,
    [id],
  );

  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
};
