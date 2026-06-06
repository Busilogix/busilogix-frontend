export type CustomerAddressFormValues = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type CustomerFormValues = {
  mobile: string;
  name?: string;
  email?: string;
  address?: CustomerAddressFormValues;
};
