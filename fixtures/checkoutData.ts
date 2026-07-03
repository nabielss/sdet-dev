export interface ShippingInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const validShippingInfo: ShippingInfo = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "12345",
};

export const products = {
  backpack: "Sauce Labs Backpack",
  bikeLight: "Sauce Labs Bike Light",
  boltTShirt: "Sauce Labs Bolt T-Shirt",
  fleeceJacket: "Sauce Labs Fleece Jacket",
  onesie: "Sauce Labs Onesie",
  testAllTheThings: "Test.allTheThings() T-Shirt (Red)",
} as const;
