import React, { useState, } from "react";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_LISTING_CATEGORY_QUERY, GET_LISTINGS } from '../../utils/queries';
import { useMutation, useQuery } from '@apollo/client';
import { Row, Col, Button, } from "react-bootstrap";
import { Link } from 'react-router-dom';

const CategoryFilter = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [listingCategorySearchInput, setListingCategorySearchInput] = useState('');

    const [searchListingCategory, { data: listingCategory }] = useLazyQuery(SEARCH_LISTING_CATEGORY_QUERY, {
        variables: { search: listingCategorySearchInput },
        enabled: false,
    });

    let searchedListingCategoryData = listingCategory?.getListingCategory;
    let filteredListings = [];
    console.log(searchedListingCategoryData);

    const handleListingCategoryFilter = (event) => {
        const { name, value } = event.target;
        // console.log(value);
        if (value) {
            setSearchContent(true)
        } else {
            setSearchContent(false)
        }
        setListingCategorySearchInput("Auto")
        searchListingCategory()
    };

    


    // const handleFilteredListings = (init) => {
    //     let array = init;
    //     console.log(array)
    // }
    // handleFilteredListings(searchedListingCategoryData);


    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'column' }}>
                <div>
                    <button
                        type="text"
                        placeholder="Search"
                        onClick={handleListingCategoryFilter}
                        style={{
                            // marginRight: '10rem',
                            height: '3rem',
                            width: '10vw',
                            outline: 'none',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: 'yellow',
                            padding: '10px',
                            color: 'black'
                        }}
                    >FILTER</button>
                </div>
            </div>
        </>
    )
}

export default CategoryFilter;