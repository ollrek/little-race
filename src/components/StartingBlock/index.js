import React, { Component } from 'react';
import { Row, Col, Select, Input, Button, Form, message } from 'antd';
import getSlug from 'speakingurl';
import { FirebaseContext } from '../Firebase';
import { withRouter } from "react-router";

import EU from './data/realms_EU.json';
import US from './data/realms_US.json';

const { Option } = Select;

const realmSource = {
    eu: EU.realms,
    us: US.realms
};

class StartingBlock extends Component {
    render() {
        const { history } = this.props;
        return (
            <FirebaseContext.Consumer>
                {(firebase) => <StartingBlockContent firebase={firebase} history={history} />}
            </FirebaseContext.Consumer>
        )
    }
}

class StartingBlockContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: '',
            realm: '',
            guild: '',
            realmOptions: [],

            loading: false,
        };
    }

    handleSelectChange = (name, value) => {
        if (name === 'region') {
            this.setState({
                realmOptions: realmSource[value]
            });
        }
        this.setState({
            [name]: value
        });
    };


    handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    onSubmit = async e => {
        e.preventDefault();
        const { region, realm, guild } = this.state;

        // If form valid
        if (region && realm && guild) {
            this.setState({ loading: true });

            // Slugify
            const slug = getSlug(region + ' ' + realm + ' ' + guild + ' ');

            // Check if exists in our DB, if yes redirect
            var id = await this.props.firebase.guilds().where('slug', '==', slug).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs[0].data().slug;
                    }
                    else return ''
                });

            // Check rio for guild existence if not found in our data
            if (!id) {
                var faction = "";
                var url = new URL('https://raider.io/api/v1/guilds/profile');
                url.search = new URLSearchParams({ region: region, realm: realm, name: guild });

                const guildFound = await fetch(url.toString())
                    .then(response => response.json())
                    .then((data) => {
                        if (data.error) throw new Error(data.message);
                        else {
                            faction = data.faction;
                            return true;
                        };
                    })
                    .catch((e) => {
                        message.error(e.message ? e.message : 'Error encoutered. Please try again.')
                        return false;
                    })

                // Create guild in our data
                if (guildFound) {
                    await this.props.firebase.guilds().add({
                        region: region,
                        realm: realm,
                        name: guild,
                        slug: slug,
                        faction: faction
                    });
                    id = slug;
                }
            }
            if (id) {
                message.success('Redirecting to guild page', 1).then(() => {
                    this.props.history.push("/guild/" + id); return;
                });
            } else
                this.setState({ loading: false });
        }
        else
            message.error('All fields are required');
    };

    renderTitle = title => {
        return (
            <span>
                {title.toUpperCase()}
            </span>
        );
    }

    render() {
        const { region, realm, guild, loading, realmOptions } = this.state;

        return (
            <div className="Home">
                <Form onSubmit={this.onSubmit}>
                    <Row type="flex" align="middle" style={{ height: '300px', background: `bottom / cover no-repeat url(/banners/get_started_crusader.jpg)` }}>
                        <Col span={24}>
                            <Row type="flex" justify="center" gutter={[0, 100]}>
                                <Col style={{ color: 'white', fontSize: '30px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                                    Get your guild started
                            </Col>
                            </Row>
                            <Row type="flex" justify="center" gutter={[8, 100]} >
                                <Col>
                                    <Select
                                        onChange={(value) => this.handleSelectChange('region', value)}
                                        style={{ width: '90px' }}
                                        placeholder="Region"
                                    >
                                        <Option value="eu">EU</Option>
                                        <Option value="us">US</Option>
                                    </Select>
                                    <Select
                                        showSearch
                                        showArrow={false}
                                        notFoundContent={null}
                                        disabled={!realmOptions.length}
                                        placeholder="Realm"
                                        style={{ width: '160px' }}
                                        onChange={(value) => this.handleSelectChange('realm', value)}
                                        optionFilterProp="children"
                                    >
                                        {realmOptions.map(opt => (
                                            <Option key={opt.name} value={opt.slug}>
                                                {opt.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col>
                                    <Input
                                        name='guild'
                                        style={{ width: 200 }}
                                        onChange={this.handleInputChange}
                                        placeholder="Guild name"
                                    />
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" gutter={[0, 32]} >
                                <Col>
                                    <Form.Item>
                                        <Button
                                            disabled={!(realm && guild && region)}
                                            htmlType="submit"
                                            loading={loading}
                                        >Track guild</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default withRouter(StartingBlock);