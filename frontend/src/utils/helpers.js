// Format prices in Indian Rupees
export const currency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

// Get a readable error message
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

// Build a usable image URL
export const imageUrl = (
  value,
  width = 700
) => {
  if (value?.startsWith?.("http")) {
    return value;
  }

  const imagePath =
    value ||
    "photo-1490481651871-ab68de25d43d";

  return `https://images.unsplash.com/${imagePath}?auto=format&fit=crop&w=${width}&q=85`;
};

// Keep getImage as an alias for older components
export const getImage = imageUrl;
