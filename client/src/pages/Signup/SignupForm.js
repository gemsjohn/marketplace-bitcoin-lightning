import React, { useState } from 'react';
import { Form, Button, Alert, Row, InputGroup, Spinner } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import SelectStyle from '../../Stylizer';
import axios from 'axios';

const SignupForm = () => {
  // [[[HOOKS]]]
  const [userFormData, setUserFormData] =
    useState({
      role: 'User',
      username: '',
      email: '',
      verified: false,
      upvote: [],
      downvote: [],
      primarylocation: '',
      listinglocationarray: [],
      password: '',
    });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationValidated] = useState(false);
  const [stateLocationButtonArray, setStateLocationButtonArray] = useState([]);
  const [selectedLocationVariable, setSelectedLocationVariable] = useState('');
  const [selectedLocationVariableBool, setSelectedLocationVariableBool] = useState(false);
  const [locationInitializationSpiner, setLocationInitializationSpiner] = useState(false);
  const [primaryLocation, setPrimaryLocation] = useState('');

  // [[[APOLLO SERVER]]]
  const [addUser, { error }] = useMutation(ADD_USER);

  let locationButtonArray = [];
  let locationDetails = [];


  // [[[SPINNER]]]
  // Loads the React Bootstrap Spinner
  function LoadingSpinner() {
    return (
      <Spinner style={{ margin: '10px' }} animation="border" role="status"></Spinner>
    );
  }

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  // Whatever value has been entered into the location search gets passed through this function
  const locationHandleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ primarylocation: value });
    console.log(value)
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
      primarylocation: ''
    });
    GetWeatherData(userFormData.primarylocation);

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
    setSelectedLocationVariableBool(true)
    setPrimaryLocation(x[0].locale)
  }

  const LocationSubmitButton = () => {
    setLocationInitializationSpiner(true);
  }



  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...userFormData, primarylocation: primaryLocation }
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  // [[[SIGNUP FORM]]]
  return (
    <div style={{ margin: '0.5rem auto' }}>
      <>
        {/* [[[LOCATION]]]*/}
        {!selectedLocationVariableBool &&
          <>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'left',
              // margin: '5px'
            }}>
              <p style={{
                margin: 'auto 1rem auto 0',
                fontSize: '3vh',
                textAlign: 'left'
              }}>
                Enter your primary city
              </p>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'left',
              // margin: '5px'
            }}>
              <p style={{
                margin: 'auto 1rem',
                fontSize: '2vh',
                textAlign: 'left',
                color: 'red'
              }}>
                Required
              </p>
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
              >
                <InputGroup style={{ width: '70vw', textAlign: 'left' }}>
                  <Form.Control
                    type='text'
                    placeholder='You primary location'
                    name='location'
                    onChange={locationHandleInputChange}
                    value={userFormData.primarylocation}
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
        {selectedLocationVariableBool ?
          <>
            <div style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem', margin: '0.5rem 0', borderRadius: '10px' }}>
              <p style={{ textAlign: 'left', margin: 'auto' }}>Location</p>
            </div>
            {/* <div>
              <p style={{ marginTop: '0.5rem', }}>{selectedLocationVariable}</p>
            </div> */}
            <div
              style={{ ...commonButtonStyles, height: 'auto', padding: '0.5rem' }}

            >
              <p style={{ margin: '0.5rem' }}>
                {selectedLocationVariable}
              </p>
            </div>
          </>
          :
          null
        }
      </>
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
      >
        {/* [[[INITIAL QUESTIONS]]] */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant='danger'
        >
          Something went wrong with your signup!
        </Alert>
        {/* [[[EMAIL]]] */}
        <Form.Group style={{
          width: '70vw',
          textAlign: 'left',
          marginTop: '0.5rem'
        }}>
          <Form.Label
            style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
          >
            Email
          </Form.Label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'left',
            // margin: '5px'
          }}>
            <p style={{
              margin: '0 0 0.25 0',
              marginLeft: '1rem',
              fontSize: '2vh',
              textAlign: 'left',
              color: 'red'
            }}>
              Required
            </p>
          </div>
          <Form.Control
            disabled={!(selectedLocationVariableBool)}
            type='email'
            placeholder='Email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            style={{
              outline: 'none',
              backgroundColor: '#e9ecef',
              color: 'black',
              display: 'flex',
              justifyContent: 'left',
              width: '70vw',
              padding: '1.5rem',
              border: 'solid',
              borderColor: 'white',
              borderRadius: '10px',
              alignItems: 'center'
            }}
            required
          />
          <Form.Control.Feedback type='invalid'>
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
        {/* [[[USERNAME]]] */}
        <Form.Group style={{
          width: '70vw',
          textAlign: 'left',
          marginTop: '0.5rem'
        }}>
          <Form.Label
            style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
          >
            Username
          </Form.Label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'left',
            // margin: '5px'
          }}>
            <p style={{
              margin: '0 0 0.25 0',
              marginLeft: '1rem',
              fontSize: '2vh',
              textAlign: 'left',
              color: 'red'
            }}>
              Required
            </p>
          </div>
          <Form.Control
            disabled={!(selectedLocationVariableBool)}
            type='text'
            id='username'
            placeholder='Username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            style={{
              outline: 'none',
              backgroundColor: '#e9ecef',
              color: 'black',
              display: 'flex',
              justifyContent: 'left',
              width: '70vw',
              padding: '1.5rem',
              border: 'solid',
              borderColor: 'white',
              borderRadius: '10px',
              alignItems: 'center'
            }}
            autoComplete="off"
            required
          />
          <Form.Control.Feedback type='invalid'>
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
        {/* [[[PASSWORD]]] */}
        <Form.Group style={{
          width: '70vw',
          textAlign: 'left',
          marginTop: '0.5rem'
        }}>
          <Form.Label
            style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
          >
            Password
          </Form.Label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'left',
            // margin: '5px'
          }}>
            <p style={{
              margin: '0 0 0.25 0',
              marginLeft: '1rem',
              fontSize: '2vh',
              textAlign: 'left',
              color: 'red'
            }}>
              Required
            </p>
          </div>
          <Form.Control
            disabled={!(selectedLocationVariableBool)}
            type='password'
            placeholder='Password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            style={{
              outline: 'none',
              backgroundColor: '#e9ecef',
              color: 'black',
              display: 'flex',
              justifyContent: 'left',
              width: '70vw',
              padding: '1.5rem',
              border: 'solid',
              borderColor: 'white',
              borderRadius: '10px',
              alignItems: 'center'
            }}
            required
          />
          <Form.Control.Feedback type='invalid'>
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
        {/* [[[SUBMIT BUTTON]]] */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          style={{
            width: '70vw',
            marginTop: '1rem',
            backgroundColor: '#55a630',
            fontSize: '3vh',
            padding: '0.5rem'
          }}>
          Submit
        </Button>

      </Form>
      {error &&
        <div style={{ color: 'red', margin: '1vh' }}>
          Signup failed
        </div>
      }
    </div>
  );
};

export default SignupForm;
