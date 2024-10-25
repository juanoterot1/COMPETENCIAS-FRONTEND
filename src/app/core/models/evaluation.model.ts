import { Subject } from './subject.model';
import { Faculty } from './faculty.models';
import { User } from './user.model';

export interface Evaluation {
  id: number;
  name: string;
  description: string;
  id_subject: number; // Llave foránea
  id_faculty: number; // Llave foránea
  id_user: number; // Llave foránea
  status: string;
  subject?: Subject; // Relación con la materia
  faculty?: Faculty; // Relación con la facultad
  user?: User; // Relación con el usuario
}
