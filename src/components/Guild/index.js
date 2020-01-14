import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { Skeleton, Icon, Row, Col, Avatar, Divider, Form, Select, Collapse, Button } from 'antd';
import Progress from '../Progress';
import { RAID_SIZE, RAID_MODE, RAID_TIME } from '../../constants/objectives';

const { Option } = Select;
const { Panel } = Collapse;



const GuildContent = (props) => {
    const [modeData, setModeData] = useState('')
    const [sizeData, setSizeData] = useState('')
    const [timeData, setTimeData] = useState('')

    console.log(props);
    if (Object.keys(props).length === 0 && props.constructor === Object) return "";

    const onSubmit = async e => {
        e.preventDefault();
        console.log('submit')
    }

    return (
        <div className="guildContent">
            <Row type="flex" justify="center" align="middle" gutter={[16, 0]}>
                <Col style={{ fontWeight: 'bolder', fontSize: '30px' }}>
                    {props.guildData.name}
                </Col>
                <Col>
                    <Avatar src={`/icons/icon_${props.guildData.faction}.png`}></Avatar>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col style={{ textTransform: 'uppercase' }}>
                    <span style={{ textTransform: 'uppercase' }}>{props.guildData.region} - </span><span style={{ textTransform: 'capitalize' }}>{props.guildData.realm}</span>
                </Col>
            </Row>
            <Row type="flex" justify="center" style={{ marginTop: '12px' }}>
                <a target="_blank" rel="noopener noreferrer" href={`//raider.io/guilds/${props.guildData.region}/${props.guildData.realm}/${props.guildData.name}`}>
                    <Avatar src={`/icons/raiderio.webp`}></Avatar>
                </a>
            </Row>
            <Divider style={{ marginTop: '42px' }}>Progress</Divider>
            {props.progressData.map((o) => (
                <div key={o.slug} id={o.slug + "-progress"}>
                    <Progress data={o} key={o.status} type="guild" />
                    {o.status && o.status === 2 ?
                        <Collapse style={{ borderRadius: '0px' }}>
                            <Panel
                                header={
                                    <Row type="flex" justify="center" align="middle" gutter={20}>
                                        <Col style={{ fontSize: '18px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                                            Registered
                                        </Col>
                                        <Col style={{ fontSize: '24px' }}>
                                            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                                            <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
                                        </Col>
                                    </Row>
                                }>
                                <Row type="flex" justify="center" style={{ marginTop: '32px', marginBottom: '32px' }}>
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                                        <Form onSubmit={onSubmit}>
                                            <Form.Item>
                                                <Select
                                                    style={{ textTransform: 'capitalize' }}
                                                    placeholder="Raid difficulty"
                                                    onChange={(value) => setModeData(value)}
                                                >
                                                    {
                                                        Object.keys(RAID_MODE).map((key) =>
                                                            <Option
                                                                disabled={sizeData && !(sizeData === 'm') && key === 'mm' ? true : false}
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
                                                    onChange={(value) => setSizeData(value)}
                                                >
                                                    {
                                                        Object.keys(RAID_SIZE).map((key) =>
                                                            <Option disabled={modeData && modeData === 'mm' && !(key === 'm') ? true : false}
                                                                style={{ textTransform: 'capitalize' }} key={key}>{RAID_SIZE[key].name + ' (' + RAID_SIZE[key].min + '-' + RAID_SIZE[key].max + ')'}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item>
                                                <Select
                                                    style={{ textTransform: 'capitalize' }}
                                                    placeholder="Avg. raid time per week"
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
                                                            disabled={!(timeData && modeData && sizeData)}
                                                            htmlType="submit"
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
                        <Row type="flex" justify="center" style={{ marginTop: '32px', marginBottom: '32px' }}>
                            <Col>
                                <Row type="flex" justify="center" align="middle" style={{ fontSize: '24px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                                    {props.guildData.raid_progression[o.slug].summary}
                                </Row>
                                <Row type="flex" justify="center" style={{ marginTop: '16px' }} gutter={[16, 16]}>
                                    {[...Array(props.guildData.raid_progression[o.slug].total_bosses)].map((x, i) =>
                                        <Col key={i + 1}>
                                            <img alt="" src={"/raid/" + o.slug + "/boss" + (i + 1) + ".webp"}
                                                style={{ borderRadius: ".25rem", WebkitFilter: props.guildData.raid_progression[o.slug].heroic_bosses_killed >= i + 1 ? "none" : "grayscale(1)" }} />
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    }
                </div>
            )
            )}
        </div>
    )
}

const Guild = (props) => {
    const firebase = useContext(FirebaseContext);
    const [guildData, setGuildData] = useState({})
    const [progressData, setProgressData] = useState({})
    const [didMount, setDidMount] = useState(false)

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const gData = await firebase.guilds().where('slug', '==', props.match.params.slug).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs[0].data();
                    }
                    else return {};
                });
            setGuildData(gData);

            const pData = await firebase.progress().get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs;
                    }
                    else return;
                });
            setProgressData(pData.map(progress => progress.data()).sort(function (a, b) {
                return b.status - a.status;
            }));

            setDidMount(true);
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Check fetched data
    useEffect(() => {
        if (didMount) {
            if (Object.keys(guildData).length === 0 && guildData.constructor === Object)
                props.history.push("/404");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [didMount]);

    var content;
    if (didMount) {
        content = <GuildContent guildData={guildData} progressData={progressData} />
    } else {
        content = <Skeleton active />
    }

    return (
        <div className="Guild">
            <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>{content}</div>
        </div>
    )
}

export default Guild;