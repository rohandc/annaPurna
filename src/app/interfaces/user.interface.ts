export interface UserInterface {
  first_name: String ;
  last_name: String ;
  user_name: String ;
  user_password: String ;
  email: String ;
  contact_no: String ;
  admin: Boolean ;
  address: Address;
  nfAddress: { storeName: String,
               storeAddress: String ,
               lat: number, lng: number, storeID: number, isSet: boolean };
}

interface Address {
  street_address: String;
  locality: String;
  administrative_area_level_1: String;
  postal_code: String;
  country: String;
  lat: number;
  lng: number;
}
