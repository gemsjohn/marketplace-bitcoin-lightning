import React, { useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { UserData } from '../../components/ApolloQueries/UserData';
import ForSaleByCreatorID from './ForSaleByCreatorID';
import WantedByCreatorID from './WantedByCreatorID';
import UserDetails from './UserDetails';
import Watchlist from './Watchlist';
import DMList from './DMList';
import SelectStyle from '../../Stylizer';


const ProfilePage = () => {
    window.scrollTo(0,0);
    const [loading, setLoading] = useState(true);
    let me = UserData();

    function LoadingSpinner() {
        return (
            <div style={{ ...SelectStyle[0].page }}>
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

    let timeoutID = setTimeout(() => {
        if (me) {
            setLoading(false);
        } else {
            setLoading(true);
        }
        
    }, 1000)

    if (loading === false) {
        clearTimeout(timeoutID);
    }

    return (
        <>
        {loading ?
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}><LoadingSpinner /></div>
        :
            <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ ...SelectStyle[0].page, }}>
                    <Row style={{ 
                        width: '100%', 
                        margin: '8rem 1rem 1rem 1rem', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center' 
                    }}>
                        <Col style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center' 
                        }}>
                            <div style={{}}>
                                <h1>Profile Page</h1>
                                {me?.verified ?
                                    <p style={{color: '#55a630'}}><i className="fa-solid fa-square-check"></i>&nbsp; Verified</p>
                                    :
                                    <p style={{color: 'red'}}><i className="fa-solid fa-x"></i>&nbsp; Not Verified</p>
                                }
                                <UserDetails />
                                <DMList />
                                <ForSaleByCreatorID />
                                <WantedByCreatorID />
                                <Watchlist />
                            </div>
                        </Col>
                    </Row>

                </div>
            </div>
        }
        </>
    )
}

export default ProfilePage;