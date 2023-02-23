import React, { useState } from 'react';
import { Row, Spinner, Button } from 'react-bootstrap';
import QRCode from 'qrcode';
import {
    strikeIssueNewInvoiceForSpecifiedReceiver,
    strikeGetEvents,
    strikeIssueNewQuoteForSpecifiedInvoice,
    correlationId,
    lnInvoice,
    apiCallTime
} from '../utils/API';
import { UPDATE_USER, } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import copy from 'copy-to-clipboard';
import axios from 'axios';
import strikeIcon from '../assets/stikeicon.png';
import Modal from './ModalV';
import { UserData } from '../components/ApolloQueries/UserData';
import bulletwalleticon from '../assets/bluewalleticon.png';
import cashappicon from '../assets/cashappicon.png';
import strikeicon from '../assets/stikeicon.png';
import lnicon from '../assets/lnicon.png';


const businessOwner = `${process.env.REACT_APP_OWNER}`;

const DemoAppInvoiceAndQuote = () => {
    localStorage.setItem("strikeBtnSelected", false);


    // let imageQRCode;
    let amount = 0.25;
    let correlationIdLocal;
    // let intervalID;

    const [imageQRCode, setImageQRCode] = useState('')
    const [displayQRCode, setDisplayQRCode] = useState(false);
    const [eventID, setEventID] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [startLoadingProcess, setStartLoadingProcess] = useState(false)
    const [count, setCount] = useState(0);
    const [remainder, setRemainder] = useState(30);
    const [correlationValue, setCorrelationValue] = useState('');
    const [updateUser] = useMutation(UPDATE_USER);
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [displayHelpContent, setDisplayHelpContent] = useState(false);
    const [paymentReceivedFalseStatement, setPaymentReceivedFalseStatement] = useState(true);
    const [runModal, setRunModal] = useState(false);
    const me = UserData();

    // [[[SPINNER]]]
    // Loads the React Bootstrap Spinner.
    function LoadingSpinner() {
        return (
            <Spinner style={{ margin: '10px', color: 'white' }} animation="border" role="status"></Spinner>
        );
    }

    const envelope = (recipient, amount) => {
        strikeIssueNewInvoiceForSpecifiedReceiver(recipient, amount, "Honest Patina Verification");
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
                    updateVerificationStatus(true);
                    setPaymentReceived(true)
                }
                else if (response.data.state === 'UNPAID') {
                    setPaymentReceived(false)
                    setPaymentReceivedFalseStatement(false)
                }
            })
            .catch((error) => { console.log(error); });
    }

    const updateVerificationStatus = async (status) => {
        try {
            await updateUser({
                variables: {
                    username: me?.username,
                    email: me?.email,
                    profilepicture: me?.profilepicture,
                    primarylocation: me?.primarylocation,
                    verified: status
                }
            });
            localStorage.setItem("lnInvoice", null); 
            localStorage.setItem("correlationIdLocal", null)
        }
        catch (e) { console.error(e); }
    }


    return (
        <>
            {!me?.verified ?
                <>
                    <button
                        onClick={() => {
                            setModalShow(true);
                            envelope(businessOwner, amount);
                        }}
                        type='button'
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
                        type='button'
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
                :
                <p>You are verified!</p>
            }
        </>
    )
}

export default DemoAppInvoiceAndQuote;
