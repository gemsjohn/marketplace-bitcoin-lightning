import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../utils/queries';



export const UsersData = () => {
    const { data: usersData, refetch } = useQuery(GET_USERS);
    const users = usersData?.users || {};
    refetch();

    return users;
}