import { useEffect, useState } from "react";

import { getMeals } from "../../meals/api/mealApi";
import type { Meal } from "../../meals/types/meal.types";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMeals()
      .then(setMeals)
      .catch(() => setError("Could not load meals"));
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Preview the menu exactly as customers see it.</p>
        </div>

        {error && <p className="admin-feedback">{error}</p>}

        <div className="admin-preview-grid">
          {meals
            .filter((meal) => meal.isActive)
            .map((meal) => (
              <article
                className="admin-preview-card"
                key={meal._id}
              >
                <div className="admin-preview-image">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                    />
                  ) : (
                    <span>🍲</span>
                  )}
                </div>

                <div className="admin-preview-content">
                  <div className="admin-preview-title">
                    <h2>{meal.name}</h2>

                    {meal.isDaily && (
                      <span>Today's menu</span>
                    )}
                  </div>

                  <p>{meal.description}</p>

                  <div className="admin-preview-prices">
                    {meal.isDaily &&
                      meal.prices.individual !== undefined && (
                        <span>
                          Individual ${meal.prices.individual}
                        </span>
                      )}

                    {meal.prices.smallPot !== undefined && (
                      <span>
                        Small pot ${meal.prices.smallPot}
                      </span>
                    )}

                    {meal.prices.largePot !== undefined && (
                      <span>
                        Large pot ${meal.prices.largePot}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}