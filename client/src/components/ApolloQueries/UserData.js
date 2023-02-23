import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';

export const UserData = () => {
    const { data: meData, refetch } = useQuery(GET_ME);
    const getMe = meData?.me || {};
    refetch();
    return getMe;
}