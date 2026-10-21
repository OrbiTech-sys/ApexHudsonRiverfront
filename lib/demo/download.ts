export interface GeneratedFile {
  filename: string;
  content: string;
}

/** Saves text as a file in the browser. Call from a click handler. */
export function downloadTextFile(
  { filename, content }: GeneratedFile,
  type = "text/plain",
) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
