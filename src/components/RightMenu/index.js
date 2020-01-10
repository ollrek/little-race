import React, { Component } from 'react';
import { Menu } from 'antd';
// import { Input, Menu } from 'antd';
// const { Search } = Input;

class RightMenu extends Component {
  render() {
    return (
      <Menu mode={this.props.mode}>
        {/* <Search
          placeholder="Search a guild ..."
          onClick={e => e.preventDefault}
          onSearch={value => console.log(value)}
        /> */}
      </Menu>
    );
  }
}

export default RightMenu;