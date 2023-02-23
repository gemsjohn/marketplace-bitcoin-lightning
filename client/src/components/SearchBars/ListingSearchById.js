import React, { useState, useEffect } from "react";
import { useLazyQuery } from '@apollo/client';
import { GET_LISTING_BY_ID, GET_LISTINGS } from '../../utils/queries';
import { useMutation, useQuery } from '@apollo/client';
import { Row, Col, Button, } from "react-bootstrap";
import { Link } from 'react-router-dom';

const ListingSearchBar = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [listingSearchInput, setListingSearchInput] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    // const [searchInput, setSearchInput] = useState('');

    const [searchListing, { data }] = useLazyQuery(GET_LISTING_BY_ID, {
        variables: { id: listingSearchInput },
        enabled: false,
    });

    let searchedListingData = data?.listing;
    let filteredListings = [];
    localStorage.setItem("listingById", searchedListingData)
    // console.log(searchedListingData);

    const handleSearchInput = (event) => {
        const { name, value } = event.target;
        // console.log(value);
        if (value) {
            setSearchContent(true)
        } else {
            setSearchContent(false)
        }
        setListingSearchInput(value)
        searchListing()
    };

    const handleFilteredListings = (init) => {
        let array = init;
        // console.log(array)
        for (let i = 0; i < array?.length; i++) {
            // console.log(array[i].title);
            const handleLocalStorage = () => {
                localStorage.removeItem('listingID');
                localStorage.setItem('listingID', JSON.stringify(array[i]._id));
                setSearchContent(false);
                
            }
            filteredListings[i] =
                <div style={{}}>
                    <Button
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0)', outline: 'none', fontSize: '0.8rem', color: 'white', border: 'none', padding: '0.1rem' }}
                      onClick={handleLocalStorage}
                      as={Link}
                      to='/listing'
                      key={i}
                    >
                        <div
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                width: '80vw',
                                // margin: '0.1rem',
                                padding: '1rem',
                                top: '10',
                                borderRadius: '10px',
                                border: 'none'
                            }}
                            
                        >
                            <Row style={{alignItems: 'center', width: 'fit-content'}}>
                            <div style={{margin: 'auto'}}>
                                <img src={array[i].media[0]} style={{height: '3rem', width: 'auto', margin: 'auto', marginLeft: '1rem', borderRadius: '10px'}}></img>
                            </div>
                            <div>
                                <p style={{ fontSize: '1rem', margin: '1rem'}}>{array[i].title}</p>
                            </div>
                            </Row>
                        </div>
                    </Button>
                </div>
        }
    }
    handleFilteredListings(searchedListingData);

    // [[[WINDOW WIDTH - SIDEBAR OR DROPDOWN DEPNDENCY]]]
    useEffect(() => {
        function handleResize() {
        setWindowWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
        window.removeEventListener("resize", handleResize)
        }
    }, [setWindowWidth])

    // console.log(windowWidth)  

    return (
        <>
        <Row>
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
        </Row>
        <Row>
            {searchContent ? (
                <>
                <div style={{
                    position: 'relative',
                    border: 'none',
                    height: '50vh',
                    width: '70vw',
                    overflow: 'auto',
                    float: 'left',
                    marginLeft: (windowWidth/(-1.6)),
                    marginBottom: '-60rem',
                    marginTop: '3rem',
                    paddingLeft: '2rem'
                }}
                >
                <div style={{
                     position: 'relative',
                     height: 'auto',
                     right: '1rem',
                    }}
                >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: '128px',
                    bottom: 0,
                    height: '100%',}}
                >
                    {filteredListings}
                </div>
                </div>
                </div>
                </>
            ) : (
                null
            )}
            </Row>
        </>
    )
}

export default ListingSearchBar;