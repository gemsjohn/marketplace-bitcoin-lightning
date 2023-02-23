import React from "react";

const Introduction = () => {
    return (
        <div style={{margin: '1rem auto'}}>
            <p style={{maxWidth: 'fit-content', margin: '0.5rem auto'}}>Introducing</p>
            <p style={{maxWidth: 'fit-content', margin: '0.5rem auto'}}>Honest Patina</p>
            <iframe 
                width="300" 
                height="300" 
                src="https://www.youtube.com/embed/gOR7XLLMgAU" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
        </div>
    )
}

export default Introduction;