import React from "react";

const PayToCommunicate = () => {
    return (
        <div style={{margin: '1rem auto'}}>
            <p style={{maxWidth: 'fit-content', margin: '0.5rem auto'}}>Pay to Communicate</p>
            <iframe 
                width="250" 
                height="250" 
                src="https://www.youtube.com/embed/Qu889qLTRNY" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </div>
    )
}

export default PayToCommunicate;