import React, { Component } from 'react';
// import LeftMenu from '../LeftMenu';
// import RightMenu from '../RightMenu';
// import { Drawer, Button, Icon } from 'antd';
import * as Styled from './styled';
import './Header.css';

import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class Header extends Component {
    state = {
        visible: false
    };

    showDrawer = () => {
        this.setState({
            visible: true
        });
    };

    onClose = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        return (
            <nav className="menu">
                <Link to={ROUTES.HOME}><Styled.Logo /></Link>
                {/* <div className="menu__container">
                    <div className="menu_left">
                        <LeftMenu mode="horizontal" />
                    </div> */}
                    {/* <div className="menu_right">
                        <RightMenu mode="horizontal" />
                    </div> */}
                    {/* <Button
                        className="menu__mobile-button"
                        onClick={this.showDrawer}
                    >
                        <Icon type="align-right" />
                    </Button>
                    <Drawer
                        placement="right"
                        className="menu_drawer"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                    >
                        <LeftMenu mode="inline" />
                        <RightMenu mode="inline" />
                    </Drawer> */}
                {/* </div> */}
            </nav>
        );
    }
}

export default Header;