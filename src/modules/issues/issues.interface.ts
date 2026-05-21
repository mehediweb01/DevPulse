export const issuesType = ["bug", "feature_request"] as const;
export const issuesStatus = ["open", "in_progress", "resolved"] as const;

export type TIssuesType = (typeof issuesType)[number];
export type TIssuesStatus = (typeof issuesStatus)[number];

export interface IIssues {
  title: string;
  description: string;
  type: TIssuesType;
  status: TIssuesStatus;
}
