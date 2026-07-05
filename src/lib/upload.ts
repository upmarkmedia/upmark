/**
 * Uploads a file to the Cloudflare R2 bucket via the Next.js API route.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export async function uploadToR2(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to upload file");
  }

  const data = await response.json();
  return data.url;
}
