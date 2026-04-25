export interface EditorOption {
  currentValue: unknown;
  options?: string[];
  title: string;
  type: "boolean" | "string" | "number" | "select" | "text";
}
