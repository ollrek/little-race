import React, { Component } from 'react';
import Navigation from '../Navigation';
import * as Styled from './styled';

class Header extends Component {

    render() {
        return (
            <div className="Header">
                <Styled.Logo />
                <Navigation />
            </div>

        );
    }
}

export default Header;