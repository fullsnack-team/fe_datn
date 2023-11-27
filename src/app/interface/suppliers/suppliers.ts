export interface Suppliers {
    id ?: number;
    group_supplier_id ?: number | null;
    type ?: number | null;
    name : string ;
    email ?: string | null;
    tel : string;
    status ?: number | null;
    province_code ?: number | null;
    district_code ?: number | null;
    ward_code	?: number | null;
    address_detail	?: string | null;
    note ?: string | null;
    created_at ?: Date | null;
    updated_at	?: Date | null;	
}
