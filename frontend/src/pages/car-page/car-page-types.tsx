// TODO дописать здесь типы
export interface CarPage {
    id: number;
    photos: [{ car: number; photo: string }];
    videos: [{ car: number; video: string }];
    name: string;
    description: string;
    price: number;
    daily_rent: number;
}
