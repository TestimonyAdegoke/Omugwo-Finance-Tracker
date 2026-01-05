
import { GoogleGenAI } from "@google/genai";
import { Transaction, Category } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[], categories: Category[]) => {
  const transactionSummary = transactions.map(t => ({
    amount: t.amount,
    type: t.type,
    category: categories.find(c => c.id === t.categoryId)?.name,
    date: t.date
  }));

  const prompt = `
    Analyze the following financial data for Omugwo Academy and provide 3-4 bullet points of actionable advice or observations. 
    Data: ${JSON.stringify(transactionSummary)}
    
    Focus on:
    - Revenue trends
    - Potential areas for cost reduction
    - Balance of income vs expense
    - Financial health summary
    
    Keep it professional, encouraging, and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time. Please check your data or try again later.";
  }
};
