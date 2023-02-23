import React, { useState } from 'react';
import { Row, Button, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignupForm from './SignupForm';
import SelectStyle from '../../Stylizer';

// [[[LOGIN FUNCTION]]]: Displays Login & Sign Up buttons + LoginForm 
const Signup = () => {
  window.scrollTo(0, 0);
  const [signupButtonHover, setSignupButtonHover] = useState(false);
  const [loginButtonHover, setLoginButtonHover] = useState(false);
    return (
        <>
        <div style={{...SelectStyle[0].page}}>
          <Row
            style={{
              margin: '10rem auto 0 auto',
              width: '80vw'
            }}>
            {/*  */}
                {loginButtonHover ?
                <Nav.Link as={Link} to='/login' style={{padding: '0', width: '35vw', margin:'auto'}}>
                    <Button style={{
                        width: '100%',
                        fontSize: '4vh',
                        background: 'rgba(148, 210, 189, 0.2)',
                        border: 'none',
                        borderLeft: 'solid',
                        borderTop: 'solid',
                        borderRight: 'solid',
                        borderWidth: 'thin',
                        borderColor: 'rgba(148, 210, 189, 0.2)'
                    }}
                        onMouseEnter={() => setLoginButtonHover(true)}
                        onMouseLeave={() => setLoginButtonHover(false)}
                    >Login</Button>
                </Nav.Link>
                    :
                    <Nav.Link as={Link} to='/login' style={{padding: '0', width: '35vw', margin:'auto'}}>
                        <Button style={{
                            width: '100%',
                            fontSize: '4vh',
                            background: 'transparent',
                            border: 'none',
                            borderLeft: 'solid',
                            borderTop: 'solid',
                            borderRight: 'solid',
                            borderWidth: 'thin',
                            borderColor: 'rgba(148, 210, 189, 0.2)',
                            color: 'rgba(255,255,255, 0.2)'
                        }}
                            onMouseEnter={() => setLoginButtonHover(true)}
                            onMouseLeave={() => setLoginButtonHover(false)}
                        >Login</Button>
                    </Nav.Link>
                }
                {signupButtonHover ?
                    <Nav.Link as={Link} to='/signup' style={{padding: '0', width: '35vw', margin:'auto'}}>
                        <Button style={{
                            width: '100%',
                            fontSize: '4vh',
                            background: 'rgba(148, 210, 189, 0.2)',
                            border: 'none',
                            borderLeft: 'solid',
                            borderTop: 'solid',
                            borderRight: 'solid',
                            borderWidth: 'thin',
                            borderColor: 'rgba(148, 210, 189, 0.2)'
                        }}
                            onMouseEnter={() => setSignupButtonHover(true)}
                            onMouseLeave={() => setSignupButtonHover(false)}
                        >Sign Up</Button>
                    </Nav.Link>
                    :
                    <Nav.Link as={Link} to='/signup' style={{padding: '0', width: '35vw', margin:'auto'}}>
                        <Button style={{
                            width: '100%',
                            fontSize: '4vh',
                            background: '#0A9396',
                            border: 'none',
                            borderLeft: 'solid',
                            borderTop: 'solid',
                            borderRight: 'solid',
                            borderWidth: 'thin',
                            borderColor: 'rgba(148, 210, 189, 0.2)',
                            
                        }}
                            onMouseEnter={() => setSignupButtonHover(true)}
                            onMouseLeave={() => setSignupButtonHover(false)}
                        >Sign Up</Button>
                    </Nav.Link>
                }
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'flex-end',
                borderTop: 'solid',
                borderColor: 'rgba(148, 210, 189, 0.2)',
                borderWidth: 'thin',
                padding: '1rem',
                width: '80vw',
                margin: 'auto'
              }}>
            </div>
            <SignupForm />
          </Row>
        </div>
        </>
    );
}

export default Signup;