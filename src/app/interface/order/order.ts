export interface Order {
    id ?: number;
    location_id : number;
    customer_id : number;
    created_by : number;
    discount : number  | null;
    discount_type : number | 0; 
    tax : number | 0;
    service_charge : number | null;
    total_product : number;
    total_price : number;
    status : number | 1;
    payment_status : number | 0;
    order_details : any;
    created_at :  Date;
    customer_data : any;
}
