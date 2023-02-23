import React, { useState, useEffect } from 'react';
import { Row, Col, OverlayTrigger, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_LISTING_BY_ID } from '../../utils/queries';
import { UserData } from '../../components/ApolloQueries/UserData';
import Auth from '../../utils/auth';
import SelectStyle from '../../Stylizer';
import LoadingSpinner from "./Auxilliary/LoadingSpinner";
import ListingCharacteristics from './ListingCharacteristics';
import ListingDescription from "./Description";
// import DemoAppInvoiceAndQuote from '../../components/DemoInvoiceAndQuote';
import ImageDisplay from './Auxilliary/ImageDisplay';
import { handleLoginToDMSeller, handleLoginToAddToWatchlist, renderDMToolTip } from './Auxilliary/ToolTips';
// import { HandleAddToWatchlist, HandleRemoveFromWatchlist, CalculateNumberOfWatchers } from './Auxilliary/Watchlist';
import { UserDM } from './Auxilliary/UserDM';
import { CreatorDM } from './Auxilliary/CreatorDM';

const ViewableListing = () => {
    // window.scrollTo(0, 0);
    ///////////////////////////////////////////////
    // [][][][][][][][] - APOLLO - [][][][][][][][]
    ///////////////////////////////////////////////
    const me = UserData();
    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const { data: viewed, refetch } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    let ViewableListingData = viewed?.listing || {};

    /////////////////////////////////////////////////////////
    // [][][][][][][][] - STATE MANAGEMENT - [][][][][][][][]
    /////////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(0);

    //////////////////////////////////////////////////
    // [][][][][][][][] - VARIABLES - [][][][][][][][]
    //////////////////////////////////////////////////
    let authenticatedUserListings = false;

    ///////////////////////////////////////////////////////////////////////////
    // [][][][][][][][] - AUTHENDICATED USER LISTING BOOLEAN - [][][][][][][][]
    ///////////////////////////////////////////////////////////////////////////
    if (me._id === ViewableListingData.creatorid) { authenticatedUserListings = true; }
    else { authenticatedUserListings = false; }


    ////////////////////////////////////////////////////////////
    // [][][][][][][][] - USE EFFECT(s) - [][][][][][][][]
    ////////////////////////////////////////////////////////////
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setWindowWidth(((2) ^ (window.innerWidth / 2)))
            } else if (window.innerWidth >= 481 && window.innerWidth <= 1024) {
                setWindowWidth((window.innerWidth / 1.8))
            } else if (window.innerWidth >= 1025 && window.innerWidth <= 1280) {
                setWindowWidth((window.innerWidth / 2))
            } else if (window.innerWidth >= 1281) {
                setWindowWidth((window.innerWidth / 3))
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => { window.removeEventListener("resize", handleResize) }
    }, [windowWidth])

    let timeoutID = setTimeout(() => {
        if (ViewableListingData?.media) {
            setLoading(false);
        } else {
            setLoading(true);
        }

    }, 250)

    if (loading === false) {
        clearTimeout(timeoutID);
    }

    ///////////////////////////////////////////
    // [][][][][][][][] - AUXILLIARY - [][][][][][][][]
    ///////////////////////////////////////////
    localStorage.setItem("listingCreatorID", ViewableListingData.creatorid)
    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            {loading ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}><LoadingSpinner /></div>
                :
                <div style={{ ...SelectStyle[0].page }}>
                    <div style={{ width: '100%', marginTop: '10vh' }}>
                        {!Auth.loggedIn() ?
                            <>
                                <Nav.Link as={Link} to='/login' style={{ margin: '1rem' }}>
                                    {['top'].map((placement) => (
                                        <OverlayTrigger
                                            key={placement}
                                            placement={placement}
                                            overlay={handleLoginToDMSeller}
                                        >
                                            <span style={{
                                                fontSize: '3rem',
                                                borderRadius: '10px',
                                                margin: 'auto',
                                                padding: '10px',
                                                backgroundColor: '#f9c74f',
                                                color: '#001219',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                width: 'fit-content'
                                            }}>Login or Sign Up to Contact Seller!</span>
                                        </OverlayTrigger>
                                    ))}
                                </Nav.Link>

                            </>
                            :
                            null
                        }
                        <ImageDisplay />
                        <Row style={{ margin: '0.5rem' }}>
                            <Col>
                                <h2
                                    style={{
                                        fontSize: '4vh',
                                        color: '#f1faee',
                                        borderRadius: '10px',
                                        padding: '1rem 2rem',
                                        width: '90vw',
                                        margin: 'auto',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {ViewableListingData.title}
                                </h2>
                                {!Auth.loggedIn() ?
                                    null
                                    :
                                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 10vw', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
                                }
                                {Auth.loggedIn() ?
                                    <>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 250, hide: 250 }}
                                            overlay={renderDMToolTip}
                                        >
                                            {!authenticatedUserListings ?
                                                <>
                                                    <UserDM data={ViewableListingData} user={me} />
                                                </>
                                                :
                                                <CreatorDM data={ViewableListingData} user={me} />
                                            }
                                        </OverlayTrigger>
                                    </>
                                    :
                                    null
                                }
                                {!Auth.loggedIn() ?
                                    null
                                    :
                                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 10vw', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
                                }
                                <ListingCharacteristics />
                                <ListingDescription />
                                <div style={{ height: '20vh' }}></div>
                            </Col>
                        </Row>
                    </div>
                </div>
            }

        </div>
    );
}

export default ViewableListing;