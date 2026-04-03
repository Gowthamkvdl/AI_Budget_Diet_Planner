// app.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import historyRoutes from "./routes/history.js";
import authRoutes from "./routes/auth.js";
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);

// Check API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in .env");
}

// Gemini init
const ai = new GoogleGenAI({ apiKey });

// Schema (KEEP THIS — very important)
const mealPlanSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            day: { type: Type.INTEGER },
            meals: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        meal_type: { type: Type.STRING },
                        dish_name: { type: Type.STRING },
                        recipe_summary: { type: Type.STRING },
                        calories_approx: { type: Type.INTEGER },
                        budget_cost_approx: { type: Type.NUMBER }
                    },
                    required: [
                        'meal_type',
                        'dish_name',
                        'recipe_summary',
                        'calories_approx',
                        'budget_cost_approx'
                    ]
                }
            },
            daily_total_cost_approx: { type: Type.NUMBER }
        },
        required: ['day', 'meals', 'daily_total_cost_approx']
    }
};

// Prompt
const createPlanPrompt = (c) => {
    return `
Return ONLY valid JSON.

7-day Indian diet plan.

Constraints:
Diet: ${c.dietType}
Calories: ${c.calorieTarget}
Budget: ${c.dailyBudget}
Allergies: ${c.allergies}
Cuisine: ${c.cuisinePreference}
`;
};

// API
app.post('/api/generate-plan', async (req, res) => {
    try {
        const c = req.body;

        if (!c.calorieTarget || !c.dailyBudget) {
            return res.status(400).json({
                error: "calorieTarget and dailyBudget required"
            });
        }

        const prompt = createPlanPrompt(c);

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mealPlanSchema
            }
        });

        const text = result.text?.trim();

        if (!text) {
            return res.status(500).json({ error: "Empty AI response" });
        }

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.log("RAW:", text);
            return res.status(500).json({
                error: "Invalid JSON from AI",
                raw: text
            });
        }

        // 🔥 safety cleanup (prevents ₹NaN)
        data = data.map(day => ({
            day: day.day || 1,
            meals: (day.meals || []).map(m => ({
                meal_type: m.meal_type || "Meal",
                dish_name: m.dish_name || "Unknown",
                recipe_summary: m.recipe_summary || "",
                calories_approx: Number(m.calories_approx) || 0,
                budget_cost_approx: Number(m.budget_cost_approx) || 0
            })),
            daily_total_cost_approx: Number(day.daily_total_cost_approx) || 0
        }));

        res.json(data);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({
            error: "Plan generation failed",
            details: err.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});