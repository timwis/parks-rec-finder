export function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^\-|\-$/i, '')        // Remove leading/trailing hyphen
}

export function concatAddress (addressParts = {}) {
  const { street, street2, city, state, zip } = addressParts
  const order = [ street, street2, city, state, zip ]
  return order
    .filter((part) => part && part.length > 0)
    .join(', ')
}
