import { Evaluation } from './evaluation.model';
import { Question } from './question.models';
import { User } from './user.model';

export interface Answer {
  id: number;
  answer_description: string;
  id_evaluation: number;
  evaluation?: Evaluation;
  id_question: number;
  question?: Question;
  id_user: number;
  user?: User;
  score: number;
}
