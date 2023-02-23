import React, { useState, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REQUEST_RESET } from '../../utils/mutations';
import Auth from '../../utils/auth';
import SelectStyle from '../../Stylizer';

const LoginForm = () => {
  // [[[HOOKS]]]
  const [userFormData, setUserFormData] = useState({ username: '', password: '' });
  const [validated] = useState(false);
  const [resetRequestStatus, setResetRequestStatus] = useState('');

  // [[[APOLO SERVER]]]
  const [login, { error }] = useMutation(LOGIN_USER);
  const [requestReset] = useMutation(REQUEST_RESET);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  const handleRequestReset = async (email) => {
    console.log(email)
    try {
      const { data } = await requestReset({
        variables: {
          email: email
        },
      });
      setResetRequestStatus("Check your email for a Reset Token!")
    } catch (e) {
      console.error(e);
      setResetRequestStatus("No user found with that email.")
    }

  };

  return (
    <div style={{ margin: '0.5rem auto' }}>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
      >
        <Form.Group style={{
          width: '70vw',
          textAlign: 'left',
          marginTop: '0.5rem'
        }}>
          <Form.Label
            htmlFor='email'
            style={{ color: SelectStyle[5].formText }}
          >
            Username
            &nbsp;
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            autoComplete="off"
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
          <Form.Control.Feedback type='invalid'>
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group style={{
          width: '70vw',
          textAlign: 'left',
          marginTop: '0.5rem'
        }}>
          <Form.Label
            htmlFor='password'
            style={{ color: SelectStyle[5].formText }}
          >
            Password
            &nbsp;
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            autoComplete="off"
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
          <Form.Control.Feedback type='invalid'>
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.password)}
          type='submit'
          style={{ width: '70vw', marginTop: '1rem', backgroundColor: '#55a630' }}>
          Submit
        </Button>
      </Form>
      {error && <div style={{ color: 'red', margin: '1vh' }}>Login Failed</div>}
      {/* <button onClick={() => handleRequestReset()}>Forgot Password</button> */}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{marginTop: '5vh'}}>
          <p style={{margin: 'auto'}}>Forgot your password?</p>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
          marginTop: 'auto'
        }}>
          <Form
            // noValidate
            // validated={locationValidated}
            onSubmit={handleRequestReset}
          >
            <InputGroup style={{ width: '70vw', textAlign: 'left' }}>
              <Form.Control
                type='text'
                placeholder='Enter your email'
                name='forgotpassword'
                ref={inputRef}
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
              onClick={(event) => {event.preventDefault(); handleRequestReset(inputRef.current.value)}}
              style={{ width: '70vw', margin: '0.5rem auto' }}
            >
              Send
            </Button>
          </Form>
          
          
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
          <p style={{color: '#EE9B00'}}>{resetRequestStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
