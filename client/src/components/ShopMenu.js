import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import Stylizer from '../Stylizer';
import SelectStyle from '../Stylizer';
import {
    Button,
    Form,
    InputGroup,
    Spinner
} from 'react-bootstrap';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'dotenv/config';


// [[[VARIABLES]]] 
// Location
export let cityDetails = "";
let locationInitializationSpiner = false;
let locationDetails = [];
let locationButtonArray = [];
let cityDetailsBool = false;
let mapsLatitude;
let mapsLongitude;
// Category
export let selectedCategory = "";
let selectedCategoryBoolean = false;
let categoryButtonSelectedBoolean = false;

// [[[STYLING]]]
const coreFeatureAssetStyle = {
    borderRadius: 10,
    margin: 10,
    color: 'white'
}
const commonButtonStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[1].button,
    height: '5vh',
    width: '16rem',
    textDecoration: 'none',
    border: 'none',
    fontSize: '10px'
}
const commonShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[7].shopMenuPanel,
    padding: 10
}

// [[[SPINNER]]]
// Loads the React Bootstrap Spinner.
function LoadingSpinner() {
    return (
      <Spinner style={{margin: '10px'}} animation="border" role="status"></Spinner>
    );
}

// [[[LOCATION]]]
// Clears the locationButtonArray variable after a location has been selected.
const locationUpdate = (locationState, action) => {
    switch (action.type) {
        case 'add':
            return { locale: null}
        case 'remove':
            locationButtonArray = [];
            return { locale: locationButtonArray }
        default:
            console.log('This is the default')
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
    "Toys"
]
// Triggered when user selects a category button
const categoryArrayHandler = (string) => {
    selectedCategory = string;
}
// Updates the selectedCateogy variable
const categoryUpdate = (categoryState, action) => {
    switch (action.type) {
        case 'add':
            categoryButtonSelectedBoolean = true;
            return { category: selectedCategory }
        case 'remove':
            categoryButtonSelectedBoolean = false;
            selectedCategory = "";
            return { category: selectedCategory}
        default:
            console.log('This is the default')
            return categoryState
    }
}
// [[[SHOPMENU]]]
const ShopMenu = () => {
    // [[[VARIABLES]]]
    let CategoryButtonArray = [];

    // [[[CATEGORY HOOKS]]]
    const initialCategoryState = { category: null }
    const [categoryState, categoryDispatch] = useReducer(categoryUpdate, initialCategoryState)
    const [showCategoryClearButton, setShowCategoryClearButton] = useState(true);
    // Call categoryUpdate > switch > case > add & show the category clear button
    const add = () => {
        categoryDispatch({ type: 'add' });
        setShowCategoryClearButton(true);
    };
    // Call categoryUpdate > switch > case > add & remove the category clear button
    const remove = () => {
        categoryDispatch({ type: 'remove' });
        setShowCategoryClearButton(false);
    };

    // Aggregate all categories listed in categoryArray into CategoryButtonArray
    const CategoryButtons = () => {
        for (let i = 0; i < categoryArray.length; i++) {
            CategoryButtonArray[i] =
                <div key={i}>
                    <span onClick={() => categoryArrayHandler(categoryArray[i])} style={{ padding: '10px' }}>
                        <button onClick={add} style={{ ...commonButtonStyles }}>
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
    }

    // [[[LOCATION]]]
    // Hooks
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userFormData, setUserFormData] = useState({ city: '' });
    const [validated] = useState(false);
    const [showLocationClear, setShowLocationClear] = useState(true);
    const [showLocationSearchBar, setShowLocationSearchBar] = useState(true);

    // Whatever value has been entered into the location search gets passed through this function
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };
    // Called when the location search is submitted
    const handleFormSubmit = async (event) => {
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
                <button style={{ ...commonButtonStyles }} onClick={() => selectedLocation(location[i])} key={i}>
                    {location[i][0].locale}
                </button>
        }
        return locationButtonArray;
    }

    // Take the selected location and update the following variables
    const selectedLocation = (x) => {
        mapsLatitude = x[1].latitude;
        mapsLongitude = x[1].longitude;
        Map();
        cityDetails = x[0].locale;
        locationRemove();
        setShowLocationSearchBar(false);
    }

    const Map = () => {
        return (
            <>
            <MapContainer center={[mapsLatitude, mapsLongitude]} zoom={13} scrollWheelZoom={false} style={{width: '70vw', height: '20vh'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Marker position={[mapsLatitude, mapsLongitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
            </MapContainer>
            </>
        )
    }

    const LocationSubmitButton = () => {
        locationInitializationSpiner = true;
    }

    // Updated Location
    const initialLocationState = { locale: null }
    const [locationState, locationDispatch] = useReducer(locationUpdate, initialLocationState)

    const locationAdd = () => {
        locationDispatch({ type: 'add' });
        setShowLocationSearchBar(true);
        setShowLocationClear(false);
        cityDetails = "";
        cityDetailsBool = false;
    };
    const locationRemove = () => {
        locationDispatch({ type: 'remove' });
        setShowLocationSearchBar(false);
        setShowLocationClear(true);
        
    };

    if (cityDetails !== "") {
        cityDetailsBool = true;
    }

    useEffect(() => {
        console.log(locationState.locale)
    }, [locationState.locale])

    return (
        <div>
            <div style={{...commonShopPanelStyles}}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                <p style={{ margin: '1vh 1vw 0 1vw', fontSize: '1rem' }}><span style={{fontWeight: 'bold'}}>Location: </span>{cityDetails}</p>
                </div>
                {showLocationSearchBar && !cityDetailsBool && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                        <InputGroup style={{ width: '70vw', textAlign: 'left' }}>
                            <Form.Control
                                type='text'
                                placeholder='Enter City Name'
                                name='city'
                                onChange={handleInputChange}
                                value={userFormData.city}
                                required />
                            <Button
                                type='submit'
                                variant='success'
                                onClick={LocationSubmitButton}>
                                Search
                            </Button>
                        </InputGroup>
                    </Form>
                </div>}
                <div>
                    {!show && locationInitializationSpiner && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}><LoadingSpinner /></div>}
                    {show && !locationInitializationSpiner && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>{locationButtonArray}</div> }
                </div>
                <div>
                    {showLocationClear && cityDetailsBool &&
                        <> 
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                            <Map />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                            <Button onClick={locationAdd} style={{ ...commonButtonStyles }}>Clear</Button>
                        </div>
                        </>
                    }
                </div>
            </div>
            <div style={{...commonShopPanelStyles}}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                <p style={{ margin: '1vh 1vw 0 1vw', fontSize: '1rem' }}><span style={{fontWeight: 'bold'}}>Category: </span>{selectedCategory}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {categoryButtonSelectedBoolean ? null : CategoryButtonArray}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '5px' }}>
                    {showCategoryClearButton && selectedCategoryBoolean && <Button onClick={remove} style={{ ...commonButtonStyles }}>Clear</Button>}
                </div>
                
            </div>
        </div>
    )
}


export default ShopMenu;