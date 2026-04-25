
import type { itemType } from "./tree";

export interface GithubRepo {
  full_name: string;
  id: number;
  name: string;
}

export interface GithubBranch {
  name: string;
}

export interface GithubContent {
  name: string;
  path: string;
  type: itemType.DIR | itemType.FILE;
}

export interface CommitResponse {
  content: {
    html_url: string;
    sha: string;
  };
}
