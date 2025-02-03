import { ObjectId } from 'mongodb';

export interface UserWidget {
  id?: ObjectId;
  user: {
    id: ObjectId;
  };
  widget: {
    type: {
      id: ObjectId;
      name: string;
    };
    data: Newsletter | Advertisement;
    properties?: string[];
  };
}

export interface Newsletter {
  title: string;
  message: string;
  styles: {
    color: string;
    bgColor: string;
  };
}

export interface Advertisement {
  title: string;
  styles: {
    color: string;
    bgColor: string;
  };
}
