import axios from "axios";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.status !== 200) {
    throw new Error("File upload failed");
  }

  return response.data;
}
