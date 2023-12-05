export interface Tenant {
  id?: number,
  business_name: string,
  name: string,
  created_at: Date,
  updated_at: Date,
  due_at: Date,
  pricing: any,
}
