import React, { useState, useRef } from "react";
import { Button, Col, InputGroup, Form, Nav } from "react-bootstrap";
import { useMutation, useQuery } from '@apollo/client';
import { GET_LISTING_BY_ID } from '../../utils/queries';
import { UPDATE_LISTING } from '../../utils/mutations';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';
import '../../index.css';
import { UserData } from '../../components/ApolloQueries/UserData';

const ListingCharacteristics = () => {
    let authenticatedUserListings = false;
    const inputRef = useRef(null);
    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const [updateListing] = useMutation(UPDATE_LISTING);
    const [showEditableFieldPrice, setShowEditableFieldPrice] = useState(false);
    const [showEditableFieldCategory, setShowEditableFieldCategory] = useState(false);
    const [showEditableFieldCondition, setShowEditableFieldCondition] = useState(false);
    const [showEditableFieldLocation, setShowEditableFieldLocation] = useState(false);
    const [showEditableFieldDate, setShowEditableFieldDate] = useState(false);
    const [showEditableFieldCreatorUsername, setShowEditableFieldCreatorUsername] = useState(false);
    const { data: viewed } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    let ViewableListingData = viewed?.listing || {};
    const me = UserData();

    if (me._id === ViewableListingData.creatorid) { authenticatedUserListings = true; }
    else { authenticatedUserListings = false; }

    function Commafy(num) {
        var str = num.toString().split('.');
        if (str[0].length >= 5) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        if (str[1] && str[1].length >= 5) {
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join('.');
    }

    const viewableListingFields = [
        {
            label: 'PRICE',
            value: Commafy(ViewableListingData.price),
            edit: showEditableFieldPrice,
            setedit: setShowEditableFieldPrice,
            id: 0,
            name: 'price'
        },
        {
            label: 'CATEGORY',
            value: ViewableListingData.category,
            edit: showEditableFieldCategory,
            setedit: setShowEditableFieldCategory,
            id: 1,
            name: 'category'
        },
        {
            label: 'CONDITION',
            value: ViewableListingData.condition,
            edit: showEditableFieldCondition,
            setedit: setShowEditableFieldCondition,
            id: 2,
            name: 'condition'
        },
        {
            label: 'LOCATION',
            value: ViewableListingData.location,
            edit: showEditableFieldLocation,
            setedit: setShowEditableFieldLocation,
            id: 3,
            name: 'location'
        },
        {
            label: 'DATE',
            value: ViewableListingData.date,
            edit: showEditableFieldDate,
            setedit: setShowEditableFieldDate,
            id: 4,
            name: 'date'
        },
        {
            label: 'LISTED BY',
            value: ViewableListingData.creatorusername,
            edit: showEditableFieldCreatorUsername,
            setedit: setShowEditableFieldCreatorUsername,
            id: 5,
            name: 'creatorinfo'
        },
    ]

    // <i class="fa-solid fa-shield-halved"></i> {ViewableListingData.creatorusername}


    const categoryArray = [
        { category: "Apparel" },
        { category: "Automotive" },
        { category: "Collectables" },
        { category: "Electronics" },
        { category: "Hardware" },
        { category: "Health and Beauty" },
        { category: "Household" },
        { category: "Pet Supplies" },
        { category: "Sporting Goods" },
        { category: "Toys" }
    ]

    const CategoryButton = () => {
        let CategoryButtonArray = [];
        for (let i = 0; i < categoryArray.length; i++) {

            CategoryButtonArray[i] =
                <Button
                    // type='submit'
                    variant="outline-secondary"
                    style={{
                        backgroundColor: '#94D2BD',
                        color: '#001219',
                        borderLeft: 'solid',
                        borderWidth: 'thin',
                        borderColor: 'rgba(148, 210, 189, 0.2)',
                        margin: '0.25rem 0.25rem'
                    }}
                    onClick={(event) => {
                        handleCategoryClick(categoryArray[i].category);
                        inputRef.current = categoryArray[i].category;
                        event.preventDefault();
                    }}
                    key={i}
                >
                    {categoryArray[i].category}
                </Button>
        }
        return CategoryButtonArray;
    }

    const conditionArray = [
        { condition: "New" },
        { condition: "Like New" },
        { condition: "Excellent" },
        { condition: "Good" },
        { condition: "Fair" },
        { condition: "Salvage" }
    ]

    const ConditionButton = () => {
        let ConditionButtonArray = [];
        for (let i = 0; i < conditionArray.length; i++) {

            ConditionButtonArray[i] =
                <Button
                    // type='submit'
                    variant="outline-secondary"
                    style={{
                        backgroundColor: '#94D2BD',
                        color: '#001219',
                        borderLeft: 'solid',
                        borderWidth: 'thin',
                        borderColor: 'rgba(148, 210, 189, 0.2)',
                        margin: '0.25rem 0.25rem'
                    }}
                    onClick={(event) => {
                        handleConditionClick(conditionArray[i].condition);
                        inputRef.current = conditionArray[i].condition;
                        event.preventDefault();
                    }}
                    key={i}
                >
                    {conditionArray[i].condition}
                </Button>
        }
        return ConditionButtonArray;
    }

    const handleClick = async (input) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        if (input === 'price') {
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: inputRef.current.value,
                        description: ViewableListingData.description,
                        category: ViewableListingData.category,
                        condition: ViewableListingData.condition,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        fileid: ViewableListingData.fileid,
                        media: ViewableListingData.media,
                        date: ViewableListingData.date,
                        location: ViewableListingData.location,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'condition') {
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: ViewableListingData.price,
                        description: ViewableListingData.description,
                        category: ViewableListingData.category,
                        condition: inputRef.current.value,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        fileid: ViewableListingData.fileid,
                        media: ViewableListingData.media,
                        date: ViewableListingData.date,
                        location: ViewableListingData.location,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'price') {
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: inputRef.current.value,
                        description: ViewableListingData.description,
                        category: ViewableListingData.category,
                        condition: ViewableListingData.condition,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        fileid: ViewableListingData.fileid,
                        media: ViewableListingData.media,
                        date: ViewableListingData.date,
                        location: ViewableListingData.location,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'location') {
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: ViewableListingData.price,
                        description: ViewableListingData.description,
                        category: ViewableListingData.category,
                        condition: ViewableListingData.condition,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        fileid: ViewableListingData.fileid,
                        media: ViewableListingData.media,
                        date: ViewableListingData.date,
                        location: inputRef.current.value,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'date') {
            try {
                await updateListing({
                    variables: {
                        updateListingId: ViewableListingData._id,
                        forsale: ViewableListingData.forsale,
                        wanted: ViewableListingData.wanted,
                        creatorid: ViewableListingData.creatorid,
                        title: ViewableListingData.title,
                        price: ViewableListingData.price,
                        description: ViewableListingData.description,
                        category: ViewableListingData.category,
                        condition: ViewableListingData.condition,
                        strikehandle: ViewableListingData.strikehandle,
                        cashapphandle: ViewableListingData.cashapphandle,
                        fileid: ViewableListingData.fileid,
                        media: ViewableListingData.media,
                        date: inputRef.current.value,
                        location: ViewableListingData.location,
                        latitude: ViewableListingData.latitude,
                        longitude: ViewableListingData.longitude,
                    }
                });
            }
            catch (e) { console.error(e); }
        }
    }

    const handleCategoryClick = async (input) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        console.log(input)
        try {
            await updateListing({
                variables: {
                    updateListingId: ViewableListingData._id,
                    forsale: ViewableListingData.forsale,
                    wanted: ViewableListingData.wanted,
                    creatorid: ViewableListingData.creatorid,
                    title: ViewableListingData.title,
                    price: ViewableListingData.price,
                    description: ViewableListingData.description,
                    category: input,
                    condition: ViewableListingData.condition,
                    strikehandle: ViewableListingData.strikehandle,
                    cashapphandle: ViewableListingData.cashapphandle,
                    fileid: ViewableListingData.fileid,
                    media: ViewableListingData.media,
                    date: ViewableListingData.date,
                    location: ViewableListingData.location,
                    latitude: ViewableListingData.latitude,
                    longitude: ViewableListingData.longitude,
                }
            });
        }
        catch (e) { console.error(e); }
    }
    const handleConditionClick = async (input) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        console.log(input)
        try {
            await updateListing({
                variables: {
                    updateListingId: ViewableListingData._id,
                    forsale: ViewableListingData.forsale,
                    wanted: ViewableListingData.wanted,
                    creatorid: ViewableListingData.creatorid,
                    title: ViewableListingData.title,
                    price: ViewableListingData.price,
                    description: ViewableListingData.description,
                    category: ViewableListingData.category,
                    condition: input,
                    strikehandle: ViewableListingData.strikehandle,
                    cashapphandle: ViewableListingData.cashapphandle,
                    fileid: ViewableListingData.fileid,
                    media: ViewableListingData.media,
                    date: ViewableListingData.date,
                    location: ViewableListingData.location,
                    latitude: ViewableListingData.latitude,
                    longitude: ViewableListingData.longitude,
                }
            });
        }
        catch (e) { console.error(e); }
    }

    const Characteritics = () => {
        return (
            <>
                {Auth.loggedIn && authenticatedUserListings ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Col>
                            <div style={{
                                borderColor: 'rgba(223, 164, 247, 0.62)',
                                backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                color: 'white',
                                fontSize: '3vh',
                                borderRadius: '5px',
                                margin: '1vh 0',
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'left'
                                }}>
                                    <p
                                        style={{
                                            fontSize: '2vh',
                                            margin: 'auto',
                                            padding: '1rem'
                                        }}>
                                        This is your listing!
                                    </p>
                                </Col>
                            </div>

                        </Col>
                    </div>
                    :
                    <Nav.Link as={Link} to='/listing/creator'>
                        {/* {ViewableListingData.creatorverified ? */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: 'fit-content',
                            margin: 'auto'
                        }}>
                            <Col>
                                <div style={{
                                    borderColor: 'rgba(223, 164, 247, 0.62)',
                                    backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                    color: 'white',
                                    fontSize: '3vh',
                                    borderRadius: '5px',
                                    margin: '1rem 0.25rem',
                                    padding: '8px'

                                }}>
                                        {ViewableListingData.creatorverified ? 
                                            <p style={{margin: 'auto', color: '#white'}}>View <i className="fa-solid fa-shield-halved" style={{color: '#00b8ff'}}></i> <strong style={{color: '#00b8ff'}}>{viewableListingFields[5].value}</strong> Profile</p>
                                        : 
                                            <p style={{margin: 'auto'}}>View <strong style={{color: '#EE9B00'}}>{viewableListingFields[5].value}</strong> Profile</p>
                                        }
                                </div>
                            </Col>
                        </div>
                    </Nav.Link>
                }
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Col>
                        <div style={{
                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                            borderRadius: '10px',
                            margin: '1vh 0',
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'left'
                            }}>
                                <p
                                    style={{
                                        fontSize: '2vh',
                                        margin: '0.5rem',
                                        color: 'white'
                                    }}>
                                    {viewableListingFields[3].label}
                                </p>
                            </Col>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'right'
                            }}>
                                <p style={{
                                    fontSize: '2vh',
                                    margin: '0.5rem',
                                    color: 'white',
                                    width: 'max-content'
                                }}>
                                    {viewableListingFields[3].value}
                                </p>
                            </Col>
                        </div>

                    </Col>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Col>
                        <div style={{
                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                            borderRadius: '10px',
                            margin: '1vh 0',
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'left'
                            }}>
                                <p
                                    style={{
                                        fontSize: '2vh',
                                        margin: '0.5rem',
                                        color: 'white'
                                    }}>
                                    {viewableListingFields[4].label}
                                </p>
                            </Col>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'right'
                            }}>
                                <p style={{
                                    fontSize: '2vh',
                                    margin: '0.5rem',
                                    color: 'white',
                                    width: 'max-content'
                                }}>
                                    {viewableListingFields[4].value}
                                </p>
                            </Col>
                        </div>
                    </Col>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Col>
                        {ViewableListingData.forsale ?
                            <div style={{
                                backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                borderRadius: '10px',
                                margin: '1vh 0',
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'left'
                                }}>
                                    <p
                                        style={{
                                            fontSize: '2vh',
                                            margin: '0.5rem',
                                            color: 'white'
                                        }}>
                                        {viewableListingFields[0].label}
                                    </p>
                                </Col>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'right'
                                }}>
                                    <p style={{
                                        fontSize: '2vh',
                                        margin: '0.5rem',
                                        color: 'white',
                                        width: 'max-content'
                                    }}>
                                        $ {viewableListingFields[0].value}
                                    </p>
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
                                                viewableListingFields[0].setedit(current => !current);
                                            }}
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        :
                                        null
                                    }
                                </Col>
                            </div>
                            :
                            null
                        }
                        {viewableListingFields[0].edit ?
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder={viewableListingFields[0].value}
                                    ref={inputRef}
                                    name={viewableListingFields[0].name}
                                    type="text"
                                    id={viewableListingFields[0].name}
                                    style={{
                                        background: 'transparent',
                                        borderLeft: 'solid',
                                        borderWidth: 'thin',
                                        borderColor: 'rgba(148, 210, 189, 0.2)',
                                        color: 'white'
                                    }}
                                    autoComplete="off"
                                />
                                <Button
                                    // type='submit'
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
                                        handleClick(viewableListingFields[0].name);
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Col>
                        <div style={{
                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                            borderRadius: '10px',
                            margin: '1vh 0',
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'left'
                            }}>
                                <p style={{
                                    fontSize: '2vh',
                                    margin: '0.5rem',
                                    color: 'white',
                                    width: 'max-content'
                                }}>
                                    {viewableListingFields[1].label}
                                </p>
                            </Col>
                            <Col style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'right'
                            }}>
                                <p style={{
                                    fontSize: '2vh',
                                    margin: '0.5rem',
                                    color: 'white'
                                }}>
                                    {viewableListingFields[1].value}
                                </p>
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
                                            viewableListingFields[1].setedit(current => !current);
                                        }}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    :
                                    null
                                }
                            </Col>
                        </div>
                        {viewableListingFields[1].edit ?
                            <CategoryButton />
                            :
                            null
                        }

                    </Col>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Col>
                        {ViewableListingData.forsale ?
                            <div style={{
                                backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                borderRadius: '10px',
                                margin: '1vh 0',
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'left'
                                }}>
                                    <p style={{
                                        fontSize: '2vh',
                                        margin: '0.5rem',
                                        color: 'white'
                                    }}>
                                        {viewableListingFields[2].label}
                                    </p>
                                </Col>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'right'
                                }}>
                                    <p style={{
                                        fontSize: '2vh',
                                        margin: '0.5rem',
                                        color: 'white',
                                        width: 'max-content'
                                    }}>
                                        {viewableListingFields[2].value}
                                    </p>
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
                                                viewableListingFields[2].setedit(current => !current);
                                            }}
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        :
                                        null
                                    }
                                </Col>
                            </div>
                            :
                            null
                        }
                        {viewableListingFields[2].edit ?
                            <ConditionButton />
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

export default ListingCharacteristics;