import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { Skeleton, Row, Col, Avatar, Divider } from 'antd';


const GuildContent = (props) => {
    console.log(props);
    props.raid_rankings = (({ "nyalotha-the-waking-city":n, "the-eternal-palace":ep}) => ({"nyalotha-the-waking-city":n, "the-eternal-palace":ep}))(props.raid_rankings);

    return (
        <div className="guildContent">
            <Row type="flex" justify="center" align="middle" gutter={[16, 0]}>
                <Col style={{ fontWeight: 'bolder', fontSize: '30px' }}>
                    {props.name}
                </Col>
                <Col>
                    <Avatar src={`/icons/icon_${props.faction}.png`}></Avatar>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col style={{ textTransform: 'uppercase' }}>
                    <span style={{ textTransform: 'uppercase' }}>{props.region} - </span><span style={{ textTransform: 'capitalize' }}>{props.realm}</span>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <a target="_blank" rel="noopener noreferrer" href={`//raider.io/guilds/${props.region}/${props.realm}/${props.name}`}>
                    <Avatar src={`/icons/raiderio.png`}></Avatar>
                </a>
            </Row>
            <Divider style={{ marginTop: '42px' }}>Progress</Divider>
            <Row type="flex" justify="center">
                <pre>
                    {JSON.stringify(props.raid_rankings, null, 2)}
                </pre>
            </Row>
        </div>
    )
}

const Guild = (props) => {
    const firebase = useContext(FirebaseContext);
    const [guildData, setGuildData] = useState({})
    const [didMount, setDidMount] = useState(false)

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const result = await firebase.guilds().where('slug', '==', props.match.params.slug).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs[0].data();
                    }
                    else return {};
                });
            setGuildData(result);
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
        content = GuildContent(guildData)
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