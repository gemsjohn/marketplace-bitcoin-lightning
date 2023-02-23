import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { REMOVE_FROM_WATCHLIST } from '../../utils/mutations';
import { Button, Row, Form, Col } from 'react-bootstrap';
import { IKImage, IKContext } from 'imagekitio-react';
import { Link } from 'react-router-dom';
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

const Watchlist = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [userDetailsDropdown, setUserDetailsDropdown] = useState(false);
    const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
    const RenderImg = `${process.env.REACT_APP_PLACEHOLDER_RENDER_IMG}`;
    const [removeFromWatchlist] = useMutation(REMOVE_FROM_WATCHLIST);

    const { data: medata} = useQuery(GET_ME);
    const me = medata?.me || {};

    const handleUserDetailsDropdown = () => {
        if (userDetailsDropdown) { setUserDetailsDropdown(false) }
        else { setUserDetailsDropdown(true) }
    }

    let watchlistArray = [];

    const handleRemoveFromWatchlist = async (id, listingid) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        console.log("test")

                try {
                    await removeFromWatchlist(
                        { variables: { 
                            removeFromWatchListId: id, 
                            listingid: listingid}
                        }
                    );
                    window.location.reload(false);

                } catch (e) {
                    console.error(e);
                }
    }

    const handleFilter = (init) => {
        

        for (let i = 0; i < init?.length; i++) {
            function ValidateText() {
                let http = new XMLHttpRequest();
                const pattern = /^((http|https|ftp):\/\/)/;
                let url = init[i].media
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
                                        width: 'auto',
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

            function handleLocalStorage() {
                localStorage.removeItem('listingID');
                localStorage.setItem('listingID', JSON.stringify(init[i].listingid));
            }
            watchlistArray[i] =
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
                                            }}>{init[i].title}</p>
                                        </Col>
                                    </Row>  
                                </Button>
                                <Button 
                                    onClick={() => handleRemoveFromWatchlist(init[i]._id, init[i].listingid)}
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
                                >Remove</Button>
                        </Form.Label>
                    </Form.Group>
                </Form>
        }
    }
    handleFilter(me.watchlist);


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
                                setSearchContent(current => !current); 
                                handleUserDetailsDropdown();
                            }}
                        >
                            <p style={{ margin: 'auto' }}>
                                <i className="fa-solid fa-address-card"></i> 
                                &nbsp;
                                Watchlist 
                                &nbsp;
                                <i className="fa-solid fa-arrow-up"></i>
                            </p>
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
                                setSearchContent(current => !current); 
                                handleUserDetailsDropdown();
                            }}
                        >
                            <p style={{ margin: 'auto' }}>
                                <i className="fa-solid fa-address-card"></i> 
                                &nbsp;
                                Watchlist 
                                &nbsp;
                                <i className="fa-solid fa-arrow-down"></i>
                            </p>
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
                    {watchlistArray.reverse()}
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default Watchlist;