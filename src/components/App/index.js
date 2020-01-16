import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import './app.css';

import HomePage from '../Home';
import GuildPage from '../Guild';
import LeaguePage from '../League';
import HeaderCustom from '../Header';
import AOAPage from '../AOA';

import * as ROUTES from '../../constants/routes';

const { Header, Content, Footer } = Layout;

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Layout className="app-layout" style={{ minHeight: "100vh" }}>
                        <Header
                            style={{ height: 'auto', lineHeight: 'inherit', padding: '0', background: 'white', borderBottom: '1px solid #e8e8e8' }}
                        >
                            <HeaderCustom />
                        </Header>
                        <Content>
                            <Switch>
                                <Route exact path={ROUTES.HOME} component={HomePage} />
                                <Route path={ROUTES.GUILD} component={GuildPage} />
                                <Route path={ROUTES.LEAGUE} component={LeaguePage} />
                                <Route path={ROUTES.AOA} component={AOAPage} />
                                <Redirect to={ROUTES.AOA} />
                            </Switch>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Little Race ©2020 Created by
                            <span style={{ whiteSpace: "nowrap" }}>
                                {" <Ironforge Gospel>"}
                            </span>
                        </Footer>
                    </Layout>
                </div>
            </Router>
        );
    }
}

export default App;