import React, { useState } from "react";
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_LISTING_BY_CREATOR_ID, GET_ME } from '../../utils/queries';
import { DELETE_LISTING } from '../../utils/mutations';
import { Button, Row, Form, Col } from 'react-bootstrap';
import { IKImage, IKContext } from 'imagekitio-react';
import { imageKitListForm } from '../../utils/API';
import { Link } from 'react-router-dom';
// import {imageKitListForm} from '../../utils/API';
import Auth from '../../utils/auth';

const styles = {
    cardImage: {
        borderRadius: '5px 5px 5px 5px'
    },
    cardText: {
        fontSize: '1rem',
        marginTop: '0.5rem'
    }
}

const ForSaleByCreatorID = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [userDetailsDropdown, setUserDetailsDropdown] = useState(false);
    const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
    const RenderImg = `${process.env.REACT_APP_PLACEHOLDER_RENDER_IMG}`;
    const [deleteListing] = useMutation(DELETE_LISTING);

    const { data: medata} = useQuery(GET_ME);
    const me = medata?.me || {};

    const [searchListingByCreatorID, { data }] = useLazyQuery(GET_LISTING_BY_CREATOR_ID, {
        variables: { search: me._id },
        enabled: false,
    });

    const handleUserDetailsDropdown = () => {
        if (userDetailsDropdown) { setUserDetailsDropdown(false) }
        else { setUserDetailsDropdown(true) }
    }

    let searchedData = data?.getListingByCreatorID.listings;
    let filteredData = [];

    const handleDeleteListing = async (id, fileid) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        console.log(fileid)
        let fileIDRemove;
        for (let i = 0; i < fileid.length; i++) {
            fileIDRemove = {id: fileid[i]};
            imageKitListForm(fileIDRemove); 
            console.log(fileid[i])
        }
        try {
            await deleteListing(
                { variables: { deleteListingId: id} }
            );
            window.location.reload(false);

        } catch (e) {
            console.error(e);
        }

                
    }

    const handleFilter = (init) => {
        let array = init;
        
        for (let i = 0; i < array?.length; i++) {
            function ValidateText() {
                let http = new XMLHttpRequest();
                const pattern = /^((http|https|ftp):\/\/)/;
                let url = init[i].media[0];
                
                http.open('HEAD', pattern.test(url), false);
        
                if (pattern.test(url)) {
                    return (
                        <>
                            <IKContext urlEndpoint={urlEndpoint}>
                                <img 
                                    src={url} 
                                    style={{ 
                                        ...styles.cardImage, 
                                        height: '10vh', 
                                        width: 'auto' ,
                                        display: 'flex'
                                    }}
                                    alt="" 
                                />
                            </IKContext>
                        </>
                    )
                } else {
                    return (
                        <IKContext urlEndpoint={urlEndpoint}>
                            <IKImage
                                src={RenderImg}
                                style={{...styles.cardImage, display: 'flex'}}
                                transformation={[{
                                    height: 70,
                                    width: 119,
                                    cropMode: 'fo-custom',
                                    bg: 66000000,
                                    q: 100
                                }]}
                            />
                        </IKContext>
                    )
                }
        
            }
            ValidateText();

            function handleLocalStorage(event) {
                localStorage.removeItem('listingID');
                localStorage.setItem('listingID', JSON.stringify(array[i]._id));
            }

            if(searchedData[i].forsale === true) {
            filteredData[i] =
                <Form style={{ width: '70vw', margin: 'auto' }} key={i}>
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{ 
                            display: 'flex', 
                            justifyContent: 'left', 
                            padding: '10px', 
                            border: 'solid', 
                            borderRadius: '10px', 
                            alignItems: 'center' }}>
                                <Button 
                                    onClick={handleLocalStorage}
                                    as={Link}
                                    to='/listing'
                                    style={{
                                        width: '70vw', 
                                        margin: 'auto', 
                                        background: 'transparent', 
                                        outline: 'none', 
                                        border: 'none'
                                    }}
                                >
                                    <Row style={{alignItems: 'center'}}>
                                        <Col style={{width: '30vw'}}>
                                            <ValidateText />
                                        </Col>
                                        <Col style={{width: '30vw'}}>
                                            <p style={{
                                                fontSize: '1rem', 
                                                margin: 'auto auto auto 1vw',
                                                display: 'flex'
                                            }}>{searchedData[i].title}</p>
                                        </Col>
                                    </Row>  
                                </Button>
                                <Button 
                                    onClick={() => handleDeleteListing(searchedData[i]._id, searchedData[i].fileid)}
                                    style={{
                                        display: 'flex', 
                                        flexWrap: 'wrap', 
                                        justifyContent: 'center', 
                                        margin: 'auto', 
                                        background: '#ef233c', 
                                        color: 'white', 
                                        borderLeft: 'solid', 
                                        borderWidth: 'thin', 
                                        borderColor: '#ef233c',
                                        position: 'absolute',
                                        marginTop: '6rem',
                                        marginLeft: '-1rem'}}
                                >
                                    Remove
                                </Button>
                        </Form.Label>
                    </Form.Group>
                </Form>
            }
        }
    }
    handleFilter(searchedData);


    return (
        <>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                flexDirection: 'column',
                margin: '10px' 
            }}>
                {userDetailsDropdown ?
                    <>
                        <div
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center', 
                                margin: 'auto', 
                                backgroundColor: '#0A9396', 
                                padding: '1rem', 
                                borderRadius: '20px', 
                                width: '80vw' }}
                            onClick={() => {
                                searchListingByCreatorID(); 
                                setSearchContent(current => !current); 
                                handleUserDetailsDropdown();
                            }}
                        >
                            <p style={{ margin: 'auto' }}>
                                <i className="fa-solid fa-address-card"></i>
                                &nbsp; 
                                For Sale 
                                &nbsp;
                                <i className="fa-solid fa-arrow-up"></i></p>
                        </div>
                    </>
                    :
                        <div
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center', 
                                margin: 'auto', 
                                backgroundColor: '#0A9396', 
                                padding: '1rem', 
                                borderRadius: '20px', 
                                width: '80vw' }}
                            onClick={() => {
                                searchListingByCreatorID(); 
                                setSearchContent(current => !current); 
                                handleUserDetailsDropdown();
                            }}
                        >
                            <p style={{ margin: 'auto' }}>
                                <i className="fa-solid fa-address-card"></i> 
                                &nbsp;
                                For Sale 
                                &nbsp;
                                <i className="fa-solid fa-arrow-down"></i></p>
                        </div>
                    }
            </div>
            {searchContent ? (
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    margin: 'auto', 
                    zIndex: '4', 
                    marginTop: '0.1rem' 
                }}>
                    {filteredData.reverse()}
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default ForSaleByCreatorID;