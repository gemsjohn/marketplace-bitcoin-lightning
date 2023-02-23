import React from "react";
import { Popover, Tooltip } from 'react-bootstrap';

export const handleLoginToDMSeller = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Login or Sign Up</Popover.Header>
        <Popover.Body>
            <strong>Click</strong> to login or sign up.
        </Popover.Body>
    </Popover>
);

export const handleLoginToAddToWatchlist = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Login or Sign Up</Popover.Header>
        <Popover.Body>
            Follow this listing by Loging in or Signing up to <strong>PATINA</strong>.
        </Popover.Body>
    </Popover>
);

export const renderDMToolTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Direct Message
    </Tooltip>
);
export const renderWatchToolTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Add to Watchlist
    </Tooltip>
);