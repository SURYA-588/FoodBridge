
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  async generateImpactInsight(mealsServed: number, foodWasteSaved: number): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, inspiring impact summary for a food donation platform. 
                   Data: ${mealsServed} meals served today, reducing food waste by approximately ${foodWasteSaved} kg. 
                   Tone: Encouraging, professional, and community-focused. Keep it under 60 words.`
      });
      return response.text || `Together, we've served ${mealsServed} meals and saved ${foodWasteSaved}kg of food.`;
    } catch (error) {
      console.error('Gemini error:', error);
      return `Together, we've served ${mealsServed} meals and saved ${foodWasteSaved}kg of food. Every plate counts!`;
    }
  },

  async suggestCollectionPriority(posts: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a logistics advisor for an NGO. Given these food availability posts: ${posts}. 
                   Recommend which batch should be collected first based on expiry and quantity. 
                   Respond in a concise, bullet-pointed list.`
      });
      return response.text || "Focus on batches with the earliest expiry times and highest quantity.";
    } catch (error) {
      console.error('Gemini priority error:', error);
      return "Focus on batches with the earliest expiry times and highest quantity.";
    }
  }
};
