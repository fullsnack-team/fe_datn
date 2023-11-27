export interface Pricing {
  id?: number;
  name: string;
  price_per_month: number;
  max_location: number;
  max_users: number;
  created_at: string;
  updated_at: string;
}
