export interface Locations {
  id?: number;
  name: string;
  image?: File | null;
  description?: string | null;
  tel: string;
  email?: string | null;
  province_code?: number | null;
  district_code?: number | null;
  ward_code?: number | null;
  address_detail?: string | null;
  status: number;
  is_main: number;
  created_by: number;
  inventory: any;
  // created_at ?: Date | null;
  // updated_at	?: Date | null;
}
