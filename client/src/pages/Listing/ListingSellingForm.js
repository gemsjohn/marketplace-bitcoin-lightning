import React, { useState, useReducer, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_LISTING, UPDATE_USER_LOCATION } from '../../utils/mutations';
import { imageKitListForm } from '../../utils/API';
import { UserData } from '../../components/ApolloQueries/UserData';
import moment from 'moment';
import Auth from '../../utils/auth';
import RenderImg from '../../assets/placeholder.jpg';
import SelectStyle from '../../Stylizer';
import '../../App.css';

// [[[VARIABLES]]]
// Imagekit.io dependencies
const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
const publicKey = `${process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}`;
const authenticationEndpoint = `${process.env.REACT_APP_AUTHENTICATION_ENDPOINT}`;
// Auxilliary
const listingImageArray = [];
const cardImageSetupArray = [];
let urlArrayContainer = false;
let urlArray = [];
let fileIDArray = [];
let imageKitUploadClickedBoolean = false;
let imageKitFilename;
// Moment.js
let momentDate = moment().format('MMMM Do YYYY');
let momentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
// Category
let selectedCategory = "";
let selectedCategoryBoolean = false;
let categoryButtonSelectedBoolean = false;
let CategoryButtonArray = [];
// Condition
let selectedCondition = "";
let selectedConditionBoolean = false;
let conditionButtonSelectedBoolean = false;
let ConditionButtonArray = [];
// Location
let locationInitializationSpiner = false;
let locationDetails = [];
let locationButtonArray = [];
let cityDetails = "";
let cityDetailsBool = false;
let mapsLatitude;
let mapsLongitude;
let selectedLocationVariable;
let selectedLocationBoolean = false;
// Stages
let sellingStage1 = false;
let sellingStage2 = false;

// [[[STYLING]]]
const coreFeatureAssetStyle = {
    borderRadius: 10,
    margin: '0.25rem auto',
    color: 'white'
}
const commonButtonStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[1].button,
    height: '3rem',
    width: '60vw',
    textDecoration: 'none',
    border: 'none',
    fontSize: '1rem'
}
const commonClearButtonStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[9].clearButton,
    height: 'auto',
    width: '8rem',
    textDecoration: 'none',
    border: 'none',
    fontSize: '1rem',
    margin: '0.25rem 1rem 0.25rem 1rem',
    color: '#242423'
}
const commonTagStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: '#48cae4',
    height: 'auto',
    width: '8rem',
    textDecoration: 'none',
    border: 'none',
    fontSize: '1rem',
    margin: '0.25rem 1rem 0.25rem 1rem',
    color: '#242423'
}
const commonShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[7].shopMenuPanel,
    padding: 10
}
const styles = {
    cardImage: {
        borderRadius: '10px 10px 0 0',
        height: 175,
        width: 250
    },
    cardText: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: '1.5vh',
    }
}

// [[[LOCATION]]]
// Clears the locationButtonArray variable after a location has been selected.
const locationUpdate = (locationState, action) => {
    switch (action.type) {
        case 'add':
            return { locale: null }
        case 'remove':
            locationButtonArray = [];
            return { locale: locationButtonArray }
        default:
            return locationState
    }
}

// [[[CATEGORY]]]
// Contains all category options
const categoryArray = [
    "Apparel",
    "Automotive",
    "Collectables",
    "Electronics",
    "Hardware",
    "Health and Beauty",
    "Household",
    "Pet Supplies",
    "Sporting Goods",
    "Toys",
    "Other"
]
// Triggered when user selects a category button
const categoryArrayHandler = (string) => {
    selectedCategory = string;
}
// Establishes the selected category
const categoryUpdate = (categoryState, action) => {
    switch (action.type) {
        case 'add':
            categoryButtonSelectedBoolean = true;
            return { category: selectedCategory }
        case 'remove':
            categoryButtonSelectedBoolean = false;
            selectedCategory = "";
            return { category: selectedCategory }
        default:
            return categoryState
    }
}

// [[[CONDITION]]]
// Contains all condition options
const conditionArray = [
    "New",
    "Like New",
    "Excellent",
    "Good",
    "Fair",
    "Salvage"
]
// Triggered when user selects a condition button
const conditionArrayHandler = (string) => {
    selectedCondition = string;
}
// Establishes the selected condition
const conditionUpdate = (conditionState, action) => {
    switch (action.type) {
        case 'add':
            conditionButtonSelectedBoolean = true;
            return { condition: selectedCondition }
        case 'remove':
            conditionButtonSelectedBoolean = false;
            selectedCondition = "";
            return { condition: selectedCondition }
        default:
            return conditionState
    }
}
// [[[SPINNER]]]
// Loads the React Bootstrap Spinner
function LoadingSpinner() {
    return (
        <Spinner style={{ margin: '10px' }} animation="border" role="status"></Spinner>
    );
}


// [[[CREATE NEW LISTING FORM]]]
function ListingSellingForm() {
    // [[[CATEGORY]]]
    // Hooks
    const initialCategoryState = { category: null }
    const [categoryState, categoryDispatch] = useReducer(categoryUpdate, initialCategoryState)
    const [showCategoryClearButton, setShowCategoryClearButton] = useState(true);
    // Call categoryUpdate > switch > case > add & show the category clear button
    const categoryAdd = () => {
        categoryDispatch({ type: 'add' });
        setShowCategoryClearButton(true);
    };
    // Call categoryUpdate > switch > case remove & remove the category clear button
    const categoryRemove = () => {
        categoryDispatch({ type: 'remove' });
        setShowCategoryClearButton(false);

    };
    // Aggregate all categories listed in categoryArray into CategoryButtonArray. 
    const CategoryButtons = () => {
        for (let i = 0; i < categoryArray.length; i++) {
            CategoryButtonArray[i] =
                <div key={i}>
                    <span onClick={() => categoryArrayHandler(categoryArray[i])} style={{ padding: '10px' }}>
                        <button onClick={categoryAdd} style={{ ...commonButtonStyles }}>
                            {categoryArray[i]}
                        </button>
                    </span>
                </div>
        }
        return CategoryButtonArray;
    }
    CategoryButtons();

    // If a category has been selected then selectedCategoryBoolean is set to true
    if (selectedCategory !== "") {
        selectedCategoryBoolean = true;
    } else {
        selectedCategoryBoolean = false;
    }

    // [[[CONDITION]]]
    // Hooks
    const initialConditionState = { condition: null }
    const [conditionState, conditionDispatch] = useReducer(conditionUpdate, initialConditionState)
    const [showConditionClearButton, setShowConditionClearButton] = useState(true);

    // Call conditionUpdate > switch > case > add & show the condition clear button
    const conditionAdd = () => {
        conditionDispatch({ type: 'add' });
        setShowConditionClearButton(true);
        sellingStage2 = true;
    };
    // Call conditionUpdate > switch > case > add & show the condition clear button.
    const conditionRemove = () => {
        conditionDispatch({ type: 'remove' });
        setShowConditionClearButton(false);
        sellingStage2 = false;
    };
    // Aggregate all categories listed in conditionArray into ConditionButtonArray. 
    const ConditionButtons = () => {
        for (let i = 0; i < conditionArray.length; i++) {
            ConditionButtonArray[i] =
                <div key={i}>
                    <span
                        onClick={() => conditionArrayHandler(conditionArray[i])}
                        style={{ padding: '10px' }}
                    >
                        <button onClick={conditionAdd} style={{ ...commonButtonStyles }}>
                            {conditionArray[i]}
                        </button>
                    </span>
                </div>
        }
        return ConditionButtonArray;
    }
    ConditionButtons();

    // If a condition has been selected then selectedConditionBoolean is set to true
    if (selectedCondition !== "") {
        selectedConditionBoolean = true;
    } else {
        selectedConditionBoolean = false;
    }

    // [[[UPLOAD IMAGE AND RENDER]]]
    // Hook resNameBool starts out false, then updates to true upon image upload. Returns to false once the image has been rendered.
    const [resNameBool, setresNameBool] = useState(false);

    // Handles image upload error
    const onError = err => {
        console.log("Error", err);
    };

    // Handles successful image upload.
    const onSuccess = res => {
        // console.log(res)
        imageKitFilename = res.name;
        imageKitUploadClickedBoolean = true;
        setresNameBool(true);
        urlArray.push(res.url); // Store imagekit.io URL in urlArray
        fileIDArray.push(res.fileId)
        listingImageArray.push(res.url); // Store imagekit.io URL in the array that handles the rendering on page
    };

    // Appends the uploaded images to the page
    const appendReducer = (stateAppend, actionAppend) => {
        switch (actionAppend.type) {
            case 'increment':
                urlArrayContainer = true;
                setresNameBool(false)
                return { append: cardImageSetupArray }
            case 'decrement':
                if (urlArray === 0) {
                    urlArrayContainer = false;
                } else {
                    urlArrayContainer = true;
                }
                imageKitUploadClickedBoolean = false;
                return { append: cardImageSetupArray }
            default:
                return stateAppend
        }
    }

    const initialState = {
        append:
        <div></div>
            // <div
            //     style={{
            //         display: 'flex',
            //         flexWrap: 'wrap',
            //         justifyContent: 'center',
            //         border: 'solid',
            //         borderWidth: 'thin',
            //         borderColor: 'rgba(148, 210, 189, 0.2)',
            //         width: '60vw',
            //         borderRadius: '10px',
            //         padding: '1rem'
            //     }}
            // >
            //     <p style={{margin: 'auto'}}>IMAGE</p>
            // </div>
    }

    // Hook stateAppend starts out with the generic placeholder image and then updates to the uploaded images
    const [stateAppend, dispatchAppend] = useReducer(appendReducer, initialState)

    const increment = () => dispatchAppend({ type: 'increment' })
    const decrement = () => dispatchAppend({ type: 'decrement' })

    const RemoveAppendedImages = (i) => {
        let fileIDRemove;
        decrement();
        fileIDRemove = { id: fileIDArray[i] };
        imageKitListForm(fileIDRemove);
        cardImageSetupArray.splice(i, 1);
        listingImageArray.splice(i, 1);
        urlArray.splice(i, 1);
        fileIDArray.splice(i, 1);
    }
    const UploadImages = () => {
        return (
            <IKContext
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticationEndpoint={authenticationEndpoint}
            >
                <Col style={{}}>
                    <div>
                        <p style={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0.5rem auto auto auto'
                        }}>
                            Upload Image(s)
                        </p>
                    </div>
                    <div style={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                        <IKUpload
                            fileName="future.png"
                            onError={onError}
                            onSuccess={onSuccess}
                            hidden
                            id="upload"
                        />
                        <label
                            htmlFor="upload"
                            style={{
                                backgroundColor: 'indigo',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '0.3rem',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                fontSize: '3vh',
                                width: 'inherit'
                            }}
                        >
                            Choose File
                        </label>
                        <p
                            id="file-chosen"
                            style={{ fontSize: '1rem' }}
                        >
                            {imageKitUploadClickedBoolean ? String(imageKitFilename) : "No file chosen"}
                        </p>
                    </div>
                </Col>
            </IKContext>
        )
    }

    // [[[IMAGE RENDER]]]
    const appendImages = () => {
        for (let i = 0; i < listingImageArray.length; i++) {
            cardImageSetupArray[i] =
                <div
                    style={{ ...commonShopPanelStyles }}
                    key={i}
                >
                    <div>
                        <div style={{
                            backgroundColor: '#16db65',
                            height: 'auto',
                            width: 'auto',
                            borderRadius: '10px',
                            position: 'absolute',
                            margin: '0.5rem',
                            padding: '0.25rem'
                        }}>
                            <p style={{
                                fontSize: '1rem',
                                margin: '0.25rem'
                            }}>Image {i + 1}</p>
                        </div>
                        <IKContext urlEndpoint={urlEndpoint}>
                            <IKImage
                                src={listingImageArray[i]}
                                style={styles.cardImage}
                                transformation={[{
                                    height: 175,
                                    width: 250,
                                    cropMode: 'fo-custom',
                                    bg: 66000000,
                                    q: 100
                                }]}
                            />
                        </IKContext>
                        <div style={styles.cardText}>
                            <p style={{
                                margin: '0.5rem',
                                fontSize: '1rem'
                            }}>Placeholder Title</p>
                            <p style={{
                                margin: '0.25rem',
                                fontSize: '0.75rem'
                            }}>{momentDateTime}</p>
                        </div>
                        <Button
                            style={{ ...commonClearButtonStyles }}
                            onClick={() => RemoveAppendedImages(i)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
        }
        return cardImageSetupArray;
    };
    appendImages();

    // [[[LOAD SPINNER]]]
    let renderBtn;
    if (resNameBool) {
        renderBtn =
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}><LoadingSpinner /></div>;
        setTimeout(() => {
            increment();
        }, 1000)
    }

    // [[[LISTING HOOKS]]]
    const [listingFormData, setListingFormData] =
        useState({
            title: '',
            price: '',
            description: ''
        });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const history = useHistory();


    // [[[APOLLO SERVER]]]
    const [addListing, { error }] = useMutation(ADD_LISTING);
    const [updateUserLocation] = useMutation(UPDATE_USER_LOCATION);
    const [priceRegex, setPriceRegex] = useState(true);
    const me = UserData();

    // [[[FORM SUBMISSION]]]
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        function validate(s) {
            var rgx = /^[0-9]*\.?[0-9]*$/;

            if (s.match(rgx) === null) { setPriceRegex(false) }
            else { setPriceRegex(true) }
        }
        if (name === 'price') { validate(value) }

        setListingFormData({
            ...listingFormData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            await addListing({
                variables: {
                    ...listingFormData,
                    forsale: true,
                    wanted: false,
                    category: selectedCategory,
                    condition: selectedCondition,
                    fileid: fileIDArray,
                    media: urlArray,
                    date: momentDateTime,
                    location: selectedLocationVariable,
                    latitude: mapsLatitude.toString(),
                    longitude: mapsLongitude.toString(),
                    watchlist: [],
                    pfclist: []
                }
            });
            history.push("/complete");
            window.location.reload(false)

        } catch (e) {
            console.error(e);
        }

    };

    // [[[LOCATION HOOKS]]]
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userFormData, setUserFormData] = useState({ city: '' });
    const [locationValidated] = useState(false);
    const [showLocationSearchBar, setShowLocationSearchBar] = useState(true);

    // Whatever value has been entered into the location search gets passed through this function
    const locationHandleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    // Called when the location search is submitted
    const locationHandleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setUserFormData({
            city: ''
        });
        GetWeatherData(userFormData.city);

        // Display list of cities after 1 second
        setTimeout(() => {
            setLoading(!loading);
            locationInitializationSpiner = false;
            setShow(!show);
        }, 1000);
    }
    // Search by city name via openweathermap API
    const GetWeatherData = (input) => {
        var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=` + input + `&limit=5&appid=${process.env.REACT_APP_OPENWEATHERMAP_API}`;
        fetch(apiUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        DisplaySearchResult(data)
                    });
                } else {
                    console.log("Error: " + response.statusText)
                }
            })
            .catch(function (error) {
                console.log("Unable to connect to OpenWeather");
            });
    };

    // Display city search results
    const DisplaySearchResult = (city) => {
        for (var i = 0; i < city.length; i++) {
            let cityName = city[i].name;
            let cityState = city[i].state;
            let cityCountry = city[i].country;
            let cityLatitude = city[i].lat;
            let cityLongitude = city[i].lon
            locationDetails[i] = [
                { locale: cityName + ", " + cityState + ", " + cityCountry },
                { latitude: cityLatitude, longitude: cityLongitude }
            ]
        }
        LocationButtons(locationDetails);
    };

    // Aggregate locations into locationButtonArray
    const LocationButtons = (location) => {
        for (let i = 0; i < location.length; i++) {
            locationButtonArray[i] =
                <button
                    style={{ ...commonButtonStyles, height: 'auto' }}
                    onClick={() => selectedLocation(location[i])}
                    key={i}
                >
                    <p style={{ margin: '0.5rem' }}>
                        {location[i][0].locale}
                    </p>
                </button>
        }
        return locationButtonArray;
    }

    // Take the selected location and update the following variables
    const selectedLocation = (x) => {
        selectedLocationVariable = x[0].locale;
        mapsLatitude = x[1].latitude;
        mapsLongitude = x[1].longitude;
        cityDetails = x[0].locale;
        sellingStage1 = true;
        selectedLocationBoolean = true;
        locationRemove();
        setShowLocationSearchBar(false);
    }

    const LocationSubmitButton = () => {
        locationInitializationSpiner = true;
    }

    // Updated Location
    const initialLocationState = { locale: null }
    const [locationState, locationDispatch] = useReducer(locationUpdate, initialLocationState)

    const locationAdd = () => {
        window.location.reload(false);
        setTimeout(() => {
            locationDispatch({ type: 'add' });
            setShowLocationSearchBar(true);
            cityDetails = "";
            cityDetailsBool = false;
            sellingStage1 = false;
            selectedLocationBoolean = false;
        }, 250)
    };
    const locationRemove = () => {
        locationDispatch({ type: 'remove' });
        setShowLocationSearchBar(false);
    };

    if (cityDetails !== "") {
        cityDetailsBool = true;
    }

    useEffect(() => {
        // console.log(locationState.locale)
    }, [locationState.locale])

    return (
        <div>
            <>
                <Row style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <p style={{
                        paddingTop: '5vh',
                        fontSize: '3rem',
                        color: '#E9D8A6'
                    }}>CREATE A FOR SALE AD</p>
                </Row>
                {/* <p style={{ padding: '0.5rem', paddingTop: '5vh' }}>Create New Listing</p> */}
                <p>{momentDate}</p>
                {/* [[[LOCATION]]]*/}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    margin: '5px'
                }}>
                    <p style={{
                        margin: '1vh 1vw 0 1vw',
                        fontSize: '1rem'
                    }}>
                        {!sellingStage1 ? "Search for your location by city name:" : null}
                    </p>
                </div>
                {showLocationSearchBar && !cityDetailsBool &&
                    <>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'left',
                            margin: 'auto'
                            // margin: '5px'
                        }}>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'left',
                            marginTop: '0.5rem'
                        }}>
                            <Form
                                noValidate
                                validated={locationValidated}
                                onSubmit={locationHandleFormSubmit}
                                style={{ margin: 'auto' }}
                            >
                                <InputGroup style={{ width: '70vw', textAlign: 'left' }}>
                                    <Form.Control
                                        type='text'
                                        placeholder='City Name'
                                        name='city'
                                        onChange={locationHandleInputChange}
                                        value={userFormData.city}
                                        style={{
                                            outline: 'none',
                                            backgroundColor: '#e9ecef',
                                            color: '#001219',
                                            display: 'flex',
                                            justifyContent: 'left',
                                            // width: '80vw',
                                            padding: '1.5rem',
                                            border: 'solid',
                                            borderColor: 'white',
                                            borderRadius: '10px',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        required
                                    />
                                </InputGroup>
                                <Button
                                    type='submit'
                                    variant='success'
                                    onClick={LocationSubmitButton}
                                    style={{ width: '70vw', margin: '0.5rem auto' }}
                                >
                                    Search
                                </Button>
                            </Form>
                        </div>


                    </>
                }
                <div>
                    {!show && locationInitializationSpiner &&
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}><LoadingSpinner /></div>}

                    {show && !locationInitializationSpiner &&
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>{locationButtonArray}</div>}
                </div>
            </>

            {sellingStage1 &&
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleFormSubmit}
                >
                    {/* show alert if server response is bad */}
                    <Alert
                        dismissible
                        onClose={() => setShowAlert(false)}
                        show={showAlert}
                        variant='danger'
                    >
                        Something went wrong with your signup!
                    </Alert>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        margin: '0 0.5rem 0 0.5rem'
                    }}>
                        <Row style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            {/* [[[CITY: Tag & clear button]]] */}
                            <div style={{ margin: '0.25rem' }}>
                                {selectedLocationBoolean ?
                                    <>
                                        <Row>
                                            <Button style={{ ...commonTagStyles }}>
                                                Location: {cityDetails}
                                            </Button>
                                        </Row>
                                        <Row>
                                            {!selectedCategoryBoolean &&
                                                <Button
                                                    onClick={locationAdd}
                                                    style={{ ...commonClearButtonStyles }}
                                                >Clear Location</Button>
                                            }

                                            {selectedCategoryBoolean &&
                                                <Button
                                                    onClick={categoryRemove}
                                                    style={{ ...commonClearButtonStyles }}
                                                    disabled
                                                >Clear Location</Button>
                                            }
                                        </Row>
                                    </>
                                    : null
                                }
                            </div>
                            {/* [[[CATEGORY: Tag & clear button]]] */}
                            <div style={{ margin: '0.25rem' }}>
                                {selectedCategoryBoolean ?
                                    <>
                                        <Row>
                                            <Button style={{ ...commonTagStyles }}>
                                                Category: {selectedCategory}
                                            </Button>
                                        </Row>
                                        <Row>
                                            {showCategoryClearButton && selectedCategoryBoolean && !sellingStage2 &&
                                                <Button
                                                    onClick={categoryRemove}
                                                    style={{ ...commonClearButtonStyles }}
                                                >Clear Category</Button>
                                            }

                                            {showCategoryClearButton && selectedCategoryBoolean && sellingStage2 &&
                                                <Button
                                                    onClick={categoryRemove}
                                                    style={{ ...commonClearButtonStyles }}
                                                    disabled
                                                >Clear Category</Button>
                                            }
                                        </Row>
                                    </>
                                    : null
                                }
                            </div>
                            {/* [[[CONDITION: Tag & clear button]]] */}
                            <div style={{ margin: '0.25rem' }}>
                                {selectedConditionBoolean ?
                                    <>
                                        <Row>
                                            <Button style={{ ...commonTagStyles }}>
                                                Condition: {selectedCondition}
                                            </Button>
                                        </Row>
                                        <Row>
                                            {showConditionClearButton && selectedConditionBoolean && sellingStage2 &&
                                                <Button
                                                    onClick={conditionRemove}
                                                    style={{ ...commonClearButtonStyles }}
                                                >Clear Condition</Button>
                                            }

                                        </Row>
                                    </>
                                    : null
                                }
                            </div>
                        </Row>
                    </div>
                    {/*[[[CATEGORY]]]*/}
                    <div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            margin: '0.25rem'
                        }}>
                            <p style={{
                                margin: '1vh 1vw 1vh 1vw',
                                fontSize: '1rem'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    {selectedCategoryBoolean ? null : "Select a category:"}
                                </span>
                            </p>

                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            {categoryButtonSelectedBoolean ? null : CategoryButtonArray}
                        </div>
                    </div>
                    {/*[[[CONDITION]]]*/}
                    {showCategoryClearButton && selectedCategoryBoolean &&
                        <div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                margin: '0.25rem'
                            }}>
                                <p style={{
                                    margin: '1vh 1vw 1vh 1vw',
                                    fontSize: '1rem'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {selectedConditionBoolean ? null : "Select a condition:"}
                                    </span>
                                </p>

                            </div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {conditionButtonSelectedBoolean ? null : ConditionButtonArray}
                            </div>
                        </div>}
                    {/*[[[FORM]]]*/}
                    {sellingStage2 &&
                        <>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                backgroundColor: '#202C39',
                                width: '60vw',
                                margin: 'auto',
                                borderRadius: '20px'
                            }}>
                                {/* ADD IKUPLOAD HERE */}
                                <UploadImages />
                            </div>
                            {/* [[[APPEND IMAGES AND LOADING SPINNER AS NEEDED]]] */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                margin: '2rem'
                            }}>{stateAppend.append}</div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                margin: '2rem'
                            }}>{renderBtn}</div>
                            {onSuccess}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {/* [[[TITLE]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <div>
                                        <p>Title</p>
                                    </div>
                                    <InputGroup className="mb-3">
                                        {/* <InputGroup.Text id="basic-addon1">Title</InputGroup.Text> */}
                                        <Form.Control
                                            type='text'
                                            placeholder='Title'
                                            name='title'
                                            onChange={handleInputChange}
                                            style={{
                                                outline: 'none',
                                                background: 'transparent',
                                                color: 'white',
                                                display: 'flex',
                                                justifyContent: 'left',
                                                width: '60vw',
                                                padding: '1.5rem',
                                                border: 'solid',
                                                borderRadius: '10px',
                                                alignItems: 'center'
                                            }}
                                            value={listingFormData.title}
                                            required
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Title is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[PRICE]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <div>
                                        {priceRegex ?
                                            <p>Price</p>
                                            :
                                            <Row style={{ marginLeft: '0' }}>
                                                <p>Price: &nbsp;</p>
                                                <p style={{ color: '#EE9B00' }}>Numbers and decimals only.</p>
                                            </Row>
                                        }
                                    </div>
                                    <InputGroup className="mb-3">
                                        {/* <InputGroup.Text id="basic-addon1">Price</InputGroup.Text> */}
                                        <Form.Control
                                            type='text'
                                            placeholder='Name your price'
                                            name='price'
                                            onChange={handleInputChange}
                                            style={priceRegex ? {
                                                outline: 'none',
                                                background: 'transparent',
                                                color: 'green',
                                                display: 'flex',
                                                justifyContent: 'left',
                                                width: '60vw',
                                                padding: '1.5rem',
                                                border: 'solid',
                                                borderRadius: '10px',
                                                alignItems: 'center'
                                            }
                                                :
                                                {
                                                    outline: 'none',
                                                    background: 'transparent',
                                                    color: 'red',
                                                    display: 'flex',
                                                    justifyContent: 'left',
                                                    width: '60vw',
                                                    padding: '1.5rem',
                                                    border: 'solid',
                                                    borderRadius: '10px',
                                                    alignItems: 'center'
                                                }
                                            }
                                            value={listingFormData.price}
                                            // style={priceRegex ? { color: 'green' } : { color: 'red' }}
                                            required
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Price is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[DESCRIPTION]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <div>
                                        <p>Description</p>
                                    </div>
                                    <InputGroup className="mb-3">
                                        {/* <InputGroup.Text id="basic-addon1">Description</InputGroup.Text> */}
                                        <Form.Control
                                            as='textarea'
                                            rows={3}
                                            placeholder='Describe your listing'
                                            name='description'
                                            onChange={handleInputChange}
                                            style={{
                                                outline: 'none',
                                                background: 'transparent',
                                                color: 'white',
                                                display: 'flex',
                                                justifyContent: 'left',
                                                width: '60vw',
                                                padding: '1.5rem',
                                                border: 'solid',
                                                borderRadius: '10px',
                                                alignItems: 'center'
                                            }}
                                            value={listingFormData.description}
                                            required
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Description is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[DATE/TIME]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <InputGroup>
                                        <Row style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            width: '70vw'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem 0',
                                                    color: 'white'
                                                }}>
                                                    DATE
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '1.5vh',
                                                    margin: 'auto 1rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {momentDateTime}
                                                </p>
                                            </Col>
                                        </Row>
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Date/Time is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[LOCATION]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <InputGroup>
                                        <Row style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            width: '70vw'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem 0',
                                                    color: 'white'
                                                }}>
                                                    LOCATION
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '1.5vh',
                                                    margin: 'auto 1rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {selectedLocationVariable}
                                                </p>
                                            </Col>
                                        </Row>
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Date/Time is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[CATEGORY]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left' }}>
                                    <InputGroup>
                                        <Row style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            width: '70vw'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem 0',
                                                    color: 'white'
                                                }}>
                                                    CATEGORY
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '1.5vh',
                                                    margin: 'auto 1rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {selectedCategory}
                                                </p>
                                            </Col>
                                        </Row>
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Category is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[CONDITION]]] */}
                                <Form.Group style={{ width: '70vw', textAlign: 'left', alignItems: 'center' }}>
                                    <InputGroup>
                                        <Row style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            width: '70vw'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem 0',
                                                    color: 'white'
                                                }}>
                                                    CONDITION
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '1.5vh',
                                                    margin: 'auto 1rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {selectedCondition}
                                                </p>
                                            </Col>
                                        </Row>
                                    </InputGroup>
                                    <Form.Control.Feedback type='invalid'>Condition is required!</Form.Control.Feedback>
                                </Form.Group>
                                {/* [[[SUBMIT BUTTON]]] */}
                                {priceRegex ?
                                    <Button
                                        disabled={!(
                                            listingFormData.title &&
                                            listingFormData.price &&
                                            listingFormData.description &&
                                            // listingFormData.category &&
                                            // listingFormData.condition &&
                                            urlArrayContainer
                                        )}
                                        type='submit'
                                        variant='success'
                                        style={{ width: '70vw', marginBottom: '20vh' }}
                                    >
                                        Submit
                                    </Button>
                                    :
                                    <Form.Group style={{ width: '70vw', marginBottom: '20vh' }}>
                                        <p style={{ color: 'red' }}>
                                            Price should only include numbers or decimals.
                                        </p>
                                    </Form.Group>
                                }
                            </div>
                        </>}
                </Form>}

            {error && <div>Create Listing Failed</div>}

        </div>
    );
}

export default ListingSellingForm;