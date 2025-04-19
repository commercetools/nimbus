import axios from "axios";
import { type FileUploadResponse } from "./../../scripts/vite-plugins/vite-plugin-file-uploader";
/**
 * Uploads an image file to the server.
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<any>} - The response data from the server.
 * @throws Will throw an error if the upload fails.
 */
export async function uploadImage(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      throw new Error("File upload failed");
    }

    return response.data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error uploading file:", error);
    throw error;
  }
}
