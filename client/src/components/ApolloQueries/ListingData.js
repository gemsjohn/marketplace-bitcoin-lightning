import { useQuery } from '@apollo/client';
import { GET_LISTINGS } from '../../utils/queries';



export const ListingData = () => {
    const { data: listingData, refetch } = useQuery(GET_LISTINGS);
    const getListings = listingData?.listings || {};
    refetch();

    return getListings;
}