import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { Row, Col, Avatar, List } from 'antd';
import { Link } from 'react-router-dom';

import Progress from '../Progress';
import { ProgressKills, LeaguePic } from '../../helpers/helpers'
import { RAID_SIZE, RAID_MODE, RAID_TIME } from '../../constants/objectives';

const LeagueContent = (props) => {
    const { guildsData, leagueData, progress } = props;
    const [modeData, sizeData, timeData] = [...leagueData.key + '']

    const [page, setPage] = useState(1);

    return (
        <div className="leagueContent">
            <Row type="flex" justify="center" align="middle" gutter={[16, 0]}>
                <Col style={{ fontWeight: 'bolder', fontSize: '30px' }}>
                    <Row type="flex" justify="center" gutter={[6, 0]}>
                        <Col>League</Col>
                        <Col style={{ textAlign: 'center' }}><span style={{ textTransform: 'capitalize' }}> {leagueData.name}</span></Col>
                    </Row>
                </Col>
                <Col>
                    <LeaguePic img={"/raid/" + progress + "/boss" + leagueData.icon + ".webp"} sizeSlug={RAID_SIZE[sizeData].slug} timeId={timeData} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col style={{ textTransform: 'capitalize' }}>
                    {RAID_MODE[modeData] + ' - '}
                    {RAID_SIZE[sizeData].name + ' (' + RAID_SIZE[sizeData].min + '-' + RAID_SIZE[sizeData].max + ')'}
                    {' - ' + RAID_TIME[timeData]}
                </Col>
            </Row>
            <Progress type="guild" data={{ slug: progress }} />
            <Row type="flex" justify="center" style={{ marginTop: '32px' }}>
                <Col xs={24} sm={20}>
                    <List
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                setPage(page);
                            },
                            pageSize: 10,
                        }}
                        loading={guildsData.length === 0}
                        dataSource={guildsData}
                        style={{ margin: '0 6px 20px 6px' }}
                        renderItem={(guild, i, pagination) => (
                            <List.Item
                                key={guild.name}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={`/icons/icon_${guild.faction}.png`} />}
                                    title={
                                        <Row type='flex' gutter={[10, 0]}>
                                            <Col style={{ fontWeight: 'bolder', fontFamily: 'courier new', fontSize: '20px' }}>{i + 1 + (page - 1) * 10}</Col>
                                            <Col><Link to={`/guild/${guild.slug}`}>{guild.name}</Link></Col>
                                        </Row>
                                    }
                                    description={
                                        <div>
                                            <span style={{ textTransform: 'uppercase' }}>{guild.region}-</span>
                                            <span style={{ textTransform: 'capitalize' }}>{guild.realm}</span>
                                        </div>}
                                />
                                <Row>
                                    <Col span={24}>
                                        <ProgressKills guild={guild} progress={progress} type="s" />
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
}

const League = (props) => {
    const firebase = useContext(FirebaseContext);
    const { progress, slug } = props.match.params;
    const [objectiveSlug, id] = slug.split(/-(?=[^-]+$)/);

    const [leagueData, setLeagueData] = useState(undefined)
    const [guildsData, setGuildsData] = useState([])

    // Fetch league data
    useEffect(() => {
        const fetchLeagueData = async () => {
            const lData = await firebase.leagues(progress).where('slug', '==', objectiveSlug).limit(1).get().then(
                async (snapshot) => {
                    if (!snapshot.empty) {
                        return {
                            ...await firebase.leagues(progress).doc(snapshot.docs[0].id).collection('objLeagues').doc(id + '').get().then(
                                (snapshot) => {
                                    if (!snapshot.empty) {
                                        return { ...snapshot.data() };
                                    }
                                }),
                            ...{ key: snapshot.docs[0].id }
                        }
                    }
                });
            setLeagueData(lData);
        }

        fetchLeagueData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch guilds data
    useEffect(() => {
        const fetchGuildsData = async () => {
            if (leagueData && leagueData.guilds) {
                let gData = []
                for (let guild of leagueData.guilds) {
                    gData.push(await firebase.guilds().doc(guild).get().then(
                        (snapshot) => {
                            return snapshot.data();
                        }));
                }

                setGuildsData(gData.sort((a, b) => {
                    const aVal = a.raid_rankings[progress][RAID_MODE[('' + leagueData.key[0])]].world > 0 ? a.raid_rankings[progress][RAID_MODE[('' + leagueData.key[0])]].world : 100000
                    const bVal = b.raid_rankings[progress][RAID_MODE[('' + leagueData.key[0])]].world > 0 ? b.raid_rankings[progress][RAID_MODE[('' + leagueData.key[0])]].world : 100000
                    return aVal - bVal
                }));
            } else if (leagueData) {
                props.history.push("/404");
            }
        }

        fetchGuildsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueData]);

    const content = leagueData ? <LeagueContent leagueData={leagueData} guildsData={guildsData} progress={progress}></LeagueContent> : '';

    return (
        <div className="League">
            {content}
        </div>
    )
}

export default League;