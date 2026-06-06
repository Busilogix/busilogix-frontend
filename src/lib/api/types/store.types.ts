export type StoreAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type ApiStoreAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type StorePaymentInfo = {
  upiId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
};

export type ApiStore = {
  id: string;
  name: string;
  address: ApiStoreAddress;
  gstNumber: string;
  logoUrl?: string;
  email?: string;
  mobile?: string;
  createdAt: string;
  paymentInfo?: StorePaymentInfo;
};

export type StoreProfileRequest = {
  name: string;
  address: StoreAddress;
  gstNumber: string;
  logoUrl?: string;
  email: string;
  mobile: string;
};

export type CreateStoreRequest = StoreProfileRequest;
export type UpdateStoreRequest = StoreProfileRequest;

export type UpdatePaymentInfoRequest = {
  upiId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
};

export type StoreMutationResponse = {
  message: string;
};
