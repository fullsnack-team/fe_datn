import {Role} from "../role/role";

export interface User {
  id?: number;
  user_name?: string;
  name: string;
  email: string;
  address: string;
  tel?: string;
  location_id?: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  roles?: Role[];
}
