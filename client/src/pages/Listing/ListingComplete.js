import Button from '@restart/ui/esm/Button';
import React, { useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SelectStyle from '../../Stylizer';

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

function ListingComplete() {
    window.scrollTo(0, 0);
    const [isShownLogin, setIsShownLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    
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

    const HandlePrimaryDisplay = () => {
        return (
            <>
                <div 
                    style={{ 
                        ...SelectStyle[0].page, 
                        marginTop: '4vh' 
                    }}>
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
                    <div style={{ margin: '4rem' }}>
                        <div 
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center' 
                            }}>
                            <p style={{ color: '#8ac926' }}>
                                Congratulations!
                            </p>
                        </div>
                        <div 
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center' 
                            }}>
                            <p style={{ color: '#8ac926' }}>
                                Your listing has been published.
                            </p>
                        </div>

                        <Row 
                            style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center' 
                            }}>
                            <Link
                                as={Link}
                                to="/"
                                onMouseEnter={() => setIsShownLogin(true)}
                                onMouseLeave={() => setIsShownLogin(false)}
                            >
                                {isShownLogin ? 
                                    <Button 
                                        style={{ 
                                            ...commonButtonStyles, 
                                            color: '#F2D492', 
                                            fontSize: '1rem' 
                                        }}>Return Home</Button> 
                                : 
                                    <Button 
                                        style={{ 
                                            ...commonButtonStyles, 
                                            fontSize: '1rem' 
                                        }}>Return Home</Button>}
                            </Link>
                        </Row>
                    </div>
                    }
                </div>
            </>
        )
    }

    return (<HandlePrimaryDisplay />)
}

export default ListingComplete;