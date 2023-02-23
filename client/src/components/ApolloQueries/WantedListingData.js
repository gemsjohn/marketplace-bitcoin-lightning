import { useQuery } from '@apollo/client';
import { GET_LISTINGS } from '../../utils/queries';

export const ListingData = () => {
    let location = localStorage.getItem("locationKey")
    let category = localStorage.getItem("categoryKey")
    let wantedListingsArray = [];
    const { data: listingData, refetch } = useQuery(GET_LISTINGS);
    // console.log(listingData?.listings.length)
    for (let i = 0; i < listingData?.listings.length; i++) {
        if (listingData?.listings[i].wanted === true) {
            if (listingData?.listings[i].location === location) {
                if (listingData?.listings[i].category === category ) {
                wantedListingsArray.push(listingData?.listings[i] || {}); 
                } else if (category === "") {
                    wantedListingsArray.push(listingData?.listings[i] || {}); 
                }
            } else if (location === "") {
                if (listingData?.listings[i].category === category ) {
                    wantedListingsArray.push(listingData?.listings[i] || {}); 
                } else if (category === "") {
                    wantedListingsArray.push(listingData?.listings[i] || {}); 
                }
            }
        }
    }
    refetch();

    return wantedListingsArray;
}