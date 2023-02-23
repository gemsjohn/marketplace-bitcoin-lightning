import React, { useState, useRef } from "react";
import { Button, Col, Row, InputGroup, Form } from "react-bootstrap";
import { useMutation, useQuery } from '@apollo/client';
import { GET_LISTING_BY_ID } from '../../utils/queries';
import { UPDATE_LISTING } from '../../utils/mutations';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Auth from '../../utils/auth';
import '../../index.css';
import { UserData } from '../../components/ApolloQueries/UserData';

const ListingDescription = () => {
    let authenticatedUserListings = false;
    const inputRef = useRef(null);
    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const [updateListing] = useMutation(UPDATE_LISTING);
    const [showEditableFieldDescription, setShowEditableFieldDescription] = useState(false);
    const { data: viewed } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    let ViewableListingData = viewed?.listing || {};
    const me = UserData();
    
    const viewableListingFieldDescription = [
        { 
            label: 'DESCRIPTION', 
            value: ViewableListingData.description, 
            edit: showEditableFieldDescription, 
            setedit: setShowEditableFieldDescription, 
            id: 4, 
            name: 'description' 
        },
    ]
  
    const handleDescriptionClick = async () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: ViewableListingData.price,
                        description: inputRef.current.value,
                        category: ViewableListingData.category,
                        condition: ViewableListingData.condition,
                        contact: ViewableListingData.contact,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        media: ViewableListingData.media,
                        location: ViewableListingData.location,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
    }

    if (me._id === ViewableListingData.creatorid) { authenticatedUserListings = true; }
    else { authenticatedUserListings = false; }

    const Characteritics = () => {
        return (
            <>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '2rem' 
            }}>
                <Col>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'left', 
                        padding: '0 0 0 1rem', 
                        flexDirection: 'column' 
                    }}>
                        <Row>
                            <h1>Description</h1>
                            {Auth.loggedIn() && authenticatedUserListings ?
                                    <button
                                        style={{ 
                                            backgroundColor: 'transparent', 
                                            color: 'white', 
                                            border: 'none', 
                                            outline: 'none' 
                                        }}
                                        onClick={(event) => { 
                                            event.preventDefault(); 
                                            viewableListingFieldDescription[0].setedit(current => !current); 
                                        }}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    :
                                    null
                            }
                        </Row>
                        <Row>
                            <p style={{ fontSize: '2vh', margin: '1rem' }}>
                                {ViewableListingData.description}
                            </p>
                        </Row>
                    </div>
                    {viewableListingFieldDescription[0].edit ?
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder={viewableListingFieldDescription[0].value}
                                ref={inputRef}
                                name={viewableListingFieldDescription[0].name}
                                type="text"
                                id={viewableListingFieldDescription[0].name}
                                style={{ 
                                    background: 'transparent', 
                                    borderLeft: 'solid', 
                                    borderWidth: 'thin', 
                                    borderColor: 'rgba(148, 210, 189, 0.2)', 
                                    color: 'white' 
                                }}
                            />
                            <Button
                                type='submit'
                                variant="outline-secondary"
                                id="button-addon2"
                                style={{ 
                                    backgroundColor: '#94D2BD', 
                                    color: '#001219', 
                                    borderLeft: 'solid', 
                                    borderWidth: 'thin', 
                                    borderColor: 'rgba(148, 210, 189, 0.2)', 
                                }}
                                onClick={(event) => { 
                                    handleDescriptionClick(); 
                                    event.preventDefault(); 
                                }}
                            >
                                Save
                            </Button>
                        </InputGroup>
                        :
                        null
                    }

                </Col>
            </div>
            </>
        )
    }
    return (<Characteritics />);
}

export default ListingDescription;