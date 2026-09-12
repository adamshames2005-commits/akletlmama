import {useEffect, useState} from "react";
import {getMeals,updateMeal,deleteMeal} from "../api/mealApi";
import type {Meal} from "../types/meal.types";
import MealForm from "../components/MealForm";
import "./AdminMealsPage.css";


const AdminMealsPage = () => {
    
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //for update 
    const [editingMealId, setEditingMealId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editIndividualPrice, setEditIndividualPrice] = useState("");
    const [editSmallPotPrice, setEditSmallPotPrice] = useState("");
    const [editLargePotPrice, setEditLargePotPrice] = useState("");

    const handleDelete = async (id: string) => {
        await deleteMeal(id);
        setMeals((currentMeals) =>
            currentMeals.filter((meal) => meal._id !== id)
        );
    }

    const handleToggleDaily = async (meal: Meal) => {
      const updatedMeal = await updateMeal(meal._id, {
        isDaily: !meal.isDaily,
      });

      setMeals((currentMeals) =>
        currentMeals.map((currentMeal) =>
          currentMeal._id === meal._id ? updatedMeal : currentMeal
        )
      );
    };

    const handleEdit = (meal: Meal) => {
        setEditingMealId(meal._id);
        setEditName(meal.name);
        setEditDescription(meal.description);
        setEditImageUrl(meal.imageUrl ?? "");

        setEditIndividualPrice(
            meal.prices.individual?.toString() ?? "");

        setEditSmallPotPrice(
            meal.prices.smallPot?.toString() ?? "");
        
        setEditLargePotPrice(
            meal.prices.largePot?.toString() ?? "");
       
    };

    const handleCancelEdit = () => {
        setEditingMealId(null);
    };

    const handleSaveEdit = async (id: string) => {
        const updatedMeal = await updateMeal(id, {
            name: editName,
            description: editDescription,
            imageUrl: editImageUrl || undefined,
            prices: {
                ...(editIndividualPrice !== "" && {
                    individual: Number(editIndividualPrice),
                }),
                ...(editSmallPotPrice !== "" && {
                    smallPot: Number(editSmallPotPrice),
                }),
                ...(editLargePotPrice !== "" && {
                    largePot: Number(editLargePotPrice),
                }),
            },
        });

        setMeals((currentMeals) =>
            currentMeals.map((meal) =>
                meal._id === id ? updatedMeal : meal
            )
        );
        setEditingMealId(null);
    };

    useEffect(() => {
        const loadMeals = async () => {
            try {
                const data = await getMeals();
                setMeals(data);
            } catch  {
                setError("Failed to fetch meals");
            } finally {
                setLoading(false);
            }
        };

        loadMeals();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleMealCreated = (newMeal: Meal) => {
  setMeals((currentMeals) => [...currentMeals, newMeal]);
};

    return (
        <div className="admin-page">
          <div className="admin-content">
            <div className="page-header">
              <div>
                <h1>Meals Management</h1>
                <p>Add, edit, and manage your meals</p>
              </div>
            </div>
          <div className="admin-card">
            <MealForm onMealCreated={handleMealCreated} />
          </div>

          <div className="admin-card">
            <div className="meals-header">
              <h2>Meals</h2>
            </div>
            <table className="meals-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Individual</th>
                        <th>Small Pot</th>
                        <th>Large Pot</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal) => {
                      const isEditing = editingMealId === meal._id;
                    //start of the function lal image wma aamlneha mtl tahet krmel
                    // there is a type script error le howe 2 ? fa hatayna 2 if statements 
                      let imageContent;

                      if (isEditing) {
                        imageContent = (
                          <input
                            className="edit-input"
                            value={editImageUrl}
                            onChange={(event) =>
                              setEditImageUrl(event.target.value)
                            }
                          />
                        );
                      } else if (meal.imageUrl) {
                        imageContent = (
                          <img
                            className="meal-image"
                            src={meal.imageUrl}
                            alt={meal.name}
                            width="70"
                            height="50"
                          />
                        );
                      } else {
                        imageContent = "No image";
                      }
                      //end of the function
                      return (
                        <tr key={meal._id}>
                          <td>
                            {isEditing ? (
                              <input
                                className="edit-input"
                                value={editName}
                                onChange={(event) =>
                                  setEditName(event.target.value)
                                }
                              />
                            ) : (
                              meal.name
                            )}
                          </td>
                        
                          <td>
                            {isEditing ? (
                              <input
                                className="edit-input"
                                value={editDescription}
                                onChange={(event) =>
                                  setEditDescription(event.target.value)
                                }
                              />
                            ) : (
                              meal.description
                            )}
                          </td>
                        <td>
                            {imageContent} 
                            
                        </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="edit-input"
                                type="number"
                                value={editIndividualPrice}
                                onChange={(event) =>
                                  setEditIndividualPrice(event.target.value)
                                }
                              />
                            ) : (
                              meal.prices.individual ?? "-"
                            )}
                          </td>
                        
                          <td>
                            {isEditing ? (
                              <input
                                className="edit-input"
                                type="number"
                                value={editSmallPotPrice}
                                onChange={(event) =>
                                  setEditSmallPotPrice(event.target.value)
                                }
                              />
                            ) : (
                              meal.prices.smallPot ?? "-"
                            )}
                          </td>
                        
                          <td>
                            {isEditing ? (
                              <input
                                className="edit-input"
                                type="number"
                                value={editLargePotPrice}
                                onChange={(event) =>
                                  setEditLargePotPrice(event.target.value)
                                }
                              />
                            ) : (
                              meal.prices.largePot ?? "-"
                            )}
                          </td>
                        
                          <td>{meal.isActive ? "Yes" : "No"}</td>
                        
                          <td>
                            {isEditing ? (
                              <>
                                <button
                                  className="btn btn-save"
                                  onClick={() => handleSaveEdit(meal._id)}
                                >
                                  Save
                                </button>
                            
                                <button 
                                className="btn btn-cancel"
                                onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                                <>
                              <button
                                className="btn btn-edit"
                                onClick={() => handleEdit(meal)}>
                                Edit
                              </button>
                              <button 
                                className="btn btn-delete"
                                onClick={() => handleDelete(meal._id)}>
                                Delete
                              </button>
                              <button
                                className={`btn ${meal.isDaily ? "btn-daily-active" : "btn-daily"}`}
                                onClick={() => handleToggleDaily(meal)}>
                                {meal.isDaily ? "Daily menu" : "Add to daily"}
                              </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

export default AdminMealsPage;