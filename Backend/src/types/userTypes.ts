export interface AddressInput {
  id: number;
  label: string;
  address: string;
  postcode: string;
  phone: string;
}

export interface UserInput {
  name: string;
  email: string;
  contact: string;
  addresses: AddressInput[];
} 