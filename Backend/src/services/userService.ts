import { User } from '../models/User';

export const findAllUsers = async () => {
  return User.find();
};

export const findUserById = async (id: string) => {
  return User.findById(id);
};

export const createUser = async (data: any) => {
  const user = new User(data);
  return user.save();
};

export const updateUser = async (id: string, data: any) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
}; 