import { generateText } from "ai";

export async function analyzeReport(fileContent, reportType) {
  try {
    const prompt = `You are a medical report analyzer. Analyze the following medical report and provide:
1. Summary of findings in simple English
2. Summary in Roman Urdu (Hindustani written in Latin script)
3. Abnormal values highlighted
4. 3-5 questions to ask the doctor
5. Foods to avoid
6. Recommended foods
7. Home remedies (if applicable)
8. Important disclaimer

Report Type: ${reportType}
Report Content: ${fileContent}

Format your response as JSON with keys: summary_en, summary_urdu, abnormal_values, doctor_questions, foods_to_avoid, recommended_foods, home_remedies, disclaimer`;

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    });

    try {
      return JSON.parse(text);
    } catch {
      return {
        summary_en: text,
        summary_urdu: "AI analysis complete",
        abnormal_values: [],
        doctor_questions: [],
        foods_to_avoid: [],
        recommended_foods: [],
        home_remedies: [],
        disclaimer: "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.",
      };
    }
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw error;
  }
}
