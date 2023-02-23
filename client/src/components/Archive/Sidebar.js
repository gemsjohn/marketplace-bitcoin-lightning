import React, { useState, useEffect, useContext } from 'react';
import { Button, InputGroup, FormControl, Row, Col, Nav, NavDropdown,  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import SelectStyle from '../../Stylizer';

const Sidebar = () => {
  const [expandSidebar, setExpandSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [dropdown, setDropdown] = useState(false);
  const [buttonHoverA, setButtonHoverA] = useState(false);
  const [buttonHoverB, setButtonHoverB] = useState(false);
  const [buttonHoverC, setButtonHoverC] = useState(false);
  const [buttonHoverD, setButtonHoverD] = useState(false);
  const [toggleButtonDropdownA, setToggleButtonDropdownA] = useState(false);
  const [toggleButtonDropdownB, setToggleButtonDropdownB] = useState(false);
  const [toggleButtonDropdownC, setToggleButtonDropdownC] = useState(false);
  const [toggleButtonDropdownD, setToggleButtonDropdownD] = useState(false);
  const [isShownLogin, setIsShownLogin] = useState(false);
  const [isShownSell, setIsShownSell] = useState(false);
  const [isShownWanted, setIsShownWanted] = useState(false);
  const [isShownProfile, setIsShownProfile] = useState(false);
  const [isShownLogout, setIsShownLogout] = useState(false);
  const [dummyVarState, setDummyVarState] = useState(true);


  // [[[APOLLO SERVER]]]
  const { data: userData } = useQuery(GET_ME);
  const user = userData?.me || {};

  const HandleExpandSidebarEnter = () => {
    setExpandSidebar(true);
  }
  const HandleExpandSidebarLeave = () => {
    setExpandSidebar(false);
  }
  // [[[BUTTON HOVER LEAVE]]]
  const HandleButtonHoverEnterA = () => {
    setButtonHoverA(true);
    // if (dropdown) {
    //   HandleToggleButtonDropdownA();
    // }
    
  }
  const HandleButtonHoverEnterB = () => {
    setButtonHoverB(true);
    // if (dropdown) {
    //   HandleToggleButtonDropdownB();
    // }
  }
  const HandleButtonHoverEnterC = () => {
    setButtonHoverC(true);
    // if (dropdown) {
    //   HandleToggleButtonDropdownC();
    // }
  }
  const HandleButtonHoverEnterD = () => {
    setButtonHoverD(true);
    // if (dropdown) {
    //   HandleToggleButtonDropdownD();
    // }
  }
  // [[[BUTTON HOVER LEAVE]]]
  const HandleButtonHoverLeaveA = () => {
    setButtonHoverA(false);
  }
  const HandleButtonHoverLeaveB = () => {
    setButtonHoverB(false);
  }
  const HandleButtonHoverLeaveC = () => {
    setButtonHoverC(false);
  }
  const HandleButtonHoverLeaveD = () => {
    setButtonHoverD(false);
  }
  // [[[TOGGLE BUTTON DROPDOWN]]]
  const HandleToggleButtonDropdownA = () => {
    setToggleButtonDropdownA(true)
    setToggleButtonDropdownB(false)
    setToggleButtonDropdownC(false)
    setToggleButtonDropdownD(false)
  }
  const HandleToggleButtonDropdownB = () => {
    setToggleButtonDropdownB(true)
    setToggleButtonDropdownA(false)
    setToggleButtonDropdownC(false)
    setToggleButtonDropdownD(false)
  }
  const HandleToggleButtonDropdownC = () => {
    setToggleButtonDropdownC(true)
    setToggleButtonDropdownB(false)
    setToggleButtonDropdownA(false)
    setToggleButtonDropdownD(false)
  }
  const HandleToggleButtonDropdownD = () => {
    setToggleButtonDropdownD(true)
    setToggleButtonDropdownB(false)
    setToggleButtonDropdownC(false)
    setToggleButtonDropdownA(false)
  }
  // [[[CLEAR TOGGLE BUTTON DROPDOWN]]]
  const HandleClearToggleButtonDropdownA = () => {
    setToggleButtonDropdownA(false)
  }
  const HandleClearToggleButtonDropdownB = () => {
    setToggleButtonDropdownB(false)
  }
  const HandleClearToggleButtonDropdownC = () => {
    setToggleButtonDropdownC(false)
  }
  const HandleClearToggleButtonDropdownD = () => {
    setToggleButtonDropdownD(false)
  }


  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [setWindowWidth])

  setTimeout(() => {
    if (windowWidth < '1050') {
      setDropdown(true);
    } else {
      setDropdown(false);
    }

  }, 250)
   

  return (
    <>
      <div>
        {dropdown ?
        null

        :
        <>
        {expandSidebar ?
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              flexDirection: 'column',
              margin: '0.5rem',
              borderRight: 'solid',
              borderWidth: 'thin',
              backgroundColor: '#001219',
              borderColor: 'rgba(148, 210, 189, 0.2)',
              position: 'fixed',
              zIndex: '3',
              left: '0',
              top: '11.46vh',
              // height: '100%',
              width: '20rem',
              top: '0',
              paddingTop: '7rem'
            }}
            // onMouseEnter={() => HandleExpandSidebarEnter()}
            onMouseLeave={() => HandleExpandSidebarLeave()}
          >
            {/* [[[ACCOUNT]]] */}
            <Col>
              <div
                style={{}}
                onMouseEnter={() => HandleButtonHoverEnterA()}
                onMouseLeave={() => HandleButtonHoverLeaveA()}
              >
                {buttonHoverA ?
                  <>
                    {toggleButtonDropdownA ?
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleClearToggleButtonDropdownA()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-brands fa-android"></i></Col>
                            <Col><p>Account</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row>
                            <Col>
                              {Auth.loggedIn() ? (
                                <>

                                  <Nav.Link as={Link} to='/profile'>
                                    {/* <p style={{ color: SelectStyle[2].text, fontSize: '2vh', margin: '0' }}>{user.username}</p> */}
                                    <span
                                      className="Nav-style"
                                      onMouseEnter={() => setIsShownProfile(true)}
                                      onMouseLeave={() => setIsShownProfile(false)}
                                    >
                                      {isShownProfile ? <span style={{ color: '#F2D492', fontSize: '2vh' }}>{user.username}</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>{user.username}</span>}
                                    </span>
                                    {/* <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item> */}

                                  </Nav.Link>
                                  {/* <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }} onClick={Auth.logout}>Logout</span> */}
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownLogout(true)}
                                    onMouseLeave={() => setIsShownLogout(false)}
                                  >
                                    {isShownLogout ? <span style={{ color: '#F2D492', fontSize: '2vh' }} onClick={Auth.logout}>Logout</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Logout</span>}
                                  </span>
                                </>
                              ) : (
                                <Nav.Link as={Link} to='/login'>
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownLogin(true)}
                                    onMouseLeave={() => setIsShownLogin(false)}
                                    onClick={() => console.log("test 3")}
                                  >
                                    {isShownLogin ? <span style={{ color: '#F2D492', fontSize: '2vh' }} >Login</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Login</span>}
                                  </span>
                                </Nav.Link>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleToggleButtonDropdownA()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-brands fa-android"></i></Col>
                            <Col><p>Account</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                  :
                  <>
                    {toggleButtonDropdownA ?
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-brands fa-android"></i></Col>
                            <Col><p>Account</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row>
                            <Col>
                              {Auth.loggedIn() ? (
                                <>

                                  <Nav.Link as={Link} to='/profile'>
                                    <p style={{ color: SelectStyle[2].text, fontSize: '2vh', margin: '0' }}>{user.username}</p>
                                  </Nav.Link>
                                  <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }} onClick={Auth.logout}>Logout</span>
                                </>
                              ) : (
                                <Nav.Link as={Link} to='/login'>
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownLogin(true)}
                                    onMouseLeave={() => setIsShownLogin(false)}
                                    // onClick={() => console.log("test 4")}
                                  >
                                    {isShownLogin ? <span style={{ color: '#F2D492', fontSize: '2vh' }} >Login</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Login</span>}
                                  </span>
                                </Nav.Link>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-brands fa-android"></i></Col>
                            <Col><p>Account</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                }
              </div>
            </Col>
            {/* [[[SELL]]] */}
            <Col>
              <div
                style={{}}
                onMouseEnter={() => HandleButtonHoverEnterB()}
                onMouseLeave={() => HandleButtonHoverLeaveB()}
              >
                {buttonHoverB ?
                  <>
                    {toggleButtonDropdownB ?
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleClearToggleButtonDropdownB()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-cloud-arrow-up"></i></Col>
                            <Col><p>List</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{}}>
                            <Col>
                              {Auth.loggedIn() ? (
                                <>
                                <Nav.Link as={Link} to='/sellingform'>
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownSell(true)}
                                    onMouseLeave={() => setIsShownSell(false)}
                                  >
                                    {isShownSell ? 
                                      <span style={{ color: '#F2D492', fontSize: '2vh' }} >Selling</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Selling</span>
                                    }
                                  </span>
                                </Nav.Link>
                                <Nav.Link as={Link} to='/wantedform'>
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownWanted(true)}
                                    onMouseLeave={() => setIsShownWanted(false)}
                                  >
                                    {isShownWanted ? 
                                      <span style={{ color: '#F2D492', fontSize: '2vh' }} >Wanted</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Wanted</span>
                                    }
                                  </span>
                                </Nav.Link>
                                </>
                              ) : (
                                null
                              )}
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleToggleButtonDropdownB()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-cloud-arrow-up"></i></Col>
                            <Col><p>List</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                  :
                  <>
                    {toggleButtonDropdownB ?
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-cloud-arrow-up"></i></Col>
                            <Col><p>List</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{}}>
                            <Col>
                              {Auth.loggedIn() ? (
                                <Nav.Link as={Link} to='/selling'>
                                  <span
                                    className="Nav-style"
                                    onMouseEnter={() => setIsShownSell(true)}
                                    onMouseLeave={() => setIsShownSell(false)}
                                  >
                                    {isShownSell ? <span style={{ color: '#F2D492', fontSize: '2vh' }} >Selling</span> : <span style={{ color: SelectStyle[2].text, fontSize: '2vh' }}>Selling</span>}
                                  </span>
                                </Nav.Link>
                              ) : (
                                null
                              )}
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-cloud-arrow-up"></i></Col>
                            <Col><p>List</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                }
              </div>
            </Col>
            {/* [[[MESSAGES]]] */}
            <Col>
              <div
                style={{}}
                onMouseEnter={() => HandleButtonHoverEnterC()}
                onMouseLeave={() => HandleButtonHoverLeaveC()}
              >
                {buttonHoverC ?
                  <>
                    {toggleButtonDropdownC ?
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleClearToggleButtonDropdownC()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-message"></i></Col>
                            <Col><p>Messages</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{ marginRight: '10rem' }}>
                            <Col>
                              <p style={{ fontSize: '2vh' }}>Test 1</p>
                              <p style={{ fontSize: '2vh' }}>Test 2</p>
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleToggleButtonDropdownC()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-message"></i></Col>
                            <Col><p>Messages</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                  :
                  <>
                    {toggleButtonDropdownC ?
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-message"></i></Col>
                            <Col><p>Messages</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{ marginRight: '10rem' }}>
                            <Col>
                              <p style={{ fontSize: '2vh' }}>Test 1</p>
                              <p style={{ fontSize: '2vh' }}>Test 2</p>
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-message"></i></Col>
                            <Col><p>Messages</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                }
              </div>
            </Col>
            {/* [[[STATUS]]] */}
            <Col>
              <div
                style={{}}
                onMouseEnter={() => HandleButtonHoverEnterD()}
                onMouseLeave={() => HandleButtonHoverLeaveD()}
              >
                {buttonHoverD ?
                  <>
                    {toggleButtonDropdownD ?
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleClearToggleButtonDropdownD()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-wave-square"></i></Col>
                            <Col><p>Status</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{ marginRight: '10rem' }}>
                            <Col>
                              <p style={{ fontSize: '2vh' }}>Test 1</p>
                              <p style={{ fontSize: '2vh' }}>Test 2</p>
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: 'rgba(148, 210, 189, 0.2)', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div onClick={() => HandleToggleButtonDropdownD()}>
                          <Row
                            style={{ alignItems: 'center' }}
                          >
                            <Col><i className="fa-solid fa-wave-square"></i></Col>
                            <Col><p>Status</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                  :
                  <>
                    {toggleButtonDropdownD ?
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-wave-square"></i></Col>
                            <Col><p>Status</p></Col>
                            <Col><i className="fa-solid fa-arrow-up"></i></Col>
                          </Row>
                          <Row style={{ marginRight: '10rem' }}>
                            <Col>
                              <p style={{ fontSize: '2vh' }}>Test 1</p>
                              <p style={{ fontSize: '2vh' }}>Test 2</p>
                            </Col>
                          </Row>
                        </div>
                      </button>
                      :
                      <button style={{ backgroundColor: '#001219', border: 'none', outline: 'none', color: 'white', width: '100%' }}>
                        <div style={{}}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col><i className="fa-solid fa-wave-square"></i></Col>
                            <Col><p>Status</p></Col>
                            <Col><i className="fa-solid fa-arrow-down"></i></Col>
                          </Row>
                        </div>
                      </button>
                    }
                  </>
                }
              </div>
            </Col>
            <Col><div style={{ height: '100vh' }}></div></Col>
          </div>
          :
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              flexDirection: 'column',
              margin: '0 0 0 0.5rem',
              borderRight: 'solid',
              borderWidth: 'thin',
              backgroundColor: '#001219',
              borderColor: 'rgba(148, 210, 189, 0.2)',
              position: 'fixed',
              zIndex: '3',
              left: '0',
              top: '12vh',
              // height: '100%',
              top: '0',
              paddingTop: '7rem',
              width: '5rem'
            }}
            onMouseEnter={() => HandleExpandSidebarEnter()}
            onMouseLeave={() => HandleExpandSidebarLeave()}
          >
            <Col><i className="fa-brands fa-android"></i></Col>
            <Col><i className="fa-solid fa-cloud-arrow-up"></i></Col>
            <Col><i className="fa-solid fa-message"></i></Col>
            <Col><i className="fa-solid fa-wave-square"></i></Col>
            <Col><div style={{ height: `100vh` }}></div></Col>
          </div>
        }
        </>
        }
      </div>
    </>
  );
}

export default Sidebar;