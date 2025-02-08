import { ObjectId } from "mongodb";

export interface Widget{
    id?: ObjectId
    name: string,
    description: string;
    code: string;
}