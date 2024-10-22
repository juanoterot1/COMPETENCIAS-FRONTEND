export interface Evaluation {
  id: number;
  full_name: string;
  dni: string;
  job_title: string;
  name_delegation: string;
  date_generation: Date;
  termination_days: number;
  status?: string;
  date_seniority?: Date;
  account_manager_name?: string;
  programmer_name?: string;
  contract?: string;
  service?: string;
  id_account_manager?: number;  // Asegúrate de que esta propiedad existe
  id_programmer?: number;       // Asegúrate de que esta propiedad existe

  showDetails?: boolean;
  responseStatus?: boolean;
}
