import React, { useState } from 'react';
import { Row, Col, Spinner, Form, Button, InputGroup } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import SelectStyle from '../../../Stylizer';
import { RESET_PASSWORD } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import '../../../App.css';

// [[[VARIABLES]]]

// [[[MAINPAGELISTING FUNCTION]]]: Displays Search Bar and Listing Cards
function Reset() {
    window.scrollTo(0, 0);
    const [loading, setLoading] = useState(true);
    const [validated] = useState(false);
    // [[[APOLLO SERVER]]]
    const [resetPassword, { error }] = useMutation(RESET_PASSWORD);

    const [userFormData, setUserFormData] =
        useState({
            email: '',
            password: '',
            confirmPassword: '',
            resetToken: ''
        });

    setTimeout(() => {
        setLoading(false);
    }, 250)

    function LoadingSpinner() {
        return (
            <div style={{ ...SelectStyle[0].page, }}>
                <Spinner
                    style={{
                        marginTop: '10rem',
                        position: 'absolute',
                        zIndex: '100'
                    }}
                    animation="border"
                    role="status">
                </Spinner>
            </div>
        );
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({
            ...userFormData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await resetPassword({
                variables: { ...userFormData }
            });
            window.location.replace("https://honestpatina.com/login")
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    position: 'relative'
                }}>
                <div style={{ ...SelectStyle[0].page, }}>
                    {loading ?
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                            <LoadingSpinner />
                        </div>
                        :
                        <>
                        <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleFormSubmit}
                        >
                            <Row
                                style={{
                                    width: '100%',
                                    margin: '8rem 1rem 1rem 1rem',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}>
                                <Col
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}>

                                    <div style={{}}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'left',
                                            marginTop: '0.5rem'
                                        }}>
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
                                                <Form.Control
                                                    type='text'
                                                    id='email'
                                                    placeholder='Email'
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
                                                    autoComplete="off"
                                                    required
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    Reset Token is required!
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div style={{}}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'left',
                                            marginTop: '0.5rem'
                                        }}>
                                            <Form.Group style={{
                                                width: '70vw',
                                                textAlign: 'left',
                                                marginTop: '0.5rem'
                                            }}>
                                                <Form.Label
                                                    style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
                                                >
                                                    Reset Token
                                                </Form.Label>
                                                <Form.Control
                                                    type='text'
                                                    id='resetToken'
                                                    placeholder='Reset Token'
                                                    name='resetToken'
                                                    onChange={handleInputChange}
                                                    value={userFormData.resetToken}
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
                                                    Reset Token is required!
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div style={{}}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'left',
                                            marginTop: '0.5rem'
                                        }}>
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
                                                <Form.Control
                                                    type='password'
                                                    id='password'
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
                                                    autoComplete="off"
                                                    required
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    Password is required!
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div style={{}}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'left',
                                            marginTop: '0.5rem'
                                        }}>
                                            <Form.Group style={{
                                                width: '70vw',
                                                textAlign: 'left',
                                                marginTop: '0.5rem'
                                            }}>
                                                <Form.Label
                                                    style={{ color: 'white', width: 'fit-content', padding: '0.1rem 1rem 01.rem 0', margin: '0', borderRadius: '10px' }}
                                                >
                                                    Confirm Password
                                                </Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    id='confirmPassword'
                                                    placeholder='Confirm Password'
                                                    name='confirmPassword'
                                                    onChange={handleInputChange}
                                                    value={userFormData.confirmPassword}
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
                                                    Confirm Password is required!
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                        {/* [[[SUBMIT BUTTON]]] */}
                                        <Button
                                            disabled={!(userFormData.email && userFormData.resetToken && userFormData.password && userFormData.confirmPassword)}
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
                                </Col>
                            </Row>
                        </Form>
                        {error &&
                            <div style={{ color: 'red', margin: '1vh' }}>
                                Signup failed
                            </div>
                        }
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default Reset;