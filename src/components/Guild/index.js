import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { Skeleton, Row, Col, Avatar, Divider } from 'antd';
import Progress from '../Progress';
import Objective from '../Objective';
import { GuildLinks, ProgressKills } from '../../helpers/helpers'

const GuildContent = (props) => {
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
                <Col>
                    <span style={{ textTransform: 'uppercase' }}>{props.guildData.region} - </span><span style={{ textTransform: 'capitalize' }}>{props.guildData.realm}</span>
                </Col>
            </Row>
            <GuildLinks guild={props.guildData} style={{ marginTop: '12px' }} />
            <Divider style={{ marginTop: '42px' }}>Progress</Divider>
            {props.progressData.map((o) => (
                ((o.status && o.status > 0) || (o.status && o.status < 0 && props.guildData.raid_objectives && props.guildData.raid_objectives[o.slug])) ?
                    <div key={o.slug} id={o.slug + "-progress"}>
                        <Progress data={o} key={o.status} type="guild" />
                        <Objective
                            guild={props.guildData.key}
                            progress={o}
                            objective={props.guildData.raid_objectives && props.guildData.raid_objectives[o.slug]}
                            league={props.guildData.leagues && props.guildData.leagues[o.slug]}
                        />
                        {o.status && o.status < 2 && props.guildData.raid_objectives && props.guildData.raid_objectives[o.slug] ?
                            <ProgressKills guild={props.guildData} progress={o.slug} />
                        : ''}
                    </div>
                    : ''
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
            const gData = await firebase.guilds().where('slug', '==', props.match.params.slug).limit(1).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return { ...snapshot.docs[0].data(), ...{ key: snapshot.docs[0].id } };
                    }
                    else return {};
                });
            setGuildData(gData);

            const pData = await firebase.progress().orderBy('status', 'desc').limit(10).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs;
                    }
                    else return;
                });
            setProgressData(pData.map(progress => progress.data()));

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