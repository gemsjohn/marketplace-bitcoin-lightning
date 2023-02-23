import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { 
    Navbar, 
    Nav, 
    NavDropdown, 
    Row,
    Col
} from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import BTCDropDown from '../assets/BTCDropDown.png';
import BTCDropDownSolid from '../assets/BTCDropDownSolid.png';

const DropDownMenu = () => {
  // [[[HOOKS]]]
  const [isShownLogin, setIsShownLogin] = useState(false);
  const [displayDropdown, setDisplayDropdown] = useState('');
  const [updateDropdownImg, setUpdateDropdownImg] = useState(BTCDropDownSolid);
  const [showDropdown, setShowDropdown] = useState(true);
  // [[[APOLLO SERVER]]]
  const { data: userData } = useQuery(GET_ME);
  const user = userData?.me || {};

  const handleDisplayDropdown = ()=> {
    if (displayDropdown === '') {
      setShowDropdown(true)
      setDisplayDropdown('show');
      setUpdateDropdownImg(BTCDropDown)
    } else {
      setDisplayDropdown('');
      setUpdateDropdownImg(BTCDropDownSolid)
    }
    
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowDropdown(false)
          setDisplayDropdown('');
          setUpdateDropdownImg(BTCDropDownSolid)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);


  return (
    <div>
      <Navbar style={{width: '-1vw'}}>
        <Navbar.Toggle aria-controls='navbar' />

        <Navbar.Collapse id='navbar'>
          <Nav>
            <Col>
              <Row style={{}}>
                {Auth.loggedIn() ? (
                  <div className="nav-item dropdown" style={{color: 'white'}} ref={wrapperRef}>
                    <p 
                      id="nav-dropdown" 
                      aria-expanded="false" 
                      role="button" 
                      className="dropdown-toggle nav-link" 
                      tabIndex="0" 
                      href="#" 
                      style={{color: '#EE9B00', width: '2rem', margin: 'auto'}}
                      onClick={() => handleDisplayDropdown()}
                    >
                      {/* {user.username} */}
                      <img src={updateDropdownImg} style={{height: '1rem', width: 'auto'}} alt=""></img>
                    </p>
                    {showDropdown ?
                    <>
                    <div 
                      aria-labelledby="nav-dropdown" 
                      data-bs-popper="static" 
                      className={`dropdown-menu ${displayDropdown} dropdown-menu-lg-end`}
                      style={{ backgroundColor: '#0A9396', border: 'none', borderRadius: '10px', outline: 'none', width: '16rem' }}
                    >
                        {user.role?.[0] === 'Admin' ?
                          <NavDropdown.Item as={Link} to='/admin' onClick={() => handleDisplayDropdown()} style={{color: 'white'}}>Admin Dashboard</NavDropdown.Item>
                        :
                          null
                        }
                        <NavDropdown.Item as={Link} to='/profile' onClick={() => handleDisplayDropdown()} style={{color: 'white'}}>{user.username}</NavDropdown.Item>
                        <NavDropdown.Item onClick={Auth.logout} style={{color: 'white'}}>Log Out</NavDropdown.Item>
                    </div>
                    </>
                    :
                    null
                    }
                  </div>
                ) : (
                  <Nav.Link as={Link} to='/login'>
                    <span
                      className="Nav-style"
                      onMouseEnter={() => setIsShownLogin(true)}
                      onMouseLeave={() => setIsShownLogin(false)}
                      style={{width: '10rem'}}
                    >
                      {isShownLogin ? 
                        <span style={{ backgroundColor: '#f9c74f', color: '#001219', padding: '10px', borderRadius: '10px', fontSize: '2vh' }} >
                          Login | Sign Up
                        </span> 
                      : 
                      <span style={{ backgroundColor: '#f9c74f', color: '#001219', padding: '10px', borderRadius: '10px', fontSize: '2vh' }} >
                        Login | Sign Up
                      </span> 
                      }
                    </span>
                  </Nav.Link>
                )}
              </Row>
            </Col>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default DropDownMenu;