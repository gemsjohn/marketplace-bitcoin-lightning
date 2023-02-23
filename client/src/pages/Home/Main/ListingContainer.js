import React, { useState } from "react";
import { Row, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HandlerPrimaryButtons from './PrimaryButtons';
import bulletwalleticon from '../../../assets/bluewalleticon.png';
import cashappicon from '../../../assets/cashappicon.png';
import strikeicon from '../../../assets/stikeicon.png';
import listingicon from '../../../assets/listing.png';
import listingsample from '../../../assets/viewablelisting.png';
import honestpatinalog from '../../../assets/honestpatinalogo.png';
import ad_0 from '../../../assets/Ad_0.png';
import ad_1 from '../../../assets/Ad_1.png';
import ad_2 from '../../../assets/Ad_2.png';
import ListingSearchBarLocation from '../Main/LocationSearchBar'
import ListingSearchBarCategory from '../Main/CategorySearchBar';
import SignupVerification from "./Youtube/SignupVerification";
import ViewUserProfile from "./Youtube/ViewUserProfile";
import CreateForSale from "./Youtube/CreateForSale";
import CreateWanted from "./Youtube/CreateWanted";
import FilterListingTrustReport from "./Youtube/FilterListingTrustReport";
import PayToCommunicate from "./Youtube/PayToCommunicate";
import AddRemoveWatchlist from "./Youtube/AddRemoveWatchlist";
import EditListing from "./Youtube/EditListing";
import StrikeDemo from "./Youtube/StrikeDemo";
import CashAppDemo from './Youtube/CashAppDemo';
import Auth from '../../../utils/auth';
import SignupForm from "../../Signup/SignupForm";

function ListingCard() {
  const [bulletA, setBulletA] = useState(false);
  const [bulletB, setBulletB] = useState(false);
  const [bulletC, setBulletC] = useState(false);
  const [bulletD, setBulletD] = useState(false);

  const userDetailFields = [
    {
      label: 'List For Sale or Wanted ads',
      content: 'Text',
    },
    {
      label: 'Eliminate Direct Message (DM) spam',
      content: 'Text',
    },
    {
      label: 'Filter by City or Category',
      content: 'Text',
    },
    {
      label: 'Search for keywords',
      content: 'Text',
    }
  ]

  const MainText = () => {
    return (
      <>
        {bulletA ?
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
                width: '80vw',
                marginTop: '1rem'
              }}
              onClick={() => setBulletA(false)}
            >
              <p style={{ margin: 'auto' }}>
                &nbsp;
                {userDetailFields[0].label}
                &nbsp;
                <i className="fa-solid fa-arrow-up"></i>
              </p>

            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              textAlign: 'left',
              margin: 'auto',
              width: '70vw',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                <p style={{ margin: 'auto 0' }}>1. {Auth.loggedIn() ? "Step 1 complete, you are already logged in!" : null}</p>
                {Auth.loggedIn() ?
                  null
                  :
                  <Nav.Link as={Link} to='/login'>
                    <span
                      className="Nav-style"
                      style={{ width: '10rem' }}
                    >
                      <span style={{ backgroundColor: '#f9c74f', color: '#001219', padding: '10px', borderRadius: '10px', fontSize: '2vh' }} >
                        Login | Sign Up
                      </span>
                    </span>
                  </Nav.Link>
                }
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                <p style={{ margin: 'auto 0' }}>2. Select &nbsp;</p>
                <Nav.Link as={Link} to='/forsale' style={{ padding: '0' }}>
                  <Button style={{
                    width: '100%',
                    fontSize: '2vh',
                    background: 'transparent',
                    border: 'none',
                    borderLeft: 'solid',
                    borderTop: 'solid',
                    borderRight: 'solid',
                    borderBottom: 'solid',
                    borderWidth: 'thin',
                    borderColor: 'rgba(148, 210, 189, 0.2)'
                  }}
                  >For Sale</Button>
                </Nav.Link>
                <p style={{ margin: 'auto 0' }}>&nbsp; OR &nbsp;</p>
                <Nav.Link as={Link} to='/wanted' style={{ padding: '0' }}>
                  <Button style={{
                    width: '100%',
                    fontSize: '2vh',
                    background: 'transparent',
                    border: 'none',
                    borderLeft: 'solid',
                    borderTop: 'solid',
                    borderRight: 'solid',
                    borderBottom: 'solid',
                    borderWidth: 'thin',
                    borderColor: 'rgba(148, 210, 189, 0.2)'
                  }}
                  >Wanted</Button>
                </Nav.Link>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                <p style={{ margin: 'auto 0' }}>3. Select &nbsp;</p>
                <Button
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    background: 'transparent',
                    color: 'white',
                    border: 'solid',
                    borderWidth: 'thin',
                    borderColor: '#EE9B00',
                    padding: '1rem',
                    fontSize: '2vh',
                    alignItems: 'center'
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  &nbsp;
                  ADD
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                <p>4. Fill out the listing form and submit</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0.1rem 0' }}>
                <img src={listingicon} style={{ height: '10rem', width: '10rem' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
                <p>5. Edit directly on your listed item</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0.1rem 0' }}>
                <img src={listingsample} style={{ height: '12rem', width: '12rem' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
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
              width: '80vw',
              marginTop: '1rem'
            }}
            onClick={() => setBulletA(true)}
          >
            <p style={{ margin: 'auto' }}>
              &nbsp;
              {userDetailFields[0].label}
              &nbsp;
              <i className="fa-solid fa-arrow-down"></i>
            </p>
          </div>
        }
        {bulletB ?
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
                width: '80vw',
                marginTop: '1rem'
              }}
              onClick={() => setBulletB(false)}
            >
              <p style={{ margin: 'auto' }}>
                &nbsp;
                {userDetailFields[1].label}
                &nbsp;
                <i className="fa-solid fa-arrow-up"></i>
              </p>

            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              textAlign: 'left',
              margin: 'auto',
              width: '70vw',
              padding: '1rem'
            }}>

              <p style={{ color: '#EE9B00' }}>What does this mean?</p>
              <p>
                Our Direct Messaging (DM) system, built into your listing, reduces spam by charging the user $0.10 to open communication with you.
                This is a one time fee charged per listing. Once the user has made the payment, messaging is unlimited.
              </p>
              <p style={{ color: '#EE9B00' }}>
                How does it work?
              </p>
              <p>
                On the listing, the user selects DM and receives a QR CODE. This QR CODE contains a Bitcoin Lightning invoice that can be scanned or copied
                with any Bitcoin Lightning compatible wallet such as Cash App, Strike, Bluewallet, etc.
              </p>
              <p style={{ color: '#EE9B00' }}>
                Why use Bitcoin Lightning Network vs traditional payment solutions?
              </p>
              <p>
                Bitcoin Lightning Network transactions are instant, virtually FREE, and accessible. As of 2022, greater than 80 million people have access to
                the network. Traditional payment solutions cant handle a $0.10 charge and they may take days to settle. Scanning the QR CODE and
                completing the $0.10 transaction provides instant access to communicate with the lister.
              </p>
              {/* <p style={{ color: '#EE9B00' }}>
                Demo Videos
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
                <SignupVerification />
                <StrikeDemo />
                <CashAppDemo />
              </div> */}
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
              width: '80vw',
              marginTop: '1rem'
            }}
            onClick={() => setBulletB(true)}
          >
            <p style={{ margin: 'auto' }}>
              &nbsp;
              {userDetailFields[1].label}
              &nbsp;
              <i className="fa-solid fa-arrow-down"></i>
            </p>
          </div>
        }
        {bulletC ?
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
                width: '80vw',
                marginTop: '1rem'
              }}
              onClick={() => setBulletC(false)}
            >
              <p style={{ margin: 'auto' }}>
                &nbsp;
                {userDetailFields[2].label}
                &nbsp;
                <i className="fa-solid fa-arrow-up"></i>
              </p>

            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
              <p style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                textAlign: 'left',
                margin: 'auto',
                width: '70vw',
                padding: '1rem',
                color: '#EE9B00'
              }}>Filter listings by searching for a city and/or selecting a category. If there are no listings in that city then nothing will show.</p>
            </div>
            <div
              style={{
                border: 'solid',
                borderWidth: 'thin',
                borderColor: 'rgba(148, 210, 189, 0.2)',
                borderRadius: '20px',
                margin: '0 1rem 1rem 1rem'
              }}>
              <p style={{ margin: '1rem' }}>
                Filters
              </p>
              <ListingSearchBarLocation />
              <ListingSearchBarCategory />
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
              width: '80vw',
              marginTop: '1rem'
            }}
            onClick={() => setBulletC(true)}
          >
            <p style={{ margin: 'auto' }}>
              &nbsp;
              {userDetailFields[2].label}
              &nbsp;
              <i className="fa-solid fa-arrow-down"></i>
            </p>
          </div>
        }
        {bulletD ?
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
                width: '80vw',
                marginTop: '1rem'
              }}
              onClick={() => setBulletD(false)}
            >
              <p style={{ margin: 'auto' }}>
                &nbsp;
                {userDetailFields[3].label}
                &nbsp;
                <i className="fa-solid fa-arrow-up"></i>
              </p>

            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem auto', width: '70vw' }}>
              <p style={{ margin: 'auto' }}>Use <i className="fa-solid fa-magnifying-glass"></i> in the navigation bar to search for keywords!</p>
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
              width: '80vw',
              marginTop: '1rem'
            }}
            onClick={() => setBulletD(true)}
          >
            <p style={{ margin: 'auto' }}>
              &nbsp;
              {userDetailFields[3].label}
              &nbsp;
              <i className="fa-solid fa-arrow-down"></i>
            </p>
          </div>
        }
      </>

    )
  }

  return (
    <>
      <div>
        <Row
          style={{
            margin: 'auto auto 0 auto',
            width: '80vw'
          }}>
          <HandlerPrimaryButtons />
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
        </Row>
        {Auth.loggedIn() ?
          null
          :
          <Row style={{
            margin: 'auto',
            width: '80vw'
          }}>
            <Nav.Link as={Link} to='/signup' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 'auto' }}>
              <span
                className="Nav-style"
                style={{ width: '70vw' }}
              >
                <span style={{ backgroundColor: '#f9c74f', color: '#001219', padding: '10px', borderRadius: '10px', fontSize: '4vh', padding: ' 0.5rem 5rem' }} >
                  Sign Up
                </span>
              </span>
            </Nav.Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 'auto', }}>
              <SignupForm />
            </div>
          </Row>
        }
        {!Auth.loggedIn() ?
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '2rem 0' }}></div>
          :
          null
        }
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <img src={ad_0} style={{width: '70vw'}} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <img src={ad_1} style={{width: '70vw'}} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <img src={ad_2} style={{width: '70vw'}} />
        </div>

        {/* <div style={{marginBottom: '2rem', width: '100vw', backgroundColor: 'rgba(0, 44, 61, 1)' }}>
          <p style={{ fontSize: '14vw', color: '#90e0ef', margin: 'auto', paddingRight: '4rem' }}>Honest Patina</p> */}
          {/* <div style={{ display: 'flex', fontSize: '5vw' }}>
            <p style={{ width: '80vw', color: 'white', margin: 'auto' }}>
              Peer to Peer Marketplace
            </p>
          </div> */}
          {/* <div style={{ display: 'flex', padding: '0.5rem', fontSize: '5vw' }}>
            <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto', paddingLeft: '6rem', marginTop: '0' }}>
              LIST <strong style={{ color: '#EE9B00' }}>FREE</strong>  FAST AND  <strong style={{ color: '#0077b6' }}>SAFELY</strong>
            </p>
          </div> */}
          {/* <div style={{ display: 'flex', padding: '0.5rem', fontSize: '1.25rem' }}>
            <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
              Leverages the Bitcoin Lightning &nbsp; <i className="fa-solid fa-bolt-lightning"></i> &nbsp; Network to facilitate verification, reduce scams, and reduce direct message spam.
            </p>
          </div> */}
          {/* <div style={{ display: 'flex', padding: '0.1rem', fontSize: '1rem' }}>
            <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
              Use any Lightning compatable digital wallet such as Cash App, Strike, Bluewallet, etc.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '0.1rem', fontSize: '1rem' }}>
            <a
              style={{ background: 'transparent', border: 'none', }}
              href='https://cash.app/'
            >
              <img src={cashappicon} style={{ height: '4rem', borderRadius: '10px', margin: '0.5rem' }}></img>
            </a>
            <a
              style={{ background: 'transparent', border: 'none', }}
              href='https://strike.me/'
            >
              <img src={strikeicon} style={{ height: '4rem', borderRadius: '10px', margin: '0.5rem' }}></img>
            </a>
            <a
              style={{ background: 'transparent', border: 'none', }}
              href='https://bluewallet.io/'
            >
              <img src={bulletwalleticon} style={{ height: '4rem', borderRadius: '10px', margin: '0.5rem' }}></img>
            </a>
          </div> */}
        {/* </div> */}
      </div>

      {Auth.loggedIn() ?
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '2rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginTop: '1rem', backgroundColor: '#005F73', borderRadius: '30px', padding: '1rem' }}>GUIDE</div>
          </div>
          <div style={{ marginBottom: '10rem' }}>
            <MainText />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginTop: '1rem', backgroundColor: '#005F73', borderRadius: '30px', padding: '1rem' }}>DEMO VIDEOS</div>
            </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '70vw', margin: 'auto' }}>
                <SignupVerification />
                <ViewUserProfile />
                <CreateForSale />
                <CreateWanted />
                <FilterListingTrustReport />
                <PayToCommunicate />
                <AddRemoveWatchlist />
                <EditListing />
                <StrikeDemo />
                <CashAppDemo />
              </div>
          </div>
        </>
        :
        null
      }
      {/* <div style={{ display: 'flex', flexWrap: 'wrap', margin: '2rem 2rem', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div> */}
      
      <div style={{ display: 'flex', padding: '0.5rem', fontSize: '4vw' }}>
        <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
          <strong style={{ color: '#219ebc' }}>EMAIL</strong>  admin@honestpatina.com
        </p>
      </div>
      <div style={{ display: 'flex', padding: '0.5rem', fontSize: '4vw' }}>
        <div style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
          <p>Send Feedback or Questions</p>
        </div>
      </div>
      <img src={honestpatinalog} style={{height: '10rem'}} />
      <div style={{marginBottom: '10rem'}}></div>

    </>
  )
}

export default ListingCard;