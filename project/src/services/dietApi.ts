import { FoodItem, MealPlan } from '../types';

// Simulated food database
const foodDatabase: FoodItem[] = [
  // Proteins
  { id: '1', name: 'Peito de Frango (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { id: '2', name: 'Ovo Inteiro (1 unidade)', calories: 70, protein: 6, carbs: 0.6, fat: 5, serving: '1 ovo' },
  { id: '3', name: 'Whey Protein (1 scoop)', calories: 120, protein: 25, carbs: 3, fat: 1, serving: '30g' },
  { id: '4', name: 'Salmão (100g)', calories: 208, protein: 25, carbs: 0, fat: 12, serving: '100g' },
  { id: '5', name: 'Carne Vermelha Magra (100g)', calories: 250, protein: 26, carbs: 0, fat: 15, serving: '100g' },
  
  // Carbohydrates
  { id: '6', name: 'Arroz Branco (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g' },
  { id: '7', name: 'Batata Doce (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: '100g' },
  { id: '8', name: 'Aveia (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, serving: '100g' },
  { id: '9', name: 'Banana (1 unidade)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 banana' },
  { id: '10', name: 'Pão Integral (2 fatias)', calories: 160, protein: 6, carbs: 30, fat: 2, serving: '2 fatias' },
  
  // Fats
  { id: '11', name: 'Azeite (1 colher)', calories: 120, protein: 0, carbs: 0, fat: 14, serving: '1 colher' },
  { id: '12', name: 'Castanha do Pará (30g)', calories: 200, protein: 4, carbs: 3, fat: 20, serving: '30g' },
  { id: '13', name: 'Abacate (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '100g' },
  { id: '14', name: 'Amendoim (30g)', calories: 170, protein: 7, carbs: 5, fat: 14, serving: '30g' },
  
  // Vegetables
  { id: '15', name: 'Brócolis (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '100g' },
  { id: '16', name: 'Espinafre (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g' },
  { id: '17', name: 'Tomate (100g)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '100g' }
];

export const searchFoods = async (query: string): Promise<FoodItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) return foodDatabase;
  
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const generateMealPlan = async (
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number
): Promise<MealPlan[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const meals: MealPlan[] = [];

  // Breakfast
  const breakfast: FoodItem[] = [
    foodDatabase.find(f => f.name.includes('Aveia'))!,
    foodDatabase.find(f => f.name.includes('Banana'))!,
    foodDatabase.find(f => f.name.includes('Whey'))!
  ];

  // Lunch
  const lunch: FoodItem[] = [
    foodDatabase.find(f => f.name.includes('Peito de Frango'))!,
    foodDatabase.find(f => f.name.includes('Arroz'))!,
    foodDatabase.find(f => f.name.includes('Brócolis'))!,
    foodDatabase.find(f => f.name.includes('Azeite'))!
  ];

  // Snack
  const snack: FoodItem[] = [
    foodDatabase.find(f => f.name.includes('Castanha'))!,
    foodDatabase.find(f => f.name.includes('Banana'))!
  ];

  // Dinner
  const dinner: FoodItem[] = [
    foodDatabase.find(f => f.name.includes('Salmão'))!,
    foodDatabase.find(f => f.name.includes('Batata Doce'))!,
    foodDatabase.find(f => f.name.includes('Espinafre'))!
  ];

  const calculateMealTotals = (foods: FoodItem[]) => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  meals.push({
    id: 'breakfast',
    name: 'Café da Manhã',
    foods: breakfast,
    ...calculateMealTotals(breakfast)
  });

  meals.push({
    id: 'lunch',
    name: 'Almoço',
    foods: lunch,
    ...calculateMealTotals(lunch)
  });

  meals.push({
    id: 'snack',
    name: 'Lanche',
    foods: snack,
    ...calculateMealTotals(snack)
  });

  meals.push({
    id: 'dinner',
    name: 'Jantar',
    foods: dinner,
    ...calculateMealTotals(dinner)
  });

  return meals;
};