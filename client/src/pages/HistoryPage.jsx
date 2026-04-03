import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import MealCard from '../components/MealCard';

const HistoryPage = () => {
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/history');

        const historyList = data?.history || [];

        const item = historyList.find((h) => h.id === id);

        if (item) {
          setPlan(item.meals || []);
          setDate(item.createdAt);
        }

      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  // ✅ Loading
  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  // ✅ No data
  if (!Array.isArray(plan) || plan.length === 0) {
    return <p className="text-center mt-4">No plan found</p>;
  }

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-3 text-center">
        <h4>Saved Meal Plan</h4>
        {date && (
          <small className="text-muted">
            {new Date(date).toLocaleString()}
          </small>
        )}
      </div>

      {/* ✅ SINGLE COMPONENT RENDER */}
      <MealCard
        mealPlan={plan}
        constraints={{ dailyBudget: plan[0]?.daily_total_cost_approx || 300 }}
      />

    </div>
  );
};

export default HistoryPage;