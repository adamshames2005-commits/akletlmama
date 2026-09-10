import "./HomePage.css";
import { useState } from "react";

const meals = [
  {
    name: "Mloukhieh",
    description: "Traditional homemade mloukhieh served fresh.",
    prices: { individual: 8, smallPot: 22, largePot: 38 },
    isDaily: true,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554",
  },
  {
    name: "Kebbeh",
    description: "Homemade kebbeh with authentic Lebanese flavor.",
    prices: { individual: 9, smallPot: 25, largePot: 42 },
    isDaily: true,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  },
  {
    name: "Fasoulia",
    description: "Slow-cooked beans with rice and homemade spices.",
    prices: { smallPot: 20, largePot: 35 },
    isDaily: false,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd",
  },
];

type MealSize = "individual" | "smallPot" | "largePot";

const sizeLabels: Record<MealSize, string> = {
  individual: "Individual",
  smallPot: "Small pot",
  largePot: "Large pot",
};

function HomeMealCard({ meal }: Readonly<{ meal: (typeof meals)[number] }>) {
  const availableSizes = (Object.keys(meal.prices) as MealSize[]).filter(
    (size) => meal.prices[size] !== undefined
  );
  const [selectedSize, setSelectedSize] = useState<MealSize>(availableSizes[0]);

  return (
    <article className="meal-card">
      <div className="meal-card-image">
        <img src={meal.image} alt={meal.name} />
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
          <button type="button">Add to order</button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [showDailyOnly, setShowDailyOnly] = useState(true);
  const visibleMeals = showDailyOnly ? meals.filter((meal) => meal.isDaily) : meals;

  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">Homemade. Fresh. Simple.</span>

          <h1>
            A homemade lunch,
            <br />
            even when you're away from home.
          </h1>

          <p>
            Fresh meals prepared daily with the taste and comfort of
            home cooking.
          </p>

          <button className="hero-button" onClick={() => setShowDailyOnly(true)}>
            Explore Today's Menu
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-label">Fresh today</span>
            <h2>Today's Menu</h2>
          </div>

          <div className="menu-switcher">
            <button className={showDailyOnly ? "selected" : ""} type="button" onClick={() => setShowDailyOnly(true)}>
              Today's menu
            </button>
            <button className={!showDailyOnly ? "selected" : ""} type="button" onClick={() => setShowDailyOnly(false)}>
              All meals
            </button>
          </div>
        </div>

        <div className="meal-grid">
          {visibleMeals.map((meal) => <HomeMealCard key={meal.name} meal={meal} />)}
        </div>
      </section>

      <section className="why-section">
        <div>
          <span>🏠</span>
          <h3>Homemade</h3>
          <p>Meals that taste like home.</p>
        </div>

        <div>
          <span>🍲</span>
          <h3>Fresh Daily</h3>
          <p>Prepared fresh every day.</p>
        </div>

        <div>
          <span>🚚</span>
          <h3>Delivered</h3>
          <p>Lunch delivered to your door.</p>
        </div>
      </section>

      <section className="subscription-banner">
        <div>
          <span>Monthly plan</span>

          <h2>Your lunches, planned for the month.</h2>

          <p>
            Select 20 lunches ahead of time and make your month easier.
          </p>
        </div>

        <button>Explore Subscription</button>
      </section>

    </div>
  );
}