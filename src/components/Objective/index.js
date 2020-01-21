import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import { Icon, Row, Col, Form, Select, Collapse, Button, message } from 'antd';

import { RAID_SIZE, RAID_MODE, RAID_TIME } from '../../constants/objectives';

import { Link } from 'react-router-dom';

const { Option } = Select;
const { Panel } = Collapse;

const Objective = (props) => {
    const firebase = useContext(FirebaseContext);

    const { slug, status } = props.progress;
    const { guild, league } = props;

    const [objective, setObjective] = useState(props.objective)
    // const [leagueData, setLeagueData] = useState({})

    const [modeData, setModeData] = useState((objective && objective.modeData) || undefined)
    const [sizeData, setSizeData] = useState((objective && objective.sizeData) || undefined)
    const [timeData, setTimeData] = useState((objective && objective.timeData) || undefined)

    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        if (modeData && sizeData && timeData && !(status === 1 && objective)) {
            setLoading(true);
            const newObjective = {
                "modeData": modeData,
                "sizeData": sizeData,
                "timeData": timeData,
                "slug": modeData * 100 + sizeData * 10 + timeData * 1
            };

            firebase.guilds().doc(guild).update({
                tag: true,
                ["raid_objectives." + slug]: newObjective
            }).then(() => {
                setObjective(newObjective);
                setLoading(false);
                message.success('Objective updated', 1);
            })
        } else {
            message.error((status === 1 && objective) ? "Can't modify an active objective" : 'All fields are required');
        }
    }

    return (
        <div className="objective">
            {status && (status === 2 || (status === 1 && !objective)) ?
                <Collapse style={{ borderRadius: '0px' }}>
                    <Panel
                        header={
                            <Row type="flex" justify="center" align="middle" gutter={20}>
                                <Col style={{ fontSize: '18px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                                    {objective ? status === 2 ? 'Registered' : 'Active'
                                        : 'Not registered'
                                    }
                                </Col>
                                <Col style={{ fontSize: '24px' }}>
                                    {objective ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                                        : <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
                                    }
                                </Col>
                            </Row>
                        }>
                        <Row type="flex" justify="center" style={{ marginTop: '32px' }}>
                            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                                <Form onSubmit={onSubmit}>
                                    <Form.Item>
                                        <Select
                                            style={{ textTransform: 'capitalize' }}
                                            placeholder="Max raid difficulty you aim"
                                            value={modeData}
                                            onChange={(value) => setModeData(value)}
                                        >
                                            {
                                                Object.keys(RAID_MODE).map((key) =>
                                                    <Option
                                                        disabled={sizeData && !(sizeData === '3') && key === '3' ? true : false}
                                                        style={{ textTransform: 'capitalize' }} key={key}>{RAID_MODE[key]}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Select
                                            style={{ textTransform: 'capitalize' }}
                                            placeholder="Avg. raid size"
                                            value={sizeData}
                                            onChange={(value) => setSizeData(value)}
                                        >
                                            {
                                                Object.keys(RAID_SIZE).map((key) =>
                                                    <Option disabled={modeData && modeData === '3' && !(key === '3') ? true : false}
                                                        style={{ textTransform: 'capitalize' }} key={key}>
                                                        {RAID_SIZE[key].name + ' (' + RAID_SIZE[key].min + '-' + RAID_SIZE[key].max + ')'}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Select
                                            style={{ textTransform: 'capitalize' }}
                                            placeholder="Avg. raid time per week"
                                            value={timeData}
                                            onChange={(value) => setTimeData(value)}
                                        >
                                            {
                                                Object.keys(RAID_TIME).map((key) =>
                                                    <Option style={{ textTransform: 'capitalize' }} key={key}>{RAID_TIME[key]}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Row type="flex" justify="center">
                                            <Col>
                                                <Button
                                                    disabled={!(timeData && modeData && sizeData) || (status === 1 && objective)}
                                                    htmlType="submit"
                                                    loading={loading}
                                                >Update objective</Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
                :
                <Row style={{ marginTop: '16px' }} type="flex" justify="center">
                    <Col style={{ textTransform: 'capitalize' }} >
                        {status === 1 ?
                            <Row type="flex" justify="center" align="middle" style={{ fontSize: '12px', }}>
                                <Col>Current progress</Col>
                            </Row>
                            : ''}
                        {RAID_MODE[modeData] + ' - '}
                        {RAID_SIZE[sizeData].name + ' (' + RAID_SIZE[sizeData].min + '-' + RAID_SIZE[sizeData].max + ')'}
                        {' - ' + RAID_TIME[timeData]}
                        {league && league.slug ?
                            <Row type="flex" justify="center" >
                                <Link to={`/league/${slug}/${league.slug}`}>League {league.name}</Link>
                            </Row>
                            : ''}
                    </Col>
                </Row>
            }
        </div >

    )
}

export default Objective;