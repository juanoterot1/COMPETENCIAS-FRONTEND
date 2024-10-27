export interface EvaluationAnswer {
    id: number;
    id_evaluation: number; // Referencia a una evaluación
    id_question: number; // Referencia a una pregunta
    answer: string;
  }
  