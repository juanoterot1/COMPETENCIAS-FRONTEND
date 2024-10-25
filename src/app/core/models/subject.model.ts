export interface Faculty {
    id: number;
    name: string;
  }

export interface Subject {
  id: number;
  name: string;
  code: string;
  id_faculty: number;
  faculty?: Faculty;  // Relación opcional con Faculty
}