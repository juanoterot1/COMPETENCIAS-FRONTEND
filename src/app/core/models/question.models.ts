// models/question.model.ts
import { Evaluation } from './evaluation.model'; 

export interface Question {
  id: number;
  name: string;
  value: number;
  id_evaluation: number;
  evaluation?: Evaluation; 
}
