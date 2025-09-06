export interface EducationalContentInterface {
    type: string;
    ID?: number;
    Title?: string;
    PictureIn?: string;
    PictureOut?: string;
    Link?: string;
    Description?: string;
    AdminID?: number; //FK
    EducationalGroupID?: number;
    ContentCategoryID?: number;
}