export interface Rents {
    car_id: number;
    car_license_plate: string;
}

export interface PhotoObj {
    thumbUrl: string;
}
export interface Photos {
    id: number;
    photo: string;
}

export interface Service {
    id: number;
    name: string;
}
export interface CurrentService {
    id: number;
    car_license_plate: string;
    service: string;
    photos: Photos[];
    comment?: string;
}

export type FieldType = {
    carLicensePlate: string;
    serviceName: string;
    comment: string;
    images: PhotoObj[];
};
