
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeMeetingContent = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Hãy tóm tắt ngắn gọn nội dung cuộc họp sau đây trong khoảng 2 câu tiếng Việt: "${content}"`,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });
    // Fix: Access .text property directly instead of potentially missing properties
    return response.text || "Không có tóm tắt.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi tóm tắt AI.";
  }
};
