import type { TagInterface } from "./Tag";

export interface MenuInterface {
    /* toLowerCase(): unknown; */
    ID?: number;
    Title?: string;
    Description?: string;
    Region?: string;
    Image?: string;
    Sodium?: number;
    AdminID?: number; //FK
    Credit?: string;
    Tags: TagInterface[]; 
}