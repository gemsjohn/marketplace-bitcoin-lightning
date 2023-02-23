import React, { useState } from "react";
import { Button, Nav, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HandleWantedButton = () => {
    const [wantedButtonHover, setWantedButtonHover] = useState(false);
    const [forsaleButtonHover, setForsaleButtonHover] = useState(false);
    return (
        <>
            <Col>
                {forsaleButtonHover ?
                <Nav.Link as={Link} to='/forsale' style={{padding: '0'}}>
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
                        onMouseEnter={() => setForsaleButtonHover(true)}
                        onMouseLeave={() => setForsaleButtonHover(false)}
                    >For Sale</Button>
                </Nav.Link>
                    :
                    <Nav.Link as={Link} to='/forsale' style={{padding: '0'}}>
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
                            onMouseEnter={() => setForsaleButtonHover(true)}
                            onMouseLeave={() => setForsaleButtonHover(false)}
                        >For Sale</Button>
                    </Nav.Link>
                }
            </Col>
            <Col>
                {wantedButtonHover ?
                    <Nav.Link as={Link} to='/wanted' style={{padding: '0'}}>
                        <Button style={{
                            width: '100%',
                            fontSize: '4vh',
                            background: 'rgba(0, 95, 115, 0.2)',
                            border: 'none',
                            borderLeft: 'solid',
                            borderTop: 'solid',
                            borderRight: 'solid',
                            borderWidth: 'thin',
                            borderColor: 'rgba(148, 210, 189, 0.2)'
                        }}
                            onMouseEnter={() => setWantedButtonHover(true)}
                            onMouseLeave={() => setWantedButtonHover(false)}
                        >Wanted</Button>
                    </Nav.Link>
                    :
                    <Nav.Link as={Link} to='/wanted' style={{padding: '0'}}>
                        <Button style={{
                            width: '100%',
                            fontSize: '4vh',
                            background: '#0A9396',
                            border: 'none',
                            borderLeft: 'solid',
                            borderTop: 'solid',
                            borderRight: 'solid',
                            borderWidth: 'thin',
                            borderColor: 'rgba(148, 210, 189, 0.2)'
                        }}
                            onMouseEnter={() => setWantedButtonHover(true)}
                            onMouseLeave={() => setWantedButtonHover(false)}
                        >Wanted</Button>
                    </Nav.Link>
                }
            </Col>
        </>
    );
}

export default HandleWantedButton;