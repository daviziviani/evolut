import { WorkoutPlan, Exercise } from '../types';

// Simulated API for workout generation
export const generateWorkoutPlan = async (trainingDays: number, experience: string = 'beginner'): Promise<WorkoutPlan[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const exerciseDatabase = {
    chest: [
      { name: 'Supino Reto', restTime: 90 },
      { name: 'Supino Inclinado', restTime: 90 },
      { name: 'Crucifixo', restTime: 60 },
      { name: 'Flexão de Braço', restTime: 45 }
    ],
    back: [
      { name: 'Puxada Frontal', restTime: 90 },
      { name: 'Remada Curvada', restTime: 90 },
      { name: 'Pullover', restTime: 60 },
      { name: 'Remada Unilateral', restTime: 60 }
    ],
    shoulders: [
      { name: 'Desenvolvimento', restTime: 90 },
      { name: 'Elevação Lateral', restTime: 45 },
      { name: 'Elevação Frontal', restTime: 45 },
      { name: 'Encolhimento', restTime: 60 }
    ],
    arms: [
      { name: 'Rosca Direta', restTime: 60 },
      { name: 'Tríceps Pulley', restTime: 60 },
      { name: 'Rosca Martelo', restTime: 45 },
      { name: 'Tríceps Testa', restTime: 60 }
    ],
    legs: [
      { name: 'Agachamento', restTime: 120 },
      { name: 'Leg Press', restTime: 90 },
      { name: 'Extensão', restTime: 60 },
      { name: 'Flexão', restTime: 60 },
      { name: 'Panturrilha', restTime: 45 }
    ]
  };

  const createExercise = (name: string, muscle: string, restTime: number): Exercise => ({
    id: Math.random().toString(36).substr(2, 9),
    name,
    muscle,
    restTime,
    sets: [
      { reps: 12, weight: getStartingWeight(name), completed: false },
      { reps: 12, weight: getStartingWeight(name), completed: false },
      { reps: 12, weight: getStartingWeight(name), completed: false }
    ]
  });

  const getStartingWeight = (exerciseName: string): number => {
    const weights: { [key: string]: number } = {
      'Supino Reto': 40,
      'Supino Inclinado': 35,
      'Crucifixo': 15,
      'Flexão de Braço': 0,
      'Puxada Frontal': 45,
      'Remada Curvada': 40,
      'Pullover': 20,
      'Remada Unilateral': 25,
      'Desenvolvimento': 30,
      'Elevação Lateral': 8,
      'Elevação Frontal': 8,
      'Encolhimento': 30,
      'Rosca Direta': 15,
      'Tríceps Pulley': 25,
      'Rosca Martelo': 12,
      'Tríceps Testa': 20,
      'Agachamento': 50,
      'Leg Press': 80,
      'Extensão': 40,
      'Flexão': 35,
      'Panturrilha': 60
    };
    return weights[exerciseName] || 20;
  };

  if (trainingDays === 3) {
    return [
      {
        id: 'workout-a',
        name: 'Treino A - Peito, Ombro e Tríceps',
        targetMuscles: ['Peito', 'Ombro', 'Tríceps'],
        exercises: [
          createExercise('Supino Reto', 'Peito', 90),
          createExercise('Supino Inclinado', 'Peito', 90),
          createExercise('Desenvolvimento', 'Ombro', 90),
          createExercise('Elevação Lateral', 'Ombro', 45),
          createExercise('Tríceps Pulley', 'Tríceps', 60)
        ]
      },
      {
        id: 'workout-b',
        name: 'Treino B - Costas e Bíceps',
        targetMuscles: ['Costas', 'Bíceps'],
        exercises: [
          createExercise('Puxada Frontal', 'Costas', 90),
          createExercise('Remada Curvada', 'Costas', 90),
          createExercise('Pullover', 'Costas', 60),
          createExercise('Rosca Direta', 'Bíceps', 60),
          createExercise('Rosca Martelo', 'Bíceps', 45)
        ]
      },
      {
        id: 'workout-c',
        name: 'Treino C - Pernas',
        targetMuscles: ['Pernas'],
        exercises: [
          createExercise('Agachamento', 'Pernas', 120),
          createExercise('Leg Press', 'Pernas', 90),
          createExercise('Extensão', 'Pernas', 60),
          createExercise('Flexão', 'Pernas', 60),
          createExercise('Panturrilha', 'Pernas', 45)
        ]
      }
    ];
  }

  // For other training days, return a simplified version
  return [
    {
      id: 'full-body',
      name: 'Treino Full Body',
      targetMuscles: ['Corpo Todo'],
      exercises: [
        createExercise('Supino Reto', 'Peito', 90),
        createExercise('Puxada Frontal', 'Costas', 90),
        createExercise('Agachamento', 'Pernas', 120),
        createExercise('Desenvolvimento', 'Ombro', 90)
      ]
    }
  ];
};