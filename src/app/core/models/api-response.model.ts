export interface ApiResponse<T> {
  result: T;
  message: string;
  success: boolean;
  status: number;
  total?: number;         // Total de elementos
  page?: number;          // Página actual
  per_page?: number;      // Elementos por página
  has_next?: boolean;     // Si hay una página siguiente
  has_prev?: boolean;     // Si hay una página anterior
}
