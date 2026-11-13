/**
 * Starts a browser download of `text` as a file named `fileName`. Uses
 * `Blob`, an object URL and a temporary anchor; call it only in event
 * handlers, never during render.
 */
export const downloadText = (
  text: string,
  fileName: string,
  mimeType: string
): void => {
  const url = URL.createObjectURL(new Blob([text], { type: mimeType }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking in the same task can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
