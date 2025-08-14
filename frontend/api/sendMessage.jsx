import axios from "axios";

const API_URL = "https://ai-blueye-production.up.railway.app/ask";

export const sendMessage = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data.response;
  } catch (error) {
    console.error("AI Request Error:", error.response?.data || error.message);
    if (!error.response) {
      throw new Error("NO_CONNECTION");
    }
    throw new Error(error.response?.data?.message || "SERVER_ERROR");  }
};
