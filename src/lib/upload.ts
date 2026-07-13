import { auth } from "./firebase";

/**
 * Uploads a file to Cloudflare R2 via a presigned URL to bypass server payload limits (413 errors).
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export async function uploadToR2(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Must be logged in to upload files.");
  }

  const token = await user.getIdToken();

  // 1. Request a presigned URL from our API
  const presignResponse = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
    }),
  });

  if (!presignResponse.ok) {
    const errorData = await presignResponse.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to request upload URL");
  }

  const { uploadUrl, finalUrl } = await presignResponse.json();

  // 2. Upload the file directly to R2 using the presigned URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file directly to storage");
  }

  // 3. Return the final public URL
  return finalUrl;
}
