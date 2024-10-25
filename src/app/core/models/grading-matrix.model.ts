import { Subject } from './subject.model';

export interface GradingMatrix {
  id: number;
  id_subject: number;  // Llave foránea hacia Subject
  // Relación con el Subject
  subject?: Subject;  // Incluimos el Subject opcionalmente
  total_evaluations: number;
  total_score: number;
  recommendation: string;
  score: number;
  document: string;
}
