import React, { useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import QRCode from 'qrcode';
import {
    strikeIssueNewInvoiceForSpecifiedReceiver,
    strikeGetEvents,
    strikeIssueNewQuoteForSpecifiedInvoice,
    correlationId,
    lnInvoice,
} from '../utils/API';
import { ADD_TO_PFC_LIST, UPDATE_PFC_LIST, INIT_COMMUNICATION, REMOVE_FROM_PFC_LIST } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import copy from 'copy-to-clipboard';
import axios from 'axios';
import { UserData } from './ApolloQueries/UserData';
import { GET_LISTING_BY_ID } from '../utils/queries';
import strikeIcon from '../assets/stikeicon.png';
import moment from 'moment';
import Modal from '../components/ModalV';
import bulletwalleticon from '../assets/bluewalleticon.png';
import cashappicon from '../assets/cashappicon.png';
import strikeicon from '../assets/stikeicon.png';
import lnicon from '../assets/lnicon.png';


const businessOwner = `${process.env.REACT_APP_OWNER}`;

const DemoAppInvoiceAndQuote = () => {
    localStorage.setItem("strikeBtnSelected", false);
    // let imageQRCode;
    let amount = 0.10;
    let correlationIdLocal;
    let pfc;
    let momentDateTime = moment().format('MMMM Do YYYY');

    const [imageQRCode, setImageQRCode] = useState('')
    const [displayQRCode, setDisplayQRCode] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [remainder, setRemainder] = useState(30);
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [paymentReceivedFalseStatement, setPaymentReceivedFalseStatement] = useState(true);
    const [displayHelpContent, setDisplayHelpContent] = useState(false);
    const [addToPFCList] = useMutation(ADD_TO_PFC_LIST);
    const [listingData, setListingData] = useState({});
    const [runDisplayMessagesInit, setRunDisplayMessagesInit] = useState(false);

    const [initCommunication] = useMutation(INIT_COMMUNICATION);;
    const [updatePFCList] = useMutation(UPDATE_PFC_LIST);
    const [removeFromPFCList] = useMutation(REMOVE_FROM_PFC_LIST);

    const me = UserData();

    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));

    const { data: viewed, refetch } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    let ViewableListingData = viewed?.listing || {};;

    // [[[SPINNER]]]
    // Loads the React Bootstrap Spinner.
    function LoadingSpinner() {
        return (
            <Spinner style={{ margin: '10px', color: 'white' }} animation="border" role="status"></Spinner>
        );
    }

    const envelope = (recipient, amount, item) => {
        strikeIssueNewInvoiceForSpecifiedReceiver(recipient, amount, item);
        let intervalID = setInterval(function () {
            if (lnInvoice === localStorage.getItem("lnInvoice")) {
                QRCode.toDataURL(lnInvoice, function (err, url) {
                    setImageQRCode(url);
                })
                setDisplayQRCode(true);
                clearInterval(intervalID)

            }
        }, 100)
    }

    const resetEnvelope = () => {
        setDisplayQRCode(false);
    }

    const [copySuccess, setCopySuccess] = useState('');

    function copyLink() {
        copy(lnInvoice);
        copy(lnInvoice, {
            onCopy: null
        });
        setCopySuccess("Copied!");
    }

    const checkStatus = () => {
        let config = {
            method: 'get',
            url: `https://api.strike.me/v1/invoices/${localStorage.getItem("correlationIdLocal")}`,
            headers: {
                'Accept': 'application/json',
                authorization: `Bearer ${process.env.REACT_APP_STRIKE_API}`
            }
        };
        axios(config)
            .then((response) => {
                if (response.data.state === 'PAID') {
                    setPaymentReceived(true)
                    handleAddToPFCList(localStorage.getItem("correlationIdLocal"), true)
                }
                else if (response.data.state === 'UNPAID') {
                    setPaymentReceived(false)
                    setPaymentReceivedFalseStatement(false)
                }
            })
            .catch((error) => { console.log(error); });
    }

    const handleAddToPFCList = async (eventID, pfc) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            await addToPFCList({
                variables: {
                    listingid: localStorage.getItem("listingID"),
                    listingtitle: localStorage.getItem("listingTitle"),
                    listingcreatorid: localStorage.getItem("listingCreatorID"),
                    userid: localStorage.getItem("userID"),
                    bool: pfc,
                    communication: [],
                    eventid: eventID,
                }
            });
            refetch({ id: _idUpdate });
            setRunDisplayMessagesInit(true);

        } catch (e) {
            console.error(e);
        }
    };

    const DisplayMessagesInit = () => {
        setTimeout(() => {
            let PFCListArray = ViewableListingData.pfclist;
            if (PFCListArray.length > 0) {
                for (let i = 0; i < PFCListArray.length; i++) {
                    if (PFCListArray[i].userid === me._id) {
                        handleUpdatePFCListStage2(PFCListArray[i])
                    }
                }
            }

        }, 1000)

    }

    if (runDisplayMessagesInit) {
        DisplayMessagesInit()
    }

    const handleUpdatePFCListStage2 = async (arr) => {
        try {
            await initCommunication({
                variables: {
                    pfcid: arr._id,
                    messages: [],
                    status: true,
                    username: me?.username,
                    date: momentDateTime
                }
            });

        } catch (e) { console.error(e); }
        setModalShow(false)
        localStorage.setItem("lnInvoice", null); 
        localStorage.setItem("correlationIdLocal", null)
        window.location.reload(false)
    }

    return (
        <>
            <button
                onClick={() => {
                    setModalShow(true);
                    envelope(businessOwner, amount, localStorage.getItem("itemTitle"));
                }}
                style={{
                    backgroundColor: '#55a630',
                    border: 'none',
                    borderRadius: '10px',
                    outline: 'none',
                    alignItems: 'center',
                    margin: '1rem',
                    color: 'white',
                    width: 'fit-content'
                }}
            >
                <p style={{ alignItems: 'center', margin: 'auto', padding: '0.5rem' }}><i className="fa-solid fa-bolt"></i> Pay $0.10 to Communicate</p>

            </button>
            <button
                onClick={() => {
                    setDisplayHelpContent(current => !current)
                }}
                style={{
                    backgroundColor: '#e63946',
                    border: 'none',
                    borderRadius: '10px',
                    outline: 'none',
                    alignItems: 'center',
                    margin: '1rem',
                    color: 'white',
                    width: 'fit-content'
                }}
            >
                <p style={{ alignItems: 'center', margin: 'auto', padding: '0.5rem' }}>Help</p>

            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {displayHelpContent ?
                    <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.75)', borderRadius: '20px', padding: '1rem' }}>
                        <p style={{ backgroundColor: 'rgba(230, 57, 70, 1)', borderRadius: '20px', padding: '1rem' }}>Help</p>
                        <div style={{ display: 'flex', padding: '0.1rem' }}>
                            <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
                                1. You need a Bitcoin Lightning compatable digital wallet such as Cash App, Strike, Bluewallet, etc.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '0.1rem', fontSize: '1rem', width: 'fit-content', margin: 'auto' }}>
                            <a
                                style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
                                href='https://cash.app/'
                            >
                                <img src={cashappicon} style={{ height: '4rem', borderRadius: '10px' }}></img>
                            </a>
                            <a
                                style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
                                href='https://strike.me/'
                            >
                                <img src={strikeicon} style={{ height: '4rem', borderRadius: '10px' }}></img>
                            </a>
                            <a
                                style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
                                href='https://bluewallet.io/'
                            >
                                <img src={bulletwalleticon} style={{ height: '4rem', borderRadius: '10px' }}></img>
                            </a>
                        </div>
                        {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
                            <p style={{ padding: '0.1rem' }}>2. Follow this 1 min video</p>
                        </div> */}
                    </div>

                    :
                    null
                }
            </div>
            <Modal onClose={() => { setModalShow(false); resetEnvelope(); localStorage.setItem("lnInvoice", null); localStorage.setItem("correlationIdLocal", null) }} show={modalShow}>
                {!paymentStatus ?
                    <>
                        {displayQRCode ?
                            <>
                                <img src={lnicon} style={{ height: '4rem', position: 'absolute', zIndex: '1', marginTop: '-5rem' }} />
                                <p
                                    style={{
                                        height: '4rem',
                                        position: 'absolute',
                                        marginTop: '-5rem',
                                        color: 'white',
                                        marginLeft: '-0.1rem',
                                        backgroundColor: 'black',
                                        padding: '1rem',
                                        borderRadius: '20px',
                                        width: '22rem',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>Lightning Network Invoice</p>
                                {imageQRCode ?

                                    <Row>
                                        <div style={{ margin: 'auto' }}>

                                            <img src={imageQRCode} alt=""></img>
                                        </div>
                                    </Row>
                                    :
                                    <Row>
                                        <div style={{ margin: 'auto' }}>
                                            <p style={{ color: '#EE9B00' }}>Clear and try again.</p>
                                        </div>
                                    </Row>
                                }

                                <button
                                    onClick={() => copyLink()}
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        borderStyle: 'none',
                                        borderRadius: '10px',
                                        width: '20rem',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        margin: '10px auto',
                                        padding: '0.5rem'
                                    }}
                                >
                                    Copy &nbsp;<i className="fa-solid fa-bolt"></i>&nbsp; Invoice
                                </button>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: 'white', margin: 'auto' }}>{copySuccess}</div>
                                <button
                                    onClick={() => {
                                        checkStatus()
                                    }}
                                    style={{
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        borderStyle: 'none',
                                        borderRadius: '10px',
                                        width: '20rem',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        margin: 'auto',
                                        padding: '0.5rem'
                                    }}
                                >Select to Confirm Payment</button>
                                {paymentReceived ?
                                    <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: 'green', }}>Payment Received!</p>
                                    :
                                    <>
                                        {paymentReceivedFalseStatement ?
                                            null
                                            :
                                            <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: '#EE9B00', marginTop: '1rem' }}>The Payment has not been received.</p>
                                        }
                                    </>
                                }
                                <button
                                    onClick={() => {
                                        resetEnvelope();
                                        setModalShow(false);
                                        setTimeout(() => {
                                            window.location.reload(false);
                                        }, 100)

                                    }}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderStyle: 'none',
                                        borderRadius: '10px',
                                        width: '20rem',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        margin: '10px auto',
                                        padding: '0.5rem'
                                    }}>Clear</button>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={strikeIcon} style={{ height: '3rem', width: '3rem' }} alt="" />
                                    <p style={{ color: 'white', margin: 'auto 1rem' }}>Powered by Strike API</p>
                                </div>
                            </>
                            :
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <LoadingSpinner />
                            </div>

                        }
                    </>
                    :
                    null
                }

            </Modal>
        </>
    )
}

export default DemoAppInvoiceAndQuote;