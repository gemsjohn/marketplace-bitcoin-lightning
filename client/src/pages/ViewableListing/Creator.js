import React, { useState } from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import SelectStyle from '../../Stylizer';
import Auth from '../../utils/auth';
import '../../App.css';
import placeholder from '../../assets/placeholder.jpg';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_BY_ID, GET_LISTING_BY_ID } from '../../utils/queries';
import { UserData } from '../../components/ApolloQueries/UserData';
import { UPDATE_USER_UP_VOTE, UPDATE_USER_DOWN_VOTE } from '../../utils/mutations';
import fear_greed from '../../assets/fear_greed.png';
import fear_greed_red from '../../assets/fear_greed_red.png';



// [[[MAINPAGELISTING FUNCTION]]]: Displays Search Bar and Listing Cards
function Creator() {
    window.scrollTo(0, 0);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    // const [rating, setRating] = useState('');
    const [verified, setVerified] = useState(false);
    const [upVote, setUpVote] = useState('');
    const [forSaleListingCount, setForSaleListingCount] = useState();
    const [wantedListingCount, setWantedListingCount] = useState();
    const [ratingCount, setRatingCount] = useState();
    const [upVoteCount, setUpVoteCount] = useState();
    const [downVoteCount, setDownVoteCount] = useState();
    const [voteAvailable, setVoteAvailable] = useState(false);
    const [userAlreadyUpVoted, setUserAlreadyUpVoted] = useState(false);
    const [userAlreadyDownVoted, setUserAlreadyDownVoted] = useState(false);
    const [viewMoreInfo, setViewMoreInfo] = useState(false);
    const [updateUserUpVote] = useMutation(UPDATE_USER_UP_VOTE);
    const [updateUserDownVote] = useMutation(UPDATE_USER_DOWN_VOTE);
    const [caution, setCautiton] = useState(false);
    const [color, setColor] = useState('#90be6d')
    // const [loading, setLoading] = useState(true);
    // const [removeUserRating] = useMutation(REMOVE_USER_RATING);

    const _id = localStorage.getItem('listingID');
    const _idUpdate = (_id.replace(/['"]+/g, ''));
    const { data: viewed, refetch } = useQuery(GET_LISTING_BY_ID, {
        variables: { id: _idUpdate }
    });
    let ViewableListingData = viewed?.listing || {};
    let me = UserData();


    let creatorid = localStorage.getItem("listingCreatorID");
    const { data } = useQuery(GET_USER_BY_ID, {
        variables: { id: creatorid }
    });
    let searchUserByIDData = data;
    let locationArray = [];
    let locationArrayContainer = [];

    const UserSearchBar = () => {
        if (searchUserByIDData) {
            setUsername(searchUserByIDData.user.username);
            setVerified(searchUserByIDData.user.verified)
            setForSaleListingCount(searchUserByIDData.user.forsalelist.length);
            setWantedListingCount(searchUserByIDData.user.wantedlist.length)
            setUpVoteCount(searchUserByIDData.user.upvote.length)
            setDownVoteCount(searchUserByIDData.user.downvote.length)
        }
    }

    const handleClick = async (input) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }

        if (input === 'up') {
            try {
                await updateUserUpVote({
                    variables: {
                        id: creatorid,
                        // rating: me._id,
                        upvote: me._id
                    }
                });
                window.location.reload(false);
            }
            catch (e) { console.error(e); }
        } else if (input === 'down') {
            try {
                await updateUserDownVote({
                    variables: {
                        id: creatorid,
                        // rating: me._id,
                        downvote: me._id
                    }
                });
                window.location.reload(false);
            }
            catch (e) { console.error(e); }
        }
    }
    const handleVoting = () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) { return false; }
        for (let i = 0; i < me.pfclist?.length; i++) {
            if (me.pfclist[i].listingcreatorid === creatorid) {
                for (let x = 0; x < searchUserByIDData?.user.upvote.length; x++) {
                    if (me._id === searchUserByIDData?.user.upvote[x]) {
                        setUserAlreadyUpVoted(true)
                    }
                }
                for (let x = 0; x < searchUserByIDData?.user.downvote.length; x++) {
                    if (me._id === searchUserByIDData?.user.downvote[x]) {
                        setUserAlreadyDownVoted(true)
                    }
                }
                setVoteAvailable(true)
            }
        }
    }

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    const HandleCommonListingLocation = () => {
        for (let i = 0; i < searchUserByIDData?.user.listinglocationarray.length; i++) {

            if (locationArray.includes(searchUserByIDData.user.listinglocationarray[i]) === false) {
                if(i === 1) {setColor('#f9c74f')}
                else if(i === 2) {setColor('#f3722c')}
                else if(i === 3) {setColor('#f94144')}
                locationArrayContainer[i] =
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        key={i}
                    >
                        <Col>
                            <div style={{
                                backgroundColor: `${color}`,
                                borderRadius: '10px',
                                margin: '1vh 0',
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                <Col style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'left'
                                }}>
                                    <p
                                        style={{
                                            fontSize: '2vh',
                                            margin: '0.5rem',
                                            color: 'white'
                                        }}>
                                        {searchUserByIDData?.user.listinglocationarray[i]}
                                    </p>
                                </Col>
                            </div>
                        </Col>
                    </div>
            }
            locationArray[i] = searchUserByIDData.user.listinglocationarray[i];
        }
        // if (locationArrayContainer?.length > 2) {
        //     setCautiton(true)
        //     console.log("CAUTION")
        // }
        return (locationArrayContainer)

    }


    setTimeout(() => {
        // setLoading(false);
        handleVoting()
        UserSearchBar(creatorid)
    }, 250)

    let timeoutID = setTimeout(() => {
        if (searchUserByIDData) {
            setLoading(false);
        } else {
            setLoading(true);
        }

    }, 1000)

    if (loading === false) {
        clearTimeout(timeoutID);
    }

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

    const HandlePrimaryDisplay = () => {
        return (
            <>
                {loading ?
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}><LoadingSpinner /></div>
                    :
                    <div
                        style={{
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                        <div style={{ ...SelectStyle[0].page }}>
                            <div style={{ marginTop: '4rem', padding: '1rem', width: '80vw' }}>
                                {/* <UserSearchBar name={creatorid} /> */}
                                <div style={{ display: 'flex', padding: '0.5rem', fontSize: '3rem' }}>
                                    <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
                                        <strong style={{ color: '#0A9396' }}>TRUST</strong> REPORT
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '2rem' }}>
                                    <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto', position: 'absolute', margin: 'auto', marginTop: '8rem' }}>
                                        {username}
                                    </p>
                                    <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto', position: 'absolute', margin: 'auto', marginTop: '11rem', fontSize: '1rem' }}>
                                    {verified ?
                                    'Verified'
                                    :
                                    null
                                    }
                                    </p>
                                    {verified ?
                                        <img src={fear_greed} style={{margin: 'auto', height: '20rem'}} />
                                    :
                                        <img src={fear_greed_red} style={{margin: 'auto', height: '20rem'}} />
                                    }
                                </div>
                                <div style={{ color: '#001219', borderRadius: '20px' }}>
                                    {/* PROFILE DETAILS */}
                                    {/* <img src={placeholder} style={{ height: '10rem', width: 'auto', margin: '1rem auto', borderRadius: '20px' }} /> */}
                                    {/* <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        margin: '1rem 0'
                                    }}>
                                        <Col>
                                            <div style={{
                                                backgroundColor: '#E9D8A6',
                                                borderRadius: '10px',
                                                // margin: '1vh 0',
                                                display: 'flex',
                                                flexWrap: 'wrap'
                                            }}>
                                                <Col style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'left'
                                                }}>
                                                    <p
                                                        style={{
                                                            fontSize: '2vh',
                                                            margin: '0.5rem',
                                                            color: '#001219'
                                                        }}>
                                                        Username
                                                    </p>
                                                </Col>
                                                <Col style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'right'
                                                }}>
                                                    <p style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: '#001219',
                                                        width: 'max-content'
                                                    }}>
                                                        {username}
                                                    </p>
                                                </Col>
                                            </div>
                                        </Col>
                                    </div> */}
                                    {/* <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    margin: '1rem 0'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: '#E9D8A6',
                                            borderRadius: '10px',
                                            // margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: '#001219'
                                                    }}>
                                                    User info: Who, What, Where, When, Why.
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div> */}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', margin: '1rem 0 0 0' }}>
                                    <p><i className="fa-solid fa-shield-halved"></i> Fraud Prevention</p>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <Button
                                        style={{ display: 'flex', backgroundColor: '#0A9396', border: 'none', alignItems: 'center' }}
                                        onClick={() => setViewMoreInfo(current => !current)}
                                    ><i className="fa-solid fa-circle-info"></i>&nbsp;  More Information</Button>
                                    {viewMoreInfo ?
                                        <div style={{ display: 'flex', justifyContent: 'left', flexDirection: 'column', margin: '1rem 0 0 0' }}>
                                            <div>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'left', color: '#EE9B00' }}>
                                                    Voting
                                                </p>
                                            </div>
                                            <div></div>
                                            <div>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'left' }}>
                                                    You must pay to contact and send at least one message to this User via one of their Listings to be able to Up vote or Down Vote.
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'left', color: '#EE9B00' }}>
                                                    Listing location
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'left' }}>
                                                    You should be skeptical of users that post listings outside of their Primary Listing Location.
                                                </p>
                                                <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'left' }}>Scattered Previous Listing Locations is sketchy.</p>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                                {/* <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Verified?
                                                </p>
                                            </Col>
                                            {verified ?
                                                <Col style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'right'
                                                }}>
                                                    <p style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: '#8ac926',
                                                        width: 'max-content'
                                                    }}>
                                                        True
                                                    </p>
                                                </Col>
                                                :
                                                <Col style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'right'
                                                }}>
                                                    <p style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'red',
                                                        width: 'max-content'
                                                    }}>
                                                        False
                                                    </p>
                                                </Col>
                                            }
                                        </div>
                                    </Col>
                                </div> */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Upvote
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem',
                                                    color: `${upVoteCount > downVoteCount ? '#8ac926' : '#f94144'}`,
                                                    width: 'max-content'
                                                }}>
                                                    {upVoteCount}
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Downvote
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {downVoteCount}
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>
                                {voteAvailable ?
                                    <>
                                        <div style={{ display: 'flex', flexWra: 'wrap', justifyContent: 'center', padding: '0.25rem' }}>
                                            {userAlreadyUpVoted ?
                                                <p style={{ color: 'green' }}>You Up Voted.</p>
                                                :
                                                null
                                            }
                                            {userAlreadyDownVoted ?
                                                <p style={{ color: 'red' }}>You Down Voted.</p>
                                                :
                                                null
                                            }
                                        </div>
                                        <div style={{ display: 'flex', flexWra: 'wrap', justifyContent: 'center', margin: '0 0 1rem 0' }}>
                                            <>
                                                <Col>
                                                    {userAlreadyUpVoted ?
                                                        <Button
                                                            onClick={() => handleClick('up')}
                                                            style={{ width: 'inherit', backgroundColor: 'green', border: 'none' }}
                                                            disabled
                                                        ><i className="fa-solid fa-thumbs-up"></i></Button>
                                                        :
                                                        <Button
                                                            onClick={() => handleClick('up')}
                                                            style={{ width: 'inherit', backgroundColor: 'green', border: 'none' }}
                                                        ><i className="fa-solid fa-thumbs-up"></i></Button>
                                                    }
                                                </Col>
                                                <Col>
                                                    {userAlreadyDownVoted ?
                                                        <Button
                                                            onClick={() => handleClick('down')}
                                                            style={{ width: 'inherit', backgroundColor: 'red', border: 'none' }}
                                                            disabled
                                                        ><i className="fa-solid fa-thumbs-down"></i></Button>
                                                        :
                                                        <Button
                                                            onClick={() => handleClick('down')}
                                                            style={{ width: 'inherit', backgroundColor: 'red', border: 'none' }}
                                                        ><i className="fa-solid fa-thumbs-down"></i></Button>
                                                    }
                                                </Col>
                                            </>

                                        </div>
                                    </>
                                    :
                                    null
                                }
                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Primary Listing Location
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Col>
                                        <div style={{
                                            backgroundColor: '#90be6d',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    {searchUserByIDData?.user.primarylocation}
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Previous Listing Location
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>

                                <HandleCommonListingLocation />
                                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0', borderBottom: 'solid', borderWidth: 'thin', borderColor: 'rgba(148, 210, 189, 0.2)' }}></div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', margin: '1rem' }}>
                                    <p><i className="fa-solid fa-table"></i> Current Listing Data</p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            // margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    For Sale
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {forSaleListingCount}
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Col>
                                        <div style={{
                                            backgroundColor: 'rgba(66, 23, 77, 0.62)',
                                            borderRadius: '10px',
                                            margin: '1vh 0',
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'left'
                                            }}>
                                                <p
                                                    style={{
                                                        fontSize: '2vh',
                                                        margin: '0.5rem',
                                                        color: 'white'
                                                    }}>
                                                    Wanted
                                                </p>
                                            </Col>
                                            <Col style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'right'
                                            }}>
                                                <p style={{
                                                    fontSize: '2vh',
                                                    margin: '0.5rem',
                                                    color: 'white',
                                                    width: 'max-content'
                                                }}>
                                                    {wantedListingCount}
                                                </p>
                                            </Col>
                                        </div>
                                    </Col>
                                </div>

                            </div>

                        </div>
                    </div>
                }
            </>
        )
    }


    return (<HandlePrimaryDisplay />);
}

export default Creator;