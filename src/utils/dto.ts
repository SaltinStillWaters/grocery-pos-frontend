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


export type Dto = AdjustDto | UpdateProductBulkDto