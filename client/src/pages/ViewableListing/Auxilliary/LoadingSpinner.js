import React from "react";
import { Spinner } from "react-bootstrap";
import SelectStyle from '../../../Stylizer';

const LoadingSpinner = () => {
    return (
        <div style={{ ...SelectStyle[0].page, }}>
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

export default LoadingSpinner;
