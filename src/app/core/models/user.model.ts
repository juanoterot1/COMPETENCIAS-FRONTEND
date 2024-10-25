// user.model.ts
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  password?: string;  // El password es opcional
  full_name: string;
  phone_number?: string;  // Hacerlo opcional ya que el backend no lo está devolviendo
  mail: string;  // Cambiar email a mail para coincidir con la respuesta de la API
  role_id: number;
  role?: Role; // Relación con el rol del usuario, que deberás obtener por separado
}
