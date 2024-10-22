export interface Relation {
  id: number;
  contract?: string;
  service?: string;
  id_account_manager?: number;  // ID del gerente de cuenta
  id_programmer?: number;  // ID del programador
  account_manager?: { 
    username: string;
    full_name?: string;  // Asegurarse de incluir el campo full_name
  };
  programmer?: { 
    username: string;
    full_name?: string;  // Asegurarse de incluir el campo full_name
  };
  nit?: string;
  city?: string;
  created_at?: Date;
  
  // Propiedades añadidas para mostrar el nombre completo y nombre de usuario
  account_manager_display?: string;
  programmer_display?: string;
}
