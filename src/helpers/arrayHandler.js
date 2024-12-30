export const removeDuplicatesArray = array => {
  const uniqueArray = [];
  const ids = new Set();

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!ids.has(item.id)) {
      uniqueArray.push(item);
      ids.add(item.id);
    }
  }

  return uniqueArray;
};
