// import styleChoice from './pages/profile';
// Set color to: dark, first, or second
let color = 'fourth';
let SelectStyle;

const primaryStyle = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  fontSize: 'calc(10px + 2vmin)',
  color: 'white'
}

const StylePicker = (x) => {
  const PageStyle = {
    darkstyle: {
      backgroundColor: '#202C39',
      ...primaryStyle
    },
    firststyle: {
      backgroundColor: '#E8EDDF',
      ...primaryStyle
    },
    secondstyle: {
      backgroundColor: '#F5CB5C',
      ...primaryStyle
    },
    thirdstyle: {
      backgroundColor: '#44cf6c',
      ...primaryStyle
    }
    ,
    fourthstyle: {
      backgroundColor: '#001219',
      ...primaryStyle
    },
    fifthstyle: {
      backgroundColor: '#f1faee',
      ...primaryStyle
    }
  }
  
  if (x === 'dark') { 
    SelectStyle = [
      {page: PageStyle.darkstyle},
      {button: '#283845'},
      {text: 'white'},
      {navbar: 
        {
          backgroundColor: '#283845',
          borderRadius: 10,
          margin: 10,
          color: 'white'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.darkstyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }
      },
      {formText: 'white'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#202C39',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white'
        }
      },
      {shopMenuPanel:'#3C5568'},
      {price: '44cf6c'},
      {clearButton: '#ffc300'}
    ]
  }
  else if (x === 'first') {
    SelectStyle = [
      {page: PageStyle.firststyle},
      {button: '#cfdbd5'},
      {text: 'white'},
      {navbar:
        {
          backgroundColor: '#cfdbd5',
          borderRadius: 10,
          margin: 10,
          color: 'white'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.firststyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }
      },
      {formText: '#242423'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#E8EDDF',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white'
        }
      },
      {shopMenuPanel:'#3C5568'},
      {price: '44cf6c'},
      {clearButton: '#ffc300'}
    ]
  }
  else if (x === 'second') {
    SelectStyle = [
      {page: PageStyle.secondstyle},
      {button: '#242423'},
      {text: 'white'},
      {navbar:
        {
          backgroundColor: '#242423',
          borderRadius: 10,
          margin: 10,
          color: 'white'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.secondstyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }
      },
      {formText: '#242423'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#F5CB5C',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white'
        }
      },
      {shopMenuPanel:'#3E3E3D'},
      {price: '44cf6c'}
    ]
  }
  else if (x === 'third') {
    SelectStyle = [
      {page: PageStyle.thirdstyle},
      {button: '#242423'},
      {text: 'white'},
      {navbar:
        {
          backgroundColor: '#242423',
          borderRadius: 10,
          margin: 10,
          color: 'white'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.thirdstyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }
      },
      {formText: '#242423'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#44cf6c',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white'
        }
      },
      {shopMenuPanel:'#3E3E3D'},
      {price: '44cf6c'},
      {clearButton: '#ffc300'}
    ]
  }
  else if (x === 'fourth') { 
    SelectStyle = [
      {page: PageStyle.fourthstyle},
      {button: '#005F73'},
      {text: 'white'},
      {navbar: 
        {
          backgroundColor: '#001219',
          borderRadius: 0,
          margin: 0,
          color: 'white'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.fourthstyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }
      },
      {formText: 'white'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#202C39',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white'
        }
      },
      {shopMenuPanel:'#202C39'},
      {price: '44cf6c'},
      {clearButton: '#ffc300'}
    ]
  }
  else if (x === 'fifth') { 
    SelectStyle = [
      {page: PageStyle.fifthstyle},
      {button: '#005F73'},
      {text: 'black'},
      {navbar: 
        {
          backgroundColor: '#f1faee',
          borderRadius: 0,
          margin: 0,
          color: 'black'
        }
      },
      {navbarAppJS:
        {
          backgroundColor: PageStyle.fourthstyle.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
          color: 'black'
        }
      },
      {formText: 'black'},
      {shopMenuPrimaryStyle: 
        {
          backgroundColor: '#202C39',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'black'
        }
      },
      {shopMenuPanel:'#202C39'},
      {price: '44cf6c'},
      {clearButton: '#ffc300'}
    ]
  }
  return SelectStyle;
}

const Stylizer = () => {
    return (
        color
    )
}

StylePicker(Stylizer());
  
export default SelectStyle;