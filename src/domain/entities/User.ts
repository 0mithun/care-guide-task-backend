export interface IUser {
  _id?: any;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  interests: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
