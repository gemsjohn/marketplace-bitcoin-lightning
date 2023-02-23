import React, { useState, } from "react";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_USER_QUERY } from '../../utils/queries';

const UserSearchBar = (props) => {
    const [searchContent, setSearchContent] = useState(false);
    const [userSearchInput, setUserSearchInput] = useState('');
    // const [searchInput, setSearchInput] = useState('');

    const [searchUser, { data }] = useLazyQuery(SEARCH_USER_QUERY, {
        variables: { search: `${props.name}` },
        enabled: false,
    });

    let searchedUserData = data?.getUsers.users;
    let filteredUsers = [];
    console.log(searchedUserData);
    console.log(props.name)

    const handleSearchInput = (event) => {
        const { name, value } = event.target;
        // console.log(value);
        if (value) {
            setSearchContent(true)
        } else {
            setSearchContent(false)
        }
        setUserSearchInput(value)
        searchUser()
    };


    const handleFilteredUsers = (init) => {
        let array = init;
        // console.log(array)
        for (let i = 0; i < array?.length; i++) {
            // console.log(array[i].title);
            filteredUsers[i] =
                <div style={{}}>
                    <p
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            width: '40vw',
                            margin: '0.25rem',
                            padding: '1rem',
                            top: '10',
                            borderRadius: '20px'
                        }}
                        key={i}
                    >{array[i].username}</p>
                </div>
        }
    }
    handleFilteredUsers(searchedUserData);


    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'column' }}>
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={handleSearchInput}
                        style={{
                            // marginRight: '10rem',
                            height: '3rem',
                            width: '60vw',
                            outline: 'none',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 95, 115, 0.2)',
                            padding: '10px',
                            color: 'white'
                        }}
                    ></input>
                </div>
            </div>
            {searchContent ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'column', margin: 'auto', position: 'absolute', zIndex: '4', marginTop: '10rem' }}>
                    {filteredUsers}
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default UserSearchBar;