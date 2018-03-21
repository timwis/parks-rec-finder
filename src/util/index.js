export function concatAddress (addressParts = {}) {
  const { street, street2, city, state, zip } = addressParts
  const order = [ street, street2, city, state, zip ]
  return order
    .filter((part) => part && part.length > 0)
    .join(', ')
}
