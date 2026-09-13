import { useEffect, useState } from "react";
import { getMeals } from "../../meals/api/mealApi";
import type { Meal } from "../../meals/types/meal.types";
import type { CustomerView, MenuFilter, OrderItem } from "../../../App";
import heroImage from "../../../assets/hero.png";
import "./HomePage.css";

type MealSize = "individual" | "smallPot" | "largePot";

const sizeLabels: Record<MealSize, string> = {
  individual: "Individual",
  smallPot: "Small pot",
  largePot: "Large pot",
};

type HomePageProps = Readonly<{
  menuFilter: MenuFilter;
  onMenuFilterChange: (filter: MenuFilter) => void;
  customerView: CustomerView;
  onCustomerViewChange: (view: CustomerView) => void;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  onAddToOrder: (item: Omit<OrderItem, "id">) => void;
}>;

function HomeMealCard({ meal, isAuthenticated, onRequireLogin, onAddToOrder }: Readonly<{
  meal: Meal;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  onAddToOrder: (item: Omit<OrderItem, "id">) => void;
}>) {
  const availableSizes = (Object.keys(meal.prices) as MealSize[]).filter(
    (size) => meal.prices[size] !== undefined && (meal.isDaily || size !== "individual")
  );
  const [selectedSize, setSelectedSize] = useState<MealSize>(availableSizes[0]);

  return (
    <article className="meal-card">
      <div className="meal-card-image">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} />
        ) : (
          <div className="meal-card-placeholder">🍲</div>
        )}
        <span className={meal.isDaily ? "meal-badge daily" : "meal-badge"}>
          {meal.isDaily ? "Today's menu" : "Available to order"}
        </span>
      </div>
      <div className="meal-card-content">
        <div className="meal-card-title-row">
          <h3>{meal.name}</h3>
          <span className="meal-card-price">${meal.prices[selectedSize]}</span>
        </div>
        <p>{meal.description}</p>
        <div className="meal-size-menu" aria-label={`${meal.name} serving size`}>
          {availableSizes.map((size) => (
            <button
              className={selectedSize === size ? "selected" : ""}
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
            >
              {sizeLabels[size]}
            </button>
          ))}
        </div>
        <div className="meal-card-bottom">
          <span>{meal.isDaily ? "Individual from the daily menu" : "Choose a pot size"}</span>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                onRequireLogin();
                return;
              }
              onAddToOrder({ meal, size: selectedSize, price: meal.prices[selectedSize] ?? 0 });
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage({
  menuFilter,
  onMenuFilterChange,
  customerView,
  onCustomerViewChange,
  isAuthenticated,
  onRequireLogin,
  onAddToOrder,
}: HomePageProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadMeals = async () => {
      try {
        setMeals(await getMeals());
      } catch {
        setLoadError("We could not load the meals right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadMeals();
  }, []);

  const visibleMeals = menuFilter === "daily"
    ? meals.filter((meal) => meal.isDaily && meal.isActive)
    : meals.filter((meal) => meal.isActive);

  if (customerView === "home") {
    return (
      <div className="home-page home-overview">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">AkletLmama / homemade food</span>
            <h1>Good food, made to feel like home.</h1>
            <p>AkletLmama brings fresh, comforting meals to your day. Choose a plate from today's kitchen or browse the full menu whenever you are ready.</p>
            <div className="hero-actions">
              <button className="hero-button" type="button" onClick={() => { onMenuFilterChange("daily"); onCustomerViewChange("menu"); }}>
                See today's menu
              </button>
              <button className="hero-link" type="button" onClick={() => { onMenuFilterChange("all"); onCustomerViewChange("menu"); }}>
                Browse all meals <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img src={heroImage} alt="AkletLmama meal delivery" />
            <div className="hero-note"><strong>Freshly prepared</strong><span>Comfort food for busy days</span></div>
          </div>
        </section>

        <section className="project-intro">
          <div>
            <span className="section-label">Why AkletLmama</span>
            <h2>A simpler way to eat well.</h2>
          </div>
          <p>We make everyday meals easier with a focused menu, generous portions, and food prepared with the warmth of a home kitchen.</p>
        </section>

        <section className="info-grid" aria-label="AkletLmama benefits">
          <article><span>01</span><h3>Made fresh</h3><p>Meals are prepared with care so lunch feels like something to look forward to.</p></article>
          <article><span>02</span><h3>Easy to choose</h3><p>Start with today's menu or take your time exploring every available meal.</p></article>
          <article><span>03</span><h3>Ready for your day</h3><p>Pick your serving size, add it to your order, and keep moving.</p></article>
        </section>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-label">{menuFilter === "daily" ? "Fresh from today's kitchen" : "The full selection"}</span>
            <h1>{menuFilter === "daily" ? "Today's Menu" : "All Meals"}</h1>
            <p className="menu-description">
              {menuFilter === "daily"
                ? "A short, fresh selection prepared for today. Choose a meal and make lunch the easiest part of your day."
                : "Explore every active meal in our kitchen, from individual plates to generous pot sizes for sharing."}
            </p>
          </div>
          <div className="menu-switcher">
            <button className={menuFilter === "daily" ? "selected" : ""} type="button" onClick={() => onMenuFilterChange("daily")}>
              Today's menu
            </button>
            <button className={menuFilter === "all" ? "selected" : ""} type="button" onClick={() => onMenuFilterChange("all")}>
              All meals
            </button>
          </div>
        </div>

        {isLoading && <p className="meals-status">Loading meals...</p>}
        {loadError && <p className="meals-status meals-error">{loadError}</p>}
        {!isLoading && !loadError && visibleMeals.length === 0 && (
          <p className="meals-status">No meals are available in this menu yet.</p>
        )}
        <div className="meal-grid">
          {visibleMeals.map((meal) => (
            <HomeMealCard
              key={meal._id}
              meal={meal}
              isAuthenticated={isAuthenticated}
              onRequireLogin={onRequireLogin}
              onAddToOrder={onAddToOrder}
            />
          ))}
        </div>
      </section>

      <section className="why-section">
        <div><span>🏠</span><h3>Homemade</h3><p>Meals that taste like home.</p></div>
        <div><span>🍲</span><h3>Fresh Daily</h3><p>Prepared fresh every day.</p></div>
        <div><span>🚚</span><h3>Delivered</h3><p>Lunch delivered to your door.</p></div>
      </section>

      <section className="subscription-banner">
        <div>
          <span>Monthly plan</span>
          <h2>Your lunches, planned for the month.</h2>
          <p>Select 20 lunches ahead of time and make your month easier.</p>
        </div>
        <button>Explore Subscription</button>
      </section>
    </div>
  );
}
