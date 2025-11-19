import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function generateText(
  prompt: string,
  retries = 5
): Promise<string> {
  try {
    console.log("🔑 GEMINI_KEY:", process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (err: any) {
    console.error("[Gemini Error]", err?.message);

    // Nếu hết số lần retry → throw error
    if (retries <= 0) {
      console.error("❌ Out of retries → throw");
      throw err;
    }

    // Chỉ retry nếu lỗi 50X hoặc 429
    const isRetryable =
      err?.status === 503 ||
      err?.status === 500 ||
      err?.status === 429 ||
      err?.message?.includes("overloaded") ||
      err?.message?.includes("try again");

    if (!isRetryable) throw err;

    const delay = (6 - retries) * 2000; // 2s → 4s → 6s → 8s → 10s
    console.log(`⏳ Gemini overloaded. Retry in ${delay / 1000}s...`);

    await new Promise((res) => setTimeout(res, delay));

    return generateText(prompt, retries - 1);
  }
}
