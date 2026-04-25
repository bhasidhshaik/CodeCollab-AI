import type { TreeDataItem } from "@/components/tree";

export enum itemType {
  REPO = "repo",
  BRANCH = "branch",
  DIR = "dir",
  FILE = "file",
}

// Extended interface for GitHub-specific functionality
export interface ExtendedTreeDataItem extends TreeDataItem {
  children?: ExtendedTreeDataItem[]; // Override children type
  full_name?: string;
  path?: string;
  type?: itemType;
}
