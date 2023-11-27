export interface Role {
    id?: number;
    name : string;
    guard_name : string;
    created_at ?: Date | null;
    updated_at ?: Date | null;
}
