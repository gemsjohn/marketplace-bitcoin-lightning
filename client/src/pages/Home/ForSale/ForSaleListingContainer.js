import React, { useState, useReducer, useEffect } from "react";
import { Button, Row, Nav } from 'react-bootstrap';
import { IKImage, IKContext } from 'imagekitio-react';
import { Link } from 'react-router-dom';
import SelectStyle from '../../../Stylizer';
import Auth from '../../../utils/auth';
import { UserData } from '../../../components/ApolloQueries/UserData';
import { ListingData } from '../../../components/ApolloQueries/ForSaleListingData';
import { strikeGetCurrencyExchangeRateTickers } from '../../../utils/API';
import fourGrid from '../../../assets/4grid.png';
import nineGrid from '../../../assets/9grid.png';
import USDBTCTransfer from '../../../assets/transfer.png';
import HandleForsaleButton from './ForSaleButton';
import ListingSearchBarLocation from '../Main/LocationSearchBar'
import ListingSearchBarCategory from '../Main/CategorySearchBar';
import honestpatinalogo from '../../../assets/honestpatinalogo.png';

window.onload = strikeGetCurrencyExchangeRateTickers();

// [[[VARIABLES]]]
const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;
const RenderImg = honestpatinalogo;
let cardWidth = ['10rem', '17rem', '23rem'];
let authenticatedUserListings = false;
let imageWidth = [140, 250, 340];
let imageHeight = [100, 175, 245];
let priceSize = ['0.75rem', '1rem', '1rem'];
const listingCardArray = []; // Reset the array on page load
let btcValue;

// [[[STYLING]]]
const coreFeatureAssetStyle = {
  borderRadius: 10,
  margin: 5,
  color: 'white'
}

const styles = {
  cardImage: {
    borderRadius: '10px 10px 0 0'
  },
  cardText: {
    fontSize: '1rem',
    marginTop: '0.5rem'
  }
}

// [[[RESIZING FEATURE]]]
const sizeReducer = (sizeState, action) => {
  switch (action.type) {
    case 'size_0':
      return { size: 0 }
    case 'size_1':
      return { size: 1 }
    case 'size_2':
      return { size: 2 }
    default:
      console.log('this is the default')
      return sizeState
  }
}

function ForSaleCards() {
  const [currencyToggle, setCurrencyToggle] = useState(true);
  const [cardGridButton, setCardGridButton] = useState(false);

  const updateCurrencyToggle = () => {
    if (currencyToggle) {
      setCurrencyToggle(false)
    } else {
      setCurrencyToggle(true)
    }
  }

  btcValue = localStorage.getItem('localBtcStorage');

  const me = UserData();
  const getListings = ListingData();
  // console.log(getListings)

  // [[[RESIZING FEATURE]]]
  const initialSize = { size: 0 };
  const [sizeState, dispatch] = useReducer(sizeReducer, initialSize);

  const size_0 = () => {
    dispatch({ type: 'size_0' })
    setCardGridButton(false);
  };
  // const size_1 = () => dispatch({ type: 'size_1' });
  const size_2 = () => {
    dispatch({ type: 'size_2' })
    setCardGridButton(true);
  };

  useEffect(() => { }, [sizeState.size])

  const commonShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: SelectStyle[7].shopMenuPanel,
    padding: 10,
    width: cardWidth[sizeState.size],
    height: 'auto',
    border: 'none'
  }
  const authenticatedUserShopPanelStyles = {
    ...coreFeatureAssetStyle,
    backgroundColor: '#00bbf9',
    padding: 10,
    width: cardWidth[sizeState.size],
    height: 'auto',
    border: 'none'
  }



  // [[[LISTINGCARD LOOP]]]: Imagekit.io, localstorage, listingCardArray.
  for (let i = 0; i < getListings.length; i++) {
    function ValidateText() {
      let http = new XMLHttpRequest();
      const pattern = /^((http|https|ftp):\/\/)/;
      let url = getListings[i].media[0] || [];
      http.open('HEAD', pattern.test(url), false);

      // console.log(pattern.test(url))

      if (pattern.test(url)) {
        return (
          <>
            <IKContext urlEndpoint={urlEndpoint}>
              <IKImage
                src={url}
                style={{
                  ...styles.cardImage,
                  position: 'absolute',
                  zIndex: '1'
                }}
                transformation={[{
                  height: imageHeight[sizeState.size],
                  width: imageWidth[sizeState.size],
                  cropMode: 'fo-custom',
                  bg: 66000000,
                  q: 100
                }]}
              />
              <img
                src={RenderImg}
                style={{
                  ...styles.cardImage,
                  height: imageHeight[sizeState.size],
                  width: imageWidth[sizeState.size]
                }}
                alt={{}}
              />
            </IKContext>
          </>
        )
      } else {
        return (
          <IKContext urlEndpoint={urlEndpoint}>
            <IKImage
              src={RenderImg}
              style={styles.cardImage}
              transformation={[{
                height: imageHeight[sizeState.size],
                width: imageWidth[sizeState.size],
                cropMode: 'fo-custom',
                bg: 66000000,
                q: 100
              }]}
            />
          </IKContext>
        )
      }
    }
    ValidateText();


    // Store the listing ID in local storage so that the listing data can be read on the /listing page 
    function handleLocalStorage() {
      localStorage.removeItem('listingID');
      localStorage.setItem('listingID', JSON.stringify(getListings[i]._id));

    }

    // If authenticated user has a listing on the page, then the card background color is distinguished from the rest and 'Add to Watchlist' is disabled
    if (me._id === getListings[i].creatorid) {
      authenticatedUserListings = true;
    } else {
      authenticatedUserListings = false;
    }

    const getListPrice = getListings[i].price;
    // let getListBtcPriceFiltered = parseFloat((getListPrice / btcValue)).toFixed(8);
    let getListBtcPriceFiltered = parseFloat((getListPrice / btcValue) * 100000000).toFixed(0);

    function Commafy(num) {
      var str = num.toString().split('.');
      if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      }
      if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
      }
      return str.join('.');
    }

    function BTCCommafy(num) {
      var str = num.toString().split('.');
      if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      }
      if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
      }
      return str.join('.');
    }

    // Store the card and corresponding data in an array
    listingCardArray[i] =
      <div key={i}>
        <Button
          style={(
            Auth.loggedIn() && authenticatedUserListings ?
              authenticatedUserShopPanelStyles
              :
              commonShopPanelStyles
          )}
          onClick={handleLocalStorage}
          as={Link}
          to='/listing'
        >
          <div>
            {/* Card Image */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              <ValidateText />
              <p
                style={{
                  position: 'absolute',
                  zIndex: '2',
                  color: '#EE9B00',
                  backgroundColor: '#f1faee',
                  width: 'auto',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  marginTop: '-1rem',
                  marginLeft: imageWidth[sizeState.size] - 10,
                  fontWeight: 'bold',
                  alignItems: 'center'
                }}
              >
                {getListings[i]?.watchlist.length}
                &nbsp;
                <i className="fa-regular fa-star"></i>
              </p>
            </div>
            {/* Card Price and Details Button */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0.5rem auto auto auto',
                backgroundColor: '#edf2f4',

                borderRadius: '10px'
              }}>
              <div>
                {currencyToggle ?
                  <>
                    <div>
                      <div
                        style={{
                          fontSize: '2.5vh',
                          margin: '0.25rem',
                        }}>
                        <Row style={{ alignItems: 'center', padding: '0.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <i
                            className="fa-solid fa-sack-dollar"
                            style={{
                              backgroundColor: '#90be6d',
                              padding: '0.25rem',
                              borderRadius: '10px',
                              margin: 'auto'
                            }}>
                          </i>
                          &nbsp;
                          &nbsp;
                          <p style={{ fontSize: '1.8vh', margin: 'auto', color: '#001219', }}>$ {Commafy(getListPrice)}</p>
                        </Row>
                      </div>
                    </div>
                  </>
                  :
                  <>
                    <div>
                      <Row style={{ alignItems: 'center', padding: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <i
                          className="fa-brands fa-bitcoin"
                          style={{
                            backgroundColor: '#ff9f1c',
                            padding: '0.25rem',
                            borderRadius: '10px'
                          }}>
                        </i>
                        <p
                          style={{
                            margin: '0.25rem',
                          }}>
                          <p style={{ fontSize: '1.8vh', margin: 'auto', color: '#001219', }}>{BTCCommafy(getListBtcPriceFiltered)} sats</p>

                        </p>
                      </Row>
                    </div>
                  </>
                }
              </div>
            </div>
            {/* Card Text */}
            <div
              style={{
                height: 'auto',
                marginBottom: '0.5vh'
              }}>
              <p
                style={{
                  margin: '0.5rem',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {getListings[i].title ?
                  getListings[i].title
                  :
                  "Title"
                }
              </p>
              <p
                style={{
                  margin: '0.1rem',
                  fontSize: '1rem'
                }}>
                {getListings[i].date}
              </p>
            </div>


          </div >
        </Button >
      </div >
  }
  return (
    <>
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
      <div>
        <Row
          style={{
            margin: 'auto auto 0 auto',
            width: '80vw'
          }}>
          <HandleForsaleButton />
        </Row>
      </div>
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
        <Nav.Link
          as={Link}
          to='/sellingform'
          style={{ margin: 'auto' }}
        >
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
              fontSize: '1.5rem',
              alignItems: 'center'
            }}
          >
            <i className="fa-solid fa-plus"></i>
            &nbsp;
            ADD
          </Button>
        </Nav.Link>
        <div
          style={{
            marginLeft: '60vw',
            marginTop: '1rem',
            position: 'absolute'
          }}>
          <span
            onClick={() => updateCurrencyToggle()}
            style={{
              margin: '0.5rem'
            }}>
            <img
              src={USDBTCTransfer}
              style={{ height: '20px', width: 'auto' }}
              alt=""
            ></img>
          </span>
          {cardGridButton ?
            <span
              style={{ margin: '0.5rem' }}
              onClick={size_0}
            >
              <img
                src={nineGrid}
                style={{ height: '20px', width: 'auto' }}
                alt=""
              ></img>
            </span>
            :
            <span
              style={{ margin: '0.5rem' }}
              onClick={size_2}
            >
              <img
                src={fourGrid}
                style={{ height: '20px', width: 'auto' }}
                alt=""
              ></img>
            </span>
          }
        </div>


      </div>
      <div style={{}}></div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100vw'
        }}>
        {listingCardArray.reverse()}
      </div>
    </>
  )
}

export default ForSaleCards;