import React, { useState, useEffect } from 'react';
import { Button, Row, Form, InputGroup } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LISTING_BY_ID } from '../../../utils/queries';
import { REMOVE_FROM_PFC_LIST, CREATE_NEW_MESSAGE } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import DemoAppInvoiceAndQuote from '../../../components/DemoInvoiceAndQuote';
import { handleLoginToDMSeller, handleLoginToAddToWatchlist, renderDMToolTip, renderWatchToolTip } from '../Auxilliary/ToolTips';
import { HandleAddToWatchlist, HandleRemoveFromWatchlist, CalculateNumberOfWatchers } from '../Auxilliary/Watchlist';


// export const [isDMAvailable, setIsDMAvailable] = useState(true);
// export const [pfcBoolean, setPfcBoolean] = useState(true);
// export const [DMBoxShow, setDMBoxShow] = useState(false);
// export const [commStorageUser, setCommStorageUser] = useState([]);

export const CreatorDM = (props) => {
    const [isDMAvailable, setIsDMAvailable] = useState(true);
    const [pfcBoolean, setPfcBoolean] = useState(true);
    const [DMBoxShow, setDMBoxShow] = useState(false);
    const [commStorageUser, setCommStorageUser] = useState([]);
    const [messagesPreviousLength, setMessagesPreviousLength] = useState('')
    const [messagesCurrentLength, setMessagesCurrentLength] = useState('')
    const [myArray, setMyArray] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [showDMs, setShowDMs] = useState(false);
    const [displayButtonArray, setDisplayButtonArray] = useState(true)
    const [creatorInit, setCreatorInit] = useState(false);
    const [commStorage, setCommStorage] = useState([]);
    const [buttonArray, setButtonArray] = useState([]);
    const [noDM, setNoDM] = useState(false);
    const [DMFalseStatement, setDMFalseStatement] = useState('')

    const [removeFromPFCList] = useMutation(REMOVE_FROM_PFC_LIST);
    const [createNewMessage] = useMutation(CREATE_NEW_MESSAGE);

    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const { data: viewed, refetch } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });

    let filteredPFCListArray = [];
    let iVar = localStorage.getItem('iVar') || {};
    let messageHistoryArray = [];
    let watchlistStatus;
    let authenticatedUserListings = false;
    let PFCButtonArray = [];
    if (props.user._id === props.data.creatorid) { authenticatedUserListings = true; }
    else { authenticatedUserListings = false; }


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setWindowWidth(((2) ^ (window.innerWidth / 2)))
            } else if (window.innerWidth >= 481 && window.innerWidth <= 1024) {
                setWindowWidth((window.innerWidth / 1.8))
            } else if (window.innerWidth >= 1025 && window.innerWidth <= 1280) {
                setWindowWidth((window.innerWidth / 2))
            } else if (window.innerWidth >= 1281) {
                setWindowWidth((window.innerWidth / 3))
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => { window.removeEventListener("resize", handleResize) }
    }, [windowWidth])

    const handleCheckWatchlist = () => {
        for (let i = 0; i < props.data.watchlist?.length; i++) {
            if (props.user._id === props.data.watchlist[i].userid) {
                watchlistStatus = true;
            } else {
                watchlistStatus = false;
            }
        }
    }
    handleCheckWatchlist();


    const DMCreatorInit = () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        let arr = props.data.pfclist;
        for (let x = 0; x < arr.length; x++) {
            if (arr[x]) {
                if (arr[x].bool && arr[x].communication.length > 0) {
                    PFCButtonArray[x] =
                        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', marginBottom: '1rem', }} key={x}>
                            <Button
                                onClick={() => {
                                    setDisplayButtonArray(false)
                                    localStorage.setItem('xVar', x)
                                    // console.log(arr[x])
                                    setCreatorInit(true);
                                    setMessagesPreviousLength(arr[x].communication[0].messages.length);
                                    DisplayMessages(props.data.pfclist[x].communication[0].messages)
                                    setCommStorage(arr[x])

                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    padding: '10px',
                                    border: 'solid',
                                    borderRadius: '10px',
                                    width: '59vw',
                                    alignItems: 'center',
                                    background: 'transparent'
                                }}
                            >
                                <div style={{ width: 'inherit' }}>
                                    <div style={{ backgroundColor: '#94D2BD', padding: '1rem', margin: 'auto', borderRadius: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', color: '#001219' }}>
                                        <p style={{ margin: 'auto' }}>{arr[x].communication[0].username}&nbsp; : &nbsp;</p>
                                        <p style={{ margin: 'auto' }}>{arr[x].communication[0].date}</p>
                                    </div>
                                </div>
                            </Button>
                        </div>
                }
                setButtonArray(PFCButtonArray);
            }
        }
        if (arr.length === 0) {
            setNoDM(true)
        }
    }

    const DisplayMessages = (messages) => {
        let username;
        for (let i = 0; i < messages.length; i++) {
            username = messages[i].username
            messageHistoryArray.push(
                <div key={i}>
                    {username === props.user.username ?
                        <div
                            style={{
                                backgroundColor: '#02c39a',
                                borderRadius: '20px',
                                padding: '4px',
                                margin: '2.5px',
                                marginRight: 'auto'
                            }}
                        >
                            <div style={{ width: 'max-content' }}>
                                <p style={{
                                    width: 'auto',
                                    display: 'inline-flex',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '0.75rem',
                                    position: 'relative',
                                    margin: 'auto',
                                    fontSize: '1rem',
                                    marginLeft: '0.5rem'
                                }}>{username}</p>
                            </div>
                            <div style={{ width: 'inherit' }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'column',
                                    textAlign: 'left',
                                    backgroundColor: '#f1faee',
                                    padding: '4px',
                                    margin: '0.5rem',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    color: '#001219',
                                    fontSize: '1rem',
                                }}>
                                    {messages[i].message}
                                </div>
                            </div>
                        </div>
                        :
                        <div
                            style={{
                                backgroundColor: '#480ca8',
                                borderRadius: '20px',
                                padding: '4px',
                                margin: '2.5px',
                                marginRight: 'auto'
                            }}
                        >
                            <div style={{ width: 'max-content' }}>
                                <p style={{
                                    width: 'auto',
                                    display: 'inline-flex',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '0.75rem',
                                    position: 'relative',
                                    margin: 'auto',
                                    fontSize: '1rem',
                                    marginLeft: '0.5rem'
                                }}>{username}</p>
                            </div>
                            <div style={{ width: 'inheret' }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'column',
                                    textAlign: 'left',
                                    backgroundColor: '#94D2BD',
                                    padding: '4px',
                                    margin: '0.5rem',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    color: '#001219',
                                    fontSize: '1rem',
                                }}>
                                    {messages[i].message}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )
        }
        setMyArray(messageHistoryArray.reverse())
    }

    const saySomething = () => {
        refetch({ id: _idUpdate });
    }

    setInterval(saySomething, 1000)


    const DMBoxCreator = () => {
        ////////////////////////////////////////////////////////
        // [][][][][][][][] - STATE MANAGMENT - [][][][][][][][]
        ////////////////////////////////////////////////////////
        const [userMessageData, setUserMessageData] = useState({ message: '' });
        const [validated] = useState(false);

        //////////////////////////////////////////////////
        // [][][][][][][][] - VARIABLES - [][][][][][][][]
        //////////////////////////////////////////////////
        // const me = UserData();

        ///////////////////////////////////////////////////
        // [][][][][][][][] - DM HANDLER - [][][][][][][][]
        ///////////////////////////////////////////////////
        const handleInputChange = (event) => {
            const { name, value } = event.target;
            setUserMessageData({ [name]: value });
        };


        const handleCreateNewMessage = async (event) => {
            event.preventDefault();


            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }

            try {
                await createNewMessage(
                    {
                        variables: {
                            commid: commStorage.communication[0]._id,
                            userid: props.user?._id,
                            message: userMessageData.message,
                            username: props.user?.username
                        }
                    }
                );
            } catch (e) { console.error(e); }
        }
        if (creatorInit && userMessageData.message === '') {

            refetch({ id: commStorage.listingid });
            setTimeout(() => {
                for (let i = 0; i < props.data.pfclist.length; i++) {
                    if (props.data.pfclist[i].communication[0]._id === commStorage.communication[0]._id) {
                        setMessagesCurrentLength(props.data.pfclist[i].communication[0].messages.length)
                        if (messagesCurrentLength > messagesPreviousLength) {
                            DisplayMessages(props.data.pfclist[i].communication[0].messages)
                            setMessagesPreviousLength(props.data.pfclist[i].communication[0].messages.length)
                        }
                    }
                }
            }, 100)
        }

        //////////////////////////////////////////////////////////
        // [][][][][][][][] - DM USER INTERFACE - [][][][][][][][]
        //////////////////////////////////////////////////////////
        return (
            <div>
                {displayButtonArray ?
                    <div>
                        <div style={{
                            width: '60vw',
                            margin: 'auto',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column-reverse'
                        }}
                        >{buttonArray}
                        </div>
                    </div>
                    :
                    null
                }
                {creatorInit ?
                    <div style={{
                        backgroundColor: '#001219',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        width: '70vw',
                        border: 'solid',
                        borderColor: 'white',
                        borderRadius: '10px',
                        margin: 'auto'
                    }}>
                        <Row style={{ margin: '1vw' }}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <p style={{ backgroundColor: '#EE9B00', height: '1rem', width: '1rem', margin: '0 1rem', borderRadius: '0.5rem' }}></p>
                                <p style={{ margin: 'auto 0' }}>{commStorage.communication[0].username}&nbsp; : &nbsp;</p>
                                <p style={{
                                    color: 'white',
                                    margin: '10px',
                                    justifyContent: 'left'
                                }}>{messagesCurrentLength} Messages
                                </p>
                                <Button
                                    onClick={() => {
                                        setDMBoxShow(false);
                                        window.location.reload(false)
                                    }}
                                    style={{
                                        background: 'transparent',
                                        borderLeft: 'solid',
                                        borderWidth: 'thin',
                                        borderColor: 'rgba(148, 210, 189, 0.2)',
                                        color: 'white'
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        </Row>
                        <div style={{
                            backgroundColor: '#001219',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            width: '70vw',
                            border: 'solid',
                            borderColor: 'white',
                            borderRadius: '10px',
                            margin: 'auto'
                        }}>
                            <div style={{ margin: '1vw 10vw 1vw 10vw' }}>
                                <div>
                                    <div style={{
                                        height: '30vh',
                                        overflow: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column-reverse'
                                    }}
                                    >{myArray}
                                    </div>
                                </div>
                                <div>
                                </div>
                                <Form
                                    noValidate
                                    validated={validated}
                                    onSubmit={handleCreateNewMessage}
                                    style={{
                                        width: windowWidth * 1.2, margin: 'auto'
                                    }}>
                                    <Form.Group style={{}}>
                                        <InputGroup
                                            className="mb-3"
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                flexDirection: 'column'
                                            }}>
                                            <p style={{
                                                width: 'fit-content',
                                                display: 'flex',
                                                backgroundColor: 'black',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '8px',
                                                position: 'relative',
                                                marginBottom: 'initial',
                                                fontSize: '1rem'
                                            }}>{props.user?.username}</p>
                                            <Form.Control
                                                as='textarea'
                                                placeholder="Your message"
                                                name='message'
                                                onChange={handleInputChange}
                                                value={userMessageData.message}
                                                style={{
                                                    background: 'transparent',
                                                    borderLeft: 'solid',
                                                    borderWidth: 'thin',
                                                    borderColor: 'rgba(148, 210, 189, 0.2)',
                                                    color: 'white',
                                                    borderRadius: '10px'
                                                }}
                                                autoComplete="off"
                                            />

                                            <Button
                                                disabled={!(userMessageData.message)}
                                                type='submit'
                                                variant='success'
                                                style={{
                                                    backgroundColor: '#94D2BD',
                                                    color: '#001219',
                                                    borderLeft: 'solid',
                                                    borderWidth: 'thin',
                                                    borderColor: 'rgba(148, 210, 189, 0.2)',
                                                }}
                                            >
                                                Submit
                                            </Button>
                                        </InputGroup>
                                        <Form.Control.Feedback type='invalid'>Send a message!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        )
    }

    return (
        <>
            <Button
                style={{
                    borderColor: 'rgba(223, 164, 247, 0.62)',
                    backgroundColor: 'rgba(66, 23, 77, 0.62)',
                    color: 'white',
                    fontSize: '2vh',
                    borderRadius: '5px',
                    margin: '5px',
                    padding: '8px'
                }}
                onClick={(event) => { setTimeout(() => { setShowDMs(true) }, 500); event.preventDefault(); DMCreatorInit(); }}
            >CONTACT</Button>
            {/* <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 250 }}
                overlay={renderWatchToolTip}
            > */}
            {watchlistStatus ?
                <>
                    <HandleRemoveFromWatchlist data={props.data} user={props.user} />
                </>
                :
                <>
                    {!authenticatedUserListings ?
                        <HandleAddToWatchlist data={props.data} user={props.user} state='enabled' />
                        :
                        <HandleAddToWatchlist data={props.data} user={props.user} state='disabled' />
                    }
                </>
            }
            {/* </OverlayTrigger> */}
            <p style={{ fontSize: '1.5vh' }}><CalculateNumberOfWatchers data={props.data} />&nbsp; Watching </p>
            {noDM ?
                <div>
                    <p>No Direct Messages yet!</p>
                </div>
                :
                null
            }

            {authenticatedUserListings && showDMs ?
                <>
                    <DMBoxCreator />
                    {DMFalseStatement}
                </>
                :
                null
            }
        </>
    )
}