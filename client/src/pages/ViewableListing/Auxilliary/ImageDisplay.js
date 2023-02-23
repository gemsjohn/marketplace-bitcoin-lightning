import React from "react";
import { useQuery } from '@apollo/client';
import { GET_LISTING_BY_ID } from '../../../utils/queries';
import { IKImage, IKContext } from 'imagekitio-react';
import '../../../index.css';

const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;

function ImageDisplay() {
    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const { data: viewed } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    
    let ViewableListingData = viewed?.listing || {};
    let listingMediaArray = [];
    let url;

    for (let i = 0; i < ViewableListingData?.media.length; i++) {
        listingMediaArray[i] =
            <div key={i}>
                {/* eslint-disable-next-line */}
                <IKContext urlEndpoint={urlEndpoint}>
                    <IKImage
                        src={url}
                        transformation={[{
                            height: '14rem',
                            width: 'auto',
                            cropMode: 'fo-custom',
                            bg: 66000000,
                            q: 100
                        }]}
                    />
                    <img
                        src={ViewableListingData.media[i]}
                        style={{
                            height: '14rem',
                            width: 'auto',
                            margin: '0.5rem',
                            borderRadius: '10px'
                        }}
                        alt=""
                    />
                </IKContext>
            </div>
    }
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            {listingMediaArray}
        </div>
    )
}

export default ImageDisplay;