import React from 'react';
import { useMutation } from '@apollo/client';
import { ADD_WATCHLIST, REMOVE_FROM_WATCHLIST } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import { Button } from 'react-bootstrap';

export const HandleAddToWatchlist = (props) => {
    const [addToWatchlist] = useMutation(ADD_WATCHLIST);

    const applyAddToWatchlist = async (ViewableListingData, me) => {

        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }

        try {
            await addToWatchlist({
                variables: {
                    listingid: ViewableListingData._id,
                    userid: me._id,
                    title: ViewableListingData.title,
                    media: ViewableListingData.media[0]
                }
            });
            window.location.reload(false);
        } catch (e) { console.error(e); }

    }

    return (
        <>
            {props.state === 'enabled' ?
                <Button style={{
                    borderColor: 'rgba(223, 164, 247, 0.62)',
                    backgroundColor: 'rgba(66, 23, 77, 0.62)',
                    color: 'white',
                    fontSize: '2vh',
                    borderRadius: '5px',
                    margin: '2px',
                    padding: '8px'
                }}
                    onClick={() => applyAddToWatchlist(props.data, props.user)}
                >
                    <i className="fa-regular fa-eye"></i> Watch
                </Button>
                :
                <Button style={{
                    borderColor: 'rgba(223, 164, 247, 0.62)',
                    backgroundColor: 'rgba(66, 23, 77, 0.62)',
                    color: 'white',
                    fontSize: '2vh',
                    borderRadius: '5px',
                    margin: '2px',
                    padding: '8px'
                }}
                    onClick={() => applyAddToWatchlist(props.data, props.user)}
                    disabled
                >
                    <i className="fa-regular fa-eye"></i> Watch
                </Button>
            }
        </>
    )

};

export const HandleRemoveFromWatchlist = (props) => {

    const [removeFromWatchlist] = useMutation(REMOVE_FROM_WATCHLIST);

    let watchlistCardArray = [];

    const applyRemoveFromWatchlist = async (ViewableListingData, me) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        for (let i = 0; i < me.watchlist?.length; i++) {
            if (ViewableListingData._id === me.watchlist[i].listingid) {
                try {
                    await removeFromWatchlist(
                        {
                            variables:
                            {
                                removeFromWatchListId: me.watchlist[i]._id,
                                listingid: me.watchlist[i].listingid
                            }
                        }
                    );
                    // watchlistCardArray.splice(x, 1);
                    window.location.reload(false);

                } catch (e) { console.error(e); }
            }
        }
    }

    return (
        <Button style={{
            borderColor: 'rgba(223, 164, 247, 0.62)',
            backgroundColor: 'rgba(66, 23, 77, 0.62)',
            color: 'white',
            fontSize: '2vh',
            borderRadius: '5px',
            margin: '2px',
            padding: '8px'
        }}
            onClick={() => applyRemoveFromWatchlist(props.data, props.user)}
        >
            <i className="fa-regular fa-eye"></i> Remove from Watchlist
        </Button>
    )
}

export const CalculateNumberOfWatchers = (props) => {
    return props.data.watchlist?.length;
}

