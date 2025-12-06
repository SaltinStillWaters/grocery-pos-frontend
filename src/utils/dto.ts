import type { Role } from "./types";

interface AdjustFields {
    product: string;
    
    change: number;

    reason?: string;
}

export interface AdjustDto {
    description?: string
    adjustDetails: AdjustFields[]
}


interface UpdateProductFields {
    name?: string
    price?: number
}
interface UpdateProductBulkFields {
    product: string
    update: UpdateProductFields
}
export interface UpdateProductBulkDto {
    updates: UpdateProductBulkFields[]
}

interface UpdateUserFields {
    name?: string;
    password?: string;
    roles?: Role[];
    isActive?: boolean;
}
interface UpdateUserBulkFields {
    user: string;
    update: UpdateUserFields;
}
export interface UpdateUserBulkDto {
    updates: UpdateUserBulkFields[]
}

export type Dto = AdjustDto | UpdateProductBulkDto | UpdateUserBulkDto