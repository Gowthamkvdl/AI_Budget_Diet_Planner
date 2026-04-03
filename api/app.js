// app.js (Using ES Module syntax)  

// Setup Environment and Dependencies
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import historyRoutes from "./routes/history.js"  
import authRoutes from "./routes/auth.js"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);

// Check for API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}


// --- PROMPT ASSEMBLY FUNCTION ---
const createPlanPrompt = (constraints) => {
    return `
    You are an expert Smart Diet Planner... (etc.)
    
    USER CONSTRAINTS (CRITICAL):
    1.  DIET TYPE: ${constraints.dietType || 'Balanced'}
    2.  CALORIE GOAL: ${constraints.calorieTarget || 2000} calories per day.
    3.  ALLERGIES/AVOIDANCES: ${constraints.allergies || 'None'}. 
    4.  CUISINE FOCUS: ${constraints.cuisinePreference || 'Generic Indian'}. 
    5.  MAX DAILY BUDGET (Hard Constraint): ${constraints.dailyBudget || 500} INR. 
    
    INSTRUCTIONS FOR COST:
    * Use current, common grocery prices in a major Indian metro city (INR)...
    
    RETURN the result STRICTLY as a JSON array.
    `;
};


// --- API ROUTE ---
app.post('/api/generate-plan', async (req, res) => {
    try {
        const constraints = req.body; 

        if (!constraints.calorieTarget || !constraints.dailyBudget) {
            return res.status(400).json({ 
                error: "Missing required constraints: calorieTarget and dailyBudget." 
            });
        }

        const prompt = createPlanPrompt(constraints);

        console.log(`Generating plan for: ${constraints.cuisinePreference} at ${constraints.dailyBudget} INR/day...`);

        // ✅ DIRECT GEMINI API CALL (NO SDK)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        // Extract text safely
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Invalid response from Gemini API");
        }

        // Clean JSON (Gemini sometimes wraps with ```json)
        const cleanText = text.replace(/```json|```/g, '').trim();

        const planObject = JSON.parse(cleanText);

        res.json(planObject);

    } catch (error) {
        console.error('Error generating plan:', error);

        res.status(500).json({ 
            error: 'Failed to generate meal plan from AI.', 
            details: error.message 
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
});