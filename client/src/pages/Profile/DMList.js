import React, { useState } from "react";
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserData } from '../../components/ApolloQueries/UserData';

const DMList = () => {
    const [searchContent, setSearchContent] = useState(false);
    const [userDetailsDropdown, setUserDetailsDropdown] = useState(false);
    const me = UserData();
    

    let filteredData = [];

    const handleUserDetailsDropdown = () => {
        if (userDetailsDropdown) { setUserDetailsDropdown(false) }
        else { setUserDetailsDropdown(true) }
    }

    const handleFilter1 = () => {
        let PFCList = me.pfclist;
        function handleLocalStorage(init) {
            localStorage.removeItem('listingID');
            localStorage.setItem('listingID', JSON.stringify(init));
        }
        for (let i = 0; i < PFCList?.length; i++) {
            if (PFCList[i].bool) {
                filteredData.push(
                    <div key={i}>
                        <Button
                            onClick={() => handleLocalStorage(PFCList[i].listingid)}
                            as={Link}
                            to='/listing'
                            style={{ 
                                width: '70vw', 
                                margin: 'auto', 
                                background: 'transparent', 
                                outline: 'none', 
                                border: 'none' 
                            }}
                        >
                            <Row style={{ alignItems: 'center' }}>
                                <div 
                                    style={{ 
                                        border: 'solid', 
                                        borderRadius: '10px', 
                                        marginRight: 'auto', 
                                        backgroundColor: '#005F73' 
                                    }}>
                                    <Col>
                                        <p style={{ 
                                            fontSize: '1rem', 
                                            margin: 'auto auto auto auto' 
                                        }}>{PFCList[i].listingtitle}</p>
                                        <p style={{ 
                                            fontSize: '1rem', 
                                            margin: 'auto auto auto auto' 
                                        }}>{PFCList[i].communication.length} Messages</p>
                                    </Col>
                                </div>
                                <div
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        color: 'white', 
                                        border: 'none', 
                                        outline: 'none' 
                                    }}
                                >
                                    <i className="fa-solid fa-play"></i>
                                </div>
                            </Row>
                        </Button>
                    </div>
                )
            }
        }


    }
    handleFilter1();

    return (
        <>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                flexDirection: 'column',
                margin: '10px'
            }}>
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
                            onClick={() => { 
                                setSearchContent(current => !current); 
                                handleUserDetailsDropdown(); 
                            }}
                        >
                            <p style={{ margin: 'auto' }}>
                                <i className="fa-solid fa-address-card"></i>
                                &nbsp; 
                                Direct Messages
                                &nbsp; 
                                <i className="fa-solid fa-arrow-up"></i></p>
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
                        onClick={() => { setSearchContent(current => !current); handleUserDetailsDropdown(); }}
                    >
                        <p style={{ margin: 'auto' }}>
                            <i className="fa-solid fa-address-card"></i> 
                            &nbsp;
                            Direct Messages 
                            &nbsp;
                            <i className="fa-solid fa-arrow-down"></i></p>
                    </div>
                }
            </div>
            {searchContent ? (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    margin: 'auto',
                    zIndex: '4',
                    marginTop: '0.1rem'
                }}>
                    {filteredData}
                </div>
            ) : (
                null
            )}
        </>
    )
}

export default DMList;