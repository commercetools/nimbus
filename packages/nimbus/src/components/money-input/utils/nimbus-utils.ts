// Simple warning utility - replaces @commercetools-uikit/utils warning
export const warning = (condition: boolean, message: string) => {
  if (!condition && process.env.NODE_ENV !== "production") {
    console.warn(message);
  }
};
