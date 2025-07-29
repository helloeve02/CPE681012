export interface MenuInterface {
    /* toLowerCase(): unknown; */
    ID?: number;
    Title?: string;
    Description?: string;
    Region?: string;
    Image?: string;
    AdminID?: number; //FK
}