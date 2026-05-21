export const issuesType = ["bug", "feature_request"] as const;
export const issuesStatus = ["open", "in_progress", "resolved"] as const;

type TIssuesType = (typeof issuesType)[number];
type TIssuesStatus = (typeof issuesStatus)[number];

export interface IIssues {
  title: string;
  description: string;
  type: TIssuesType;
  status: TIssuesStatus;
}
