import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { Skeleton, Row, Col, Avatar, Divider } from 'antd';
import Progress from '../Progress';
import Objective from '../Objective';

const GuildContent = (props) => {
    console.log(props);
    if (Object.keys(props).length === 0 && props.constructor === Object) return "";

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
                    <Objective
                        guild={props.guildData.key} progress={o} objective={props.guildData.raid_objectives && props.guildData.raid_objectives[o.slug]}
                    />
                    {o.status && o.status < 2 ?
                        <Row type="flex" justify="center" style={{ marginTop: '16px', marginBottom: '32px' }}>
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
                        : ''}
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
                        return { ...snapshot.docs[0].data(), ...{ key: snapshot.docs[0].id } };
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