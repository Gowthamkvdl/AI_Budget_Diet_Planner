import prisma from '../lib/prisma.js';

export const savePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ error: 'Plan is required' });
    }

    const totalCost = plan.reduce(
      (sum, day) => sum + (day.daily_total_cost_approx || 0),
      0
    );

    const saved = await prisma.DietPlan.create({
      data: {
        userId,
        meals: plan,
        totalCost
      }
    });

    res.json({ message: 'Plan saved', saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await prisma.DietPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};