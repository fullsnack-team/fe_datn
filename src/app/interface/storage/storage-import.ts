
export interface StorageImport {
  id?: number | null;
  inventory_id?: number | null;
  partner_id?: number | null;
  partner_type?: number | null;
  trans_type?: number | null;
  inventory_transaction_id?: number | null;
  reason?: string | null;
  note?: string | null;
  status?: number | null;
  created_by?: number | null;
  created_at ?: Date | null;
  update_at ?: Date | null;
}
