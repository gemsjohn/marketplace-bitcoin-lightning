import { useQuery } from '@apollo/client';
import { GET_LISTINGS } from '../../utils/queries';

export const ListingData = () => {  
    let location = localStorage.getItem("locationKey")
    let category = localStorage.getItem("categoryKey")
    let forsaleListingsArray = [];
    const { data: listingData, refetch } = useQuery(GET_LISTINGS);
    for (let i = 0; i < listingData?.listings.length; i++) {
        if (listingData?.listings[i].forsale === true) {
            if (listingData?.listings[i].location === location) {
                if (listingData?.listings[i].category === category ) {
                    forsaleListingsArray.push(listingData?.listings[i] || {}); 
                } else if (category === "") {
                    forsaleListingsArray.push(listingData?.listings[i] || {}); 
                }
            } else if (location === "") {
                if (listingData?.listings[i].category === category ) {
                    forsaleListingsArray.push(listingData?.listings[i] || {}); 
                } else if (category === "") {
                    forsaleListingsArray.push(listingData?.listings[i] || {}); 
                }
            }
        }
    }
    refetch();

    return forsaleListingsArray;
}