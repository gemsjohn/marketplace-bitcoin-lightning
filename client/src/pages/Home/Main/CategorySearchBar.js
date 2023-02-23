import React, { useState } from "react";
import { useLazyQuery } from '@apollo/client';
import { SEARCH_LISTING_QUERY_CATEGORY } from '../../../utils/queries';
import { Row, Col, Button, } from "react-bootstrap";

const ListingSearchBarCategory = () => {
    const [listingSearchInput, setListingSearchInput] = useState('');
    const [categoryDropdown, setCategoryDropdown] = useState(false);

    const [searchListing] = useLazyQuery(SEARCH_LISTING_QUERY_CATEGORY, {
        variables: { search: listingSearchInput },
        enabled: false,
    });
  
    let categoryKey = localStorage.getItem("categoryKey");

    if (categoryKey === null) {
      localStorage.setItem("categoryKey", "")
    }
    
    const categoryArray = [
      {category: "Apparel"},
      {category: "Automotive"},
      {category: "Collectables"},
      {category: "Electronics"},
      {category: "Hardware"},
      {category: "Health and Beauty"},
      {category: "Household"},
      {category: "Pet Supplies"},
      {category: "Sporting Goods"},
      {category: "Toys"},
      {category: "Other"}
  ]

  const CategoryButton = () => {
      let CategoryButtonArray = [];
      for (let i = 0; i < categoryArray.length; i++) {

          CategoryButtonArray[i] =
              <Button
                  // type='submit'
                  variant="outline-secondary"
                  style={{ 
                    backgroundColor: '#94D2BD', 
                    color: '#001219', 
                    borderLeft: 'solid', 
                    borderWidth: 'thin', 
                    borderColor: 'rgba(148, 210, 189, 0.2)', 
                    margin: '0.25rem 0.25rem' 
                  }}
                  onClick={() => {
                    window.location.reload(false); 
                    searchListing(); 
                    localStorage.setItem("categoryKey", categoryArray[i].category); 
                    setListingSearchInput(categoryArray[i].category)
                  }}
                  key={i}
              >
                  {categoryArray[i].category}
              </Button>                        
      }
      return CategoryButtonArray; 
  }
    return (
        <>
        <Col>
        
        <Row 
          style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            flexDirection: 'column', 
            marginBottom: '1rem'
          }}>
            {localStorage.getItem("categoryKey") !== "" ?
            <button 
              style={{
                  background: '#ef233c', 
                  color: 'white', 
                  borderLeft: 'solid', 
                  borderWidth: 'thin', 
                  borderColor: '#ef233c',
                  borderRadius: '10px',
                  width: '18rem', 
                  margin: '0.5rem auto',
                  fontSize: '1rem',
                  padding: '0.5rem'
              }} 
              onClick={() => {
                localStorage.setItem("categoryKey", ""); 
                window.location.reload(false)
              }}
            >
              {localStorage.getItem("categoryKey")} 
              &nbsp; &nbsp;
              <i className="fa-solid fa-x"></i>
            </button>
            
            :
            <>
            <Row 
              style={{
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: 'column', 
                marginBottom: '1rem'
              }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    margin: 'auto' 
                  }}>
                <button
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: 'white', 
                      border: 'none', 
                      outline: 'none' 
                    }}
                    onClick={(event) => { 
                      event.preventDefault(); 
                      setCategoryDropdown(current => !current) 
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'left',
                      width: '60vw',
                      padding: '10px',
                      border: 'solid',
                      borderRadius: '10px',
                      alignItems: 'center'
                    }}>
                      Category Selection
                    
                      <div style={{ marginLeft: 'auto' }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </div>
                    </div>
                  </button>
                {categoryDropdown ?
                  <div style={{padding: '1rem'}}>
                    <CategoryButton />
                  </div>
                  :
                  null
                }
                </div>
            </Row>
            </>
            }
        </Row>
        </Col>
        </>
    )
}

export default ListingSearchBarCategory;