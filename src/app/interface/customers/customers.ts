export interface Customers {
    id ?: number;
    group_customer_id ?: number | null;
    type ?: number  | null;
    name : string;
    gender ?: number | null;
    dob ?: String | null;
    email ?: string  | null;
    tel : string;
    status : number;
    province_code ?: number  | null;
    district_code ?: number  | null;
    ward_code ?: number  | null;
    address_detail ?:String  | null;
    note ?: String  | null;
    created_at ?: Date | null;
    updated_at ?: Date | null;
}
