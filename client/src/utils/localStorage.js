export const getAddedListingIds = () => {
  const addedListingIds = localStorage.getItem('added_listings')
    ? JSON.parse(localStorage.getItem('added_listings'))
    : [];

  return addedListingIds;
};

export const addListingIds = (listingIdArr) => {
  if (listingIdArr.length) {
    localStorage.setItem('added_listings', JSON.stringify(listingIdArr));
  } else {
    localStorage.removeItem('added_listings');
  }
};
