export interface Products {
    id ?: number;
    name : string;
    image ?: string | null;
    weight ?: number | null;
    description ?: string | null;
    manage_type ?: number | null;
    brand_id ?: number | null;
    warranty_id ?: number | null;
    item_unit_id ?: number | null;
    category_id ?: number | null;
    attributes ?: any;
    status : number;
    variations ?: any; 
    created_at ?: Date | null;
    updated_at	?: Date | null;	
    format_created_at  ?: Date | null;
    format_updated_at  ?: Date | null;
    
}
