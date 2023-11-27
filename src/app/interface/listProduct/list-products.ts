export interface ListProducts {
    id ?: number;
    product_id?: number;
    sku ?: string;
    barcode: string | null;
    variation_name: string;
    display_name: string;
    image: string | null;
    price_import: number;
    price_export: number;
    quantity : number | 0;
    status: boolean;
    variation_quantities : any;
}
