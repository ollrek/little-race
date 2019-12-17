import React, { Component } from 'react';
import { Row, Col, Select, Input, Button, Form, message } from 'antd';

import EU from './data/realms_EU.json';
import US from './data/realms_US.json';

const { Option } = Select;
// const InputGroup = Input.Group;

const realmSource = {
    eu: EU.realms,
    us: US.realms
};

class StartingBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: '',
            realm: '',
            guild: '',
            realmOptions: [],

            loading: false,
        };
    }

    handleSelectChange = (name, value) => {
        if (name === 'origin') {
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

    onSubmit = e => {
        e.preventDefault();
        const { origin, realm, guild } = this.state;
        if (origin && realm && guild)
            message.success(origin + '-' + realm + ' ' + guild);
        else
            message.error('This is an error message');
    };

    renderTitle = title => {
        return (
            <span>
                {title.toUpperCase()}
            </span>
        );
    }

    render() {
        const { origin, realm, guild, loading, realmOptions } = this.state;

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
                                        onChange={(value) => this.handleSelectChange('origin', value)}
                                        style={{ width: '90px' }}
                                        placeholder="Origin"
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
                                            disabled={!(realm && guild && origin)}
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

export default StartingBlock;