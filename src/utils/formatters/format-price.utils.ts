export const formatPrice = (price: number) => {
  console.log("price", price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(price);
};
