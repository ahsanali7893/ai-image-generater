import axios from "axios";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co";
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

export const queryHuggingFace = async (model: string, inputs: any) => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API_URL}/models/openai-community/gpt2`,
      { inputs },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error querying Hugging Face API:", error);
    throw error;
  }
};
