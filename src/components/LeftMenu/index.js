import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

class LeftMenu extends Component {
  render() {
    return (
      <Menu mode={this.props.mode}>
        <Menu.Item key="1"><Link to={ROUTES.HOME}>Home</Link></Menu.Item>
        {/* <Menu.Item key="2"><Link to={ROUTES.GUILD}>Guild</Link></Menu.Item>
        <Menu.Item key="3"><Link to={ROUTES.LEAGUE}>League</Link></Menu.Item> */}
        {/* <Menu.Item>
          <Link to={ROUTES.HOME}>Log In</Link>
        </Menu.Item> */}
        {/* <SubMenu title={<span>Blogs</span>}>
          <MenuItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu> */}
      </Menu>
    );
  }
}

export default LeftMenu;