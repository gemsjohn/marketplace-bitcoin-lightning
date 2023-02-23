import React, { useState, useRef, useReducer } from 'react';
import { Button, Form, InputGroup, Col, Spinner } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { UPDATE_USER, LOGIN_USER, UPDATE_USER_PASSWORD } from '../../utils/mutations';
import VerificationInvoiceAndQuote from '../../components/VerificationInvoiceAndQuote';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { imageKitListForm } from '../../utils/API';
import RenderImg from '../../assets/placeholder.jpg';
import Auth from '../../utils/auth';
import SelectStyle from '../../Stylizer';
import moment from 'moment';

const UserDetails = () => {
    const { data: meData } = useQuery(GET_ME);
    const me = meData?.me || {};
    const [updateUser] = useMutation(UPDATE_USER);
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);
    const inputRef = useRef(null);
    const [userDetailsDropdown, setUserDetailsDropdown] = useState(false);
    const [showEditableFieldProfilePicture, setShowEditableFieldProfilePicture] = useState(false);
    const [showEditableFieldVerified, setShowEditableFieldVerified] = useState(false);
    const [showEditableFieldPrimaryLocation, setShowEditableFieldPrimaryLocation] = useState(false);
    const [showEditableFieldUsername, setShowEditableFieldUsername] = useState(false);
    const [showEditableFieldEmail, setShowEditableFieldEmail] = useState(false);
    const [showEditableFieldUnlock, setShowEditableFieldUnlock] = useState(false);
    const [showEditableFieldPassword, setShowEditableFieldPassword] = useState(false);
    const [userFormData, setUserFormData] = useState({ username: '', password: '' });
    const [locationFormData, setLocationFormData] = useState({ primarylocation: '' });
    const [valueProfilePicture, setValueProfilePicture] = useState('');
    const [valueVerified, setValueVerified] = useState(false);
    const [valuePrimaryLocation, setValuePrimaryLocation] = useState(false);
    const [valueUsername, setValueUsername] = useState('');
    const [valueEmail, setValueEmail] = useState('');
    const [validated] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [imageReadyForAppend, setImageReadyForAppend] = useState(false);
    const [fileID, setFileID] = useState('');
    const [locationValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [stateLocationButtonArray, setStateLocationButtonArray] = useState([]);
    const [selectedLocationVariable, setSelectedLocationVariable] = useState('');
    const [selectedLocationVariableBool, setSelectedLocationVariableBool] = useState(false);
    const [locationInitializationSpiner, setLocationInitializationSpiner] = useState(false);
    const [primaryLocation, setPrimaryLocation] = useState('');

    const [login, { error }] = useMutation(LOGIN_USER);

    let locationDetails = [];
    let locationButtonArray = [];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleUserDetailsDropdown = () => {
        if (userDetailsDropdown) { setUserDetailsDropdown(false) }
        else { setUserDetailsDropdown(true) }
    }

    const setValues = () => {
        setValueProfilePicture(me?.profilepicture)
        setValueVerified(me?.verified)
        setValueUsername(me?.username)
        setValueEmail(me?.email)
        setValuePrimaryLocation(me?.primarylocation)
    }

    const userDetailFields = [
        {
            label: 'Username',
            type: 'text',
            value: valueUsername,
            edit: showEditableFieldUsername,
            setedit: setShowEditableFieldUsername,
            id: 0,
            name: 'username'
        },
        {
            label: 'Email',
            type: 'text',
            value: valueEmail,
            edit: showEditableFieldEmail,
            setedit: setShowEditableFieldEmail,
            id: 1,
            name: 'email'
        },
        {
            label: 'Passowrd',
            type: 'password',
            value: 'Password',
            edit: showEditableFieldPassword,
            setedit: setShowEditableFieldPassword,
            id: 2,
            name: 'password'
        },
        {
            label: 'Update User Details',
            value: "",
            edit: showEditableFieldUnlock,
            setedit: setShowEditableFieldUnlock,
            id: 3,
            name: 'unlock'
        },
        {
            label: 'Profile Picture',
            type: 'text',
            value: valueProfilePicture,
            edit: showEditableFieldProfilePicture,
            setedit: setShowEditableFieldProfilePicture,
            id: 4,
            name: 'profilepicture'
        },
        {
            label: 'Verification',
            type: 'text',
            value: valueVerified,
            edit: showEditableFieldVerified,
            setedit: setShowEditableFieldVerified,
            id: 5,
            name: 'Verified'
        },
        {
            label: 'Primary Location',
            type: 'text',
            value: valuePrimaryLocation,
            edit: showEditableFieldPrimaryLocation,
            setedit: setShowEditableFieldPrimaryLocation,
            id: 6,
            name: 'primarylocation'
        },
    ]

    // [[[STYLING]]]
    // [[[STYLING]]]
    const coreFeatureAssetStyle = {
        borderRadius: 10,
        margin: 3,
        color: 'white'
    }
    const commonButtonStyles = {
        ...coreFeatureAssetStyle,
        backgroundColor: SelectStyle[1].button,
        height: '3rem',
        // width: '25vw',
        textDecoration: 'none',
        border: 'none',
        fontSize: '1rem'
    }
    const commonShopPanelStyles = {
        ...coreFeatureAssetStyle,
        backgroundColor: SelectStyle[7].shopMenuPanel,
        padding: 10
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

    // [[[VARIABLES]]]
    // Imagekit.io dependencies
    const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
    const publicKey = `${process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}`;
    const authenticationEndpoint = `${process.env.REACT_APP_AUTHENTICATION_ENDPOINT}`;

    // Moment.js
    let momentDate = moment().format('MMMM Do YYYY');
    let momentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');

    // Other Variables
    const cardImageSetupArray = [];
    let urlArrayContainer = false;
    const [listingImage, setListingImage] = useState('');
    let fileIDArray = [];
    let urlArray = [];
    const [imageKitUploadClickedBoolean, setImageKitUploadClickedBoolean] = useState(false);
    const [imageKitFilename, setImageKitFilename] = useState();


    // Whatever value has been entered into the location search gets passed through this function
  const locationHandleInputChange = (event) => {
    const { name, value } = event.target;
    setLocationFormData({ primarylocation: value });
  };

  // Called when the location search is submitted
  const locationHandleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setLocationFormData({
      primarylocation: ''
    });
    GetWeatherData(locationFormData.primarylocation);

    // Display list of cities after 1 second
    setTimeout(() => {
      setLoading(!loading);
      setLocationInitializationSpiner(false);
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
    // return locationButtonArray;
    setStateLocationButtonArray(locationButtonArray)
  }

  // Take the selected location and update the following variables
  const selectedLocation = (x) => {
    setSelectedLocationVariable(x[0].locale);
    localStorage.setItem("updatedLocation", x[0].locale)
    setSelectedLocationVariableBool(true)
    setPrimaryLocation(x[0].locale)
    handleClick('primarylocation');
  }

  const LocationSubmitButton = () => {
    setLocationInitializationSpiner(true);
  }

    const handleClick = async (input) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        let location = localStorage.getItem("updatedLocation");
        if (input === 'profilepicture') {
            try {
                setValueProfilePicture(inputRef.current.value)
                await updateUser({
                    variables: {
                        profilepicture: inputRef.current.value,
                        primarylocation: me?.primarylocation,
                        verified: me?.verified,
                        username: me?.username,
                        email: me?.email,
                        rating: me?.rating,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'username') {
            try {
                setValueUsername(inputRef.current.value)
                await updateUser({
                    variables: {
                        profilepicture: me?.profilepicture,
                        primarylocation: me?.primarylocation,
                        verified: me?.verified,
                        username: inputRef.current.value,
                        email: me?.email,
                        rating: me?.rating,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'email') {
            try {
                setValueEmail(inputRef.current.value)
                await updateUser({
                    variables: {
                        profilepicture: me?.profilepicture,
                        primarylocation: me?.primarylocation,
                        verified: me?.verified,
                        username: me?.username,
                        email: inputRef.current.value,
                        rating: me?.rating,
                    }
                });
            }
            catch (e) { console.error(e); }
        }else if (input === 'primarylocation') {
            try {
                setValuePrimaryLocation(location)
                await updateUser({
                    variables: {
                        profilepicture: me?.profilepicture,
                        primarylocation: location,
                        verified: me?.verified,
                        username: me?.username,
                        email: me?.email,
                        rating: me?.rating,
                    }
                });
            }
            catch (e) { console.error(e); }
        } else if (input === 'password') {
            try {
                await updateUserPassword({
                    variables: {
                        password: inputRef.current.value
                    }
                });
                window.location.reload(false)
            }
            catch (e) { console.error(e); }
        } else if (input === 'unlock') {
            console.log("UNLOCK")
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // check if form has everything
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            await login({
                variables: {
                    ...userFormData,
                    username: me?.username
                },
            });
            setUnlock(true)
            setShowEditableFieldUnlock(false)
            setValues()
        } catch (e) {
            console.error(e);
        }

        setUserFormData({
            profilepicture: '',
            verified: false,
            username: '',
            email: '',
            password: '',
        });
    };

    const EditableFields = (input) => {
        return (
            <>
                <Form style={{ width: '70vw', margin: 'auto' }}>
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{
                            display: 'flex',
                            justifyContent: 'left',
                            padding: '10px',
                            border: 'solid',
                            borderRadius: '10px',
                            alignItems: 'center'
                        }}>
                            {input?.label}
                            <p 
                            style={{
                                fontSize: '1rem',
                                margin: 'auto auto auto 10px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: '#EE9B00'
                            }}
                            >&nbsp;{input?.value}</p>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    input.setedit(current => !current);
                                }}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </Form.Label>
                        {input.edit ?
                            <InputGroup className="mb-3">

                                <Form.Control
                                    placeholder={input?.value}
                                    ref={inputRef}
                                    name={input?.name}
                                    type={input?.type}
                                    id={input?.name}
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
                                    type='submit'
                                    variant="outline-secondary"
                                    id="button-addon2"
                                    style={{
                                        backgroundColor: '#94D2BD',
                                        color: '#001219',
                                        borderLeft: 'solid',
                                        borderWidth: 'thin',
                                        borderColor: 'rgba(148, 210, 189, 0.2)'
                                    }}
                                    onClick={(event) => {
                                        handleClick(input?.name);
                                        event.preventDefault();
                                    }}
                                >
                                    Save
                                </Button>
                            </InputGroup>
                            :
                            null
                        }
                    </Form.Group>
                </Form>

            </>
        )

    }
    const EditableFieldPrimaryLocation = (input) => {
        return (
            <>
                <Form 
                    style={{ width: '70vw', margin: 'auto' }}
                    noValidate
                    validated={locationValidated}
                    onSubmit={locationHandleFormSubmit}
                >
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{
                            display: 'flex',
                            justifyContent: 'left',
                            padding: '10px',
                            border: 'solid',
                            borderRadius: '10px',
                            alignItems: 'center'
                        }}>
                            {input?.label}
                            <p style={{
                                fontSize: '1rem',
                                margin: 'auto auto auto 10px'
                            }}></p>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    input.setedit(current => !current);
                                }}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </Form.Label>
                        {input.edit ?
                        <>
                            <p>Current Primary Location</p>
                            <div
                            style={{ ...commonButtonStyles, height: 'auto', padding: '1rem', margin: '1rem' }}

                            >
                                <p style={{ margin: '0.5rem' }}>
                                    {valuePrimaryLocation}
                                </p>
                            </div>
                            {!selectedLocationVariableBool ?
                                <InputGroup style={{ width: '70vw', textAlign: 'left' }}>
                                    <Form.Control
                                        type='text'
                                        placeholder='You primary location'
                                        name='location'
                                        onChange={locationHandleInputChange}
                                        // value={userFormData.primarylocation}
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
                                        alignItems: 'center'
                                        }}
                                        required
                                    />
                                    <Button
                                    type='submit'
                                    variant='success'
                                    onClick={LocationSubmitButton}
                                    style={{ width: '70vw', margin: '0.5rem auto' }}
                                    >
                                    Search
                                    </Button>
                                </InputGroup>
                            :
                                null
                            }
                             </>
                            :
                            null
                        }
                    </Form.Group>
                </Form>
                <div>
                {!show && locationInitializationSpiner && !selectedLocationVariableBool &&
                    <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                    }}><LoadingSpinner /></div>}

                {show && !locationInitializationSpiner && !selectedLocationVariableBool &&
                    <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    flexDirection: 'column'
                    }}>{stateLocationButtonArray}</div>}
                </div>
            </>
        )

    }
    const EditableFieldUnlock = (input) => {
        return (
            <>
                <Form
                    style={{ width: '70vw', margin: 'auto' }}
                    noValidate
                    validated={validated}
                    onSubmit={handleFormSubmit}
                >
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{
                            display: 'flex',
                            justifyContent: 'left',
                            padding: '10px',
                            border: 'solid',
                            borderRadius: '10px',
                            alignItems: 'center',
                            backgroundColor: '#EE9B00'
                        }}>
                            {input?.label}
                            <p style={{
                                fontSize: '1rem',
                                margin: 'auto auto auto 10px'
                            }}></p>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    input.setedit(current => !current)
                                }}
                            >
                                {unlock ?
                                    <i className="fa-solid fa-lock-open"></i>
                                    :
                                    <i className="fa-solid fa-lock"></i>
                                }
                            </button>
                        </Form.Label>
                        {input.edit ?
                            <>
                                {unlock ?
                                    <p style={{ color: '#EE9B00' }}>
                                        Refresh or navigate away from the page to lock User Details.
                                    </p>
                                    :
                                    <InputGroup className="mb-3" style={{ margin: '0 0 0 1vw' }}>
                                        <Form.Group
                                            style={{ width: '50vw', textAlign: 'left', }}
                                            onSubmit={handleFormSubmit}
                                        >
                                            <Form.Control
                                                type='password'
                                                placeholder='Your password'
                                                name='password'
                                                onChange={handleInputChange}
                                                value={userFormData.password}
                                                style={{
                                                    background: 'transparent',
                                                    borderLeft: 'solid',
                                                    borderWidth: 'thin',
                                                    borderColor: 'rgba(148, 210, 189, 0.2)',
                                                    color: 'white'
                                                }}
                                                required
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                Password is required!
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button
                                            disabled={!(userFormData.password)}
                                            type='submit'
                                            variant='success'
                                            style={{
                                                backgroundColor: '#94D2BD',
                                                color: '#001219',
                                                borderLeft: 'solid',
                                                borderWidth: 'thin',
                                                borderColor: 'rgba(148, 210, 189, 0.2)'
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </InputGroup>
                                }
                            </>
                            :
                            null
                        }
                    </Form.Group>
                </Form>
                {error && <div style={{ color: 'red', margin: '1vh' }}>Login Failed</div>}

            </>
        )

    }

    // [[[UPLOAD IMAGE AND RENDER]]]
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
    // Hook resNameBool starts out false, then updates to true upon image upload. Returns to false once the image has been rendered.
    const [resNameBool, setresNameBool] = useState(false);

    // Handles image upload error
    const onError = err => {
        console.log("Error", err);
    };

    // Handles successful image upload.
    const onSuccess = res => {
        console.log(res)
        setImageKitFilename(res.name);
        setFileID(res.fileId);
        setImageKitUploadClickedBoolean(true);
        setresNameBool(true);
        // urlArray.push(res.url); // Store imagekit.io URL in urlArray
        // fileIDArray.push(res.fileId)
        setListingImage(res.url); // Store imagekit.io URL in the array that handles the rendering on page
        setImageReadyForAppend(true)
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
                setImageKitUploadClickedBoolean(false);
                return { append: cardImageSetupArray }
            default:
                return stateAppend
        }
    }

    const initialState = {
        append:
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: '#16db65',
                    borderRadius: '25px'
                }}>
                    <img
                        src={RenderImg}
                        style={styles.cardImage}
                        alt="">
                    </img>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <p style={{
                            margin: '1vh 0 1vh 0',
                            fontSize: '1rem'
                        }}>Upload an Image</p>
                    </div>
                </div>
            </div>
    }

    // Hook stateAppend starts out with the generic placeholder image and then updates to the uploaded images
    const [stateAppend, dispatchAppend] = useReducer(appendReducer, initialState)

    const increment = () => dispatchAppend({ type: 'increment' })
    const decrement = () => dispatchAppend({ type: 'decrement' })

    const RemoveAppendedImages = () => {
        let fileIDRemove;
        decrement();
        console.log(fileID)
        fileIDRemove = { id: fileID };
        imageKitListForm(fileIDRemove);

    }
    const UploadImages = () => {
        return (
            <IKContext
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticationEndpoint={authenticationEndpoint}
            >
                <Col style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div>
                        <p style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            Upload Image
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
                                padding: '0.5rem',
                                borderRadius: '0.3rem',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                fontSize: '1rem',
                                width: '20rem'
                            }}
                        // onClick={() => console.log("TEST")}
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
    const AppendImages = () => {
        return (
            <div
                style={{ ...commonShopPanelStyles }}
            // key={i}
            >
                <div>
                    <IKContext urlEndpoint={urlEndpoint}>
                        <IKImage
                            src={listingImage}
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
                        onClick={() => RemoveAppendedImages()}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        )
    };
    // appendImages();

    // [[[LOAD SPINNER]]]
    let renderBtn;

    // [[[SPINNER]]]
    // Loads the React Bootstrap Spinner
    function LoadingSpinner() {
        return (
            <Spinner style={{ margin: '10px' }} animation="border" role="status"></Spinner>
        );
    }

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

    const EditableFieldProfilePicture = (input) => {
        return (
            <>
                <Form
                    style={{ width: '70vw', margin: 'auto' }}
                // noValidate
                // validated={validated}
                // onSubmit={handleFormSubmit}
                >
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{
                            display: 'flex',
                            justifyContent: 'left',
                            padding: '10px',
                            border: 'solid',
                            borderRadius: '10px',
                            alignItems: 'center'
                        }}>
                            {input?.label}
                            <p style={{
                                fontSize: '1rem',
                                margin: 'auto auto auto 10px'
                            }}></p>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    input.setedit(current => !current)
                                }}
                            >
                                {me?.profilepicture ?
                                    <div style={{ color: 'blue' }}>
                                        <i className="fa-solid fa-image"></i>
                                    </div>
                                    :
                                    <div style={{ color: 'red' }}>
                                        <i className="fa-solid fa-image"></i>
                                    </div>
                                }

                            </button>
                        </Form.Label>
                        {input.edit ?
                            <>
                                <div>
                                    <p>Profile Picture</p>
                                </div>
                                <div>
                                    <UploadImages />
                                    {imageReadyForAppend ?
                                        <AppendImages />
                                    :
                                        null
                                    }
                                </div>
                            </>
                            :
                            null
                        }
                    </Form.Group>
                </Form>
                {error && <div style={{ color: 'red', margin: '1vh' }}>Login Failed</div>}

            </>
        )

    }

    const EditableFieldVerification = (input) => {
        return (
            <>
                <Form
                    style={{ width: '70vw', margin: 'auto' }}
                // noValidate
                // validated={validated}
                // onSubmit={handleFormSubmit}
                >
                    <Form.Group style={{ margin: '10px 0' }}>
                        <Form.Label style={{
                            display: 'flex',
                            justifyContent: 'left',
                            padding: '10px',
                            border: 'solid',
                            borderRadius: '10px',
                            alignItems: 'center'
                        }}>
                            {input?.label}
                            <p style={{
                                fontSize: '1rem',
                                margin: 'auto auto auto 10px'
                            }}>{me?.verified}</p>
                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    outline: 'none'
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    input.setedit(current => !current)
                                }}
                            >
                                {me?.verified ?
                                    <div style={{ color: '#55a630' }}>
                                        <i className="fa-solid fa-square-check"></i>
                                    </div>
                                    :
                                    <div style={{ color: 'red' }}>
                                        <i className="fa-solid fa-square-check"></i>
                                    </div>
                                }

                            </button>
                        </Form.Label>
                        {input.edit ?
                            <>
                                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                                    <VerificationInvoiceAndQuote />
                                </div>
                            </>
                            :
                            null
                        }
                    </Form.Group>
                </Form>
                {error && <div style={{ color: 'red', margin: '1vh' }}>Login Failed</div>}

            </>
        )

    }


    return (
        <>
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
                            width: '80vw'
                        }}
                        onClick={() => handleUserDetailsDropdown()}
                    >
                        <p style={{ margin: 'auto' }}>
                            <i className="fa-solid fa-address-card"></i>
                            &nbsp;
                            User Details
                            &nbsp;
                            <i className="fa-solid fa-arrow-up"></i>
                        </p>
                    </div>
                    {EditableFieldUnlock(userDetailFields[3])}
                    {unlock ?
                        <>
                            {EditableFields(userDetailFields[0])}
                            {EditableFields(userDetailFields[1])}
                            {EditableFields(userDetailFields[2])}
                            {EditableFieldPrimaryLocation(userDetailFields[6])}
                            {/* {EditableFieldProfilePicture(userDetailFields[4])} */}
                            {EditableFieldVerification(userDetailFields[5])}
                        </>
                        :
                        null
                    }
                    <div style={{
                        display: 'flex',
                        justifyContent: 'left',
                        padding: '10px',
                        border: 'solid',
                        borderRadius: '10px',
                        alignItems: 'center',
                        width: '70vw',
                        margin: '1rem auto',
                        backgroundColor: '#0A9396'
                    }}>
                        <p style={{
                            margin: 'auto auto auto 10px'
                        }}>User Ratings</p>
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
                                flexWrap: 'wrap',
                                width: '70vw',
                                margin: '0.25rem auto'
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
                                        Up Vote
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
                                        {me?.upvote.length}
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
                                flexWrap: 'wrap',
                                width: '70vw',
                                margin: '0.25rem auto'
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
                                        Down Vote
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
                                        {me?.downvote.length}
                                    </p>
                                </Col>
                            </div>
                        </Col>
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
                        width: '80vw'
                    }}
                    onClick={() => handleUserDetailsDropdown()}
                >
                    <p style={{ margin: 'auto' }}>
                        <i className="fa-solid fa-address-card"></i>
                        &nbsp;
                        User Details
                        &nbsp;
                        <i className="fa-solid fa-arrow-down"></i>
                    </p>
                </div>
            }
        </>
    );
}

export default UserDetails;