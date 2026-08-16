export interface BarberDto {
  id: number;
  fullName: string;
  isActive: boolean;
}

export interface UpsertBarberRequest {
  fullName: string;
  isActive: boolean;
}
