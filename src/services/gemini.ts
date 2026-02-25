import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, TravelPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTravelPlan(profile: UserProfile, location?: string): Promise<TravelPlan> {
  const prompt = `
    Generate a travel plan in ITALIAN for a user with the following profile:
    - Mood: ${profile.mood}
    - Energy Level: ${profile.energy}%
    - Vibe Preference: ${profile.vibe}
    - Interests: ${profile.interests.join(", ")}
    - Destination: ${profile.destination || "Sconosciuta"}
    - Duration: ${profile.duration || 3} giorni
    - Budget: ${profile.budget || "medio"}

    The plan should include:
    1. A creative "Persona Name" in Italian for the traveler.
    2. A short summary in Italian of why this plan fits their current mood, energy, and budget.
    3. A list of days (up to the specified duration).
    4. For each day, provide a detailed hourly schedule (programma orario).
    5. For some time slots, provide "alternatives" (isAlternative: true) so the user can choose between different places.
    6. If the vibe preference includes "nightlife" or "vita notturna", ensure to include specific entertainment venues like discos, pubs, clubs, and late-night spots.
    7. For each tourist location, include:
       - Title (be descriptive, e.g., "Colosseo al Tramonto" instead of just "Colosseo")
       - Description (highlight why it's typical of the city or why it's a great spot for fun/nightlife)
       - Opening Hours (Orari di apertura)
       - Price/Entrance Fee (Prezzo/Costo d'ingresso)
       - Location
    8. Include specific places to eat (ristoranti/locali) with a short "history" or "story" of the dish.
    
    IMPORTANT: All text content MUST be in Italian. The itinerary should be realistic for the destination provided and focus on typical, iconic city locations or the best entertainment spots if requested.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personaName: { type: Type.STRING },
          summary: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      time: { type: Type.STRING },
                      location: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["activity", "food", "rest"] },
                      priceLevel: { type: Type.NUMBER },
                      history: { type: Type.STRING },
                      hours: { type: Type.STRING },
                      priceInfo: { type: Type.STRING },
                      isAlternative: { type: Type.BOOLEAN }
                    },
                    required: ["id", "title", "description", "time", "location", "type", "priceLevel"]
                  }
                }
              },
              required: ["day", "items"]
            }
          }
        },
        required: ["personaName", "summary", "days"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
