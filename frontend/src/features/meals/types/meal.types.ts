export type MealPrices ={
    individual?: number;
    smallPot?: number;
    largePot?: number; 
};

export type Meal = {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    prices: MealPrices;
    isDaily: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateMealInput = {
    name: string;
    description: string;
    imageUrl?: string;
    prices: MealPrices;
    isDaily?: boolean;
    isActive?: boolean;
};

export type UpdateMealInput = Partial<CreateMealInput>;
