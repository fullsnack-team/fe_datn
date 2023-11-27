export interface Debts {
  id?: number;
  partner_id?: number;
  partner_type?: number;
  debit_at?: string;
  due_at?: string;
  type?: number;
  name?: string;
  principal?: number;
  note?: string;
  status?: number;
}
