// Helpers.js
import React from 'react';
import { Row, Col, Avatar, Tooltip, Icon } from 'antd';
import getSlug from 'speakingurl';

import { RAID_MODE } from '../constants/objectives';

const GuildLinks = (props) => {
    const { guild, style } = props;

    return (
        <Row type="flex" justify="center" style={style} gutter={[12, 0]}>
            <Col>
                <a target="_blank" rel="noopener noreferrer" href={`//raider.io/guilds/${guild.region}/${guild.realm}/${guild.name}`}>
                    <Avatar src={`/icons/raiderio.webp`}></Avatar>
                </a>
            </Col>
            <Col>
                <a target="_blank" rel="noopener noreferrer" href={`https://worldofwarcraft.com/en-gb/guild/${getSlug(guild.region)}/${getSlug(guild.realm)}/${getSlug(guild.name)}`}>
                    <Avatar src={`/icons/wow-icon.png`}></Avatar>
                </a>
            </Col>
            <Col>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.warcraftlogs.com/guild/${guild.region}/${guild.realm}/${guild.name}`}>
                    <Avatar src={`/icons/warcraftlogs-icon.png`}></Avatar>
                </a>
            </Col>
        </Row>
    )
};


const ProgressKills = (props) => {
    const { guild, progress, type } = props;

    const containerStyle = type && (type === 's') ? {} : { marginTop: '16px', marginBottom: '32px' }
    const iconsContainerStyle = type && (type === 's') ? {} : { marginTop: '16px' }
    const iconsContainerCol = type && (type === 's') ? { xs: 0, sm: 24 / guild.raid_progression[progress].total_bosses } : {}

    return (
        <Row type="flex" justify="center" style={containerStyle}>
            {guild.raid_progression && guild.raid_progression[progress] && guild.raid_objectives && guild.raid_objectives[progress] ?
                <Col>
                    {type && (type === 's') ?
                        <Row type="flex" justify="center" align="middle" style={{ textTransform: 'uppercase' }} gutter={[6, 6]}>
                            <Col>
                                {`${guild.raid_progression[progress][RAID_MODE[guild.raid_objectives[progress].modeData] + '_bosses_killed']}/${guild.raid_progression[progress].total_bosses} ${RAID_MODE[guild.raid_objectives[progress].modeData].charAt(0)}`}
                            </Col>
                            <Col>
                                <Tooltip title={`
                                    ${guild.raid_rankings[progress][RAID_MODE[guild.raid_objectives[progress].modeData]].world ? guild.raid_rankings[progress][RAID_MODE[guild.raid_objectives[progress].modeData]].world : 'Unranked'} ${[RAID_MODE[guild.raid_objectives[progress].modeData]]} world`}
                                    placement="topRight"
                                >
                                    <Icon type="question-circle" theme="filled" />
                                </Tooltip>
                            </Col>
                        </Row>
                        :
                        <Row type="flex" justify="center" align="middle" style={{ fontSize: '24px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                            {`${guild.raid_progression[progress][RAID_MODE[guild.raid_objectives[progress].modeData] + '_bosses_killed']}/${guild.raid_progression[progress].total_bosses} ${RAID_MODE[guild.raid_objectives[progress].modeData]}`}
                        </Row>
                    }
                    <Row type="flex" justify="center" style={iconsContainerStyle} gutter={[16, 16]}>
                        {[...Array(guild.raid_progression[progress].total_bosses)].map((x, i) => {
                            return (<Col {...iconsContainerCol} key={i + 1}>
                                <img alt="" src={"/raid/" + progress + "/boss" + (i + 1) + ".webp"}
                                    style={
                                        type === 's' ? { ...{ width: '30px' }, ...{ borderRadius: ".25rem", WebkitFilter: guild.raid_progression[progress][RAID_MODE[guild.raid_objectives[progress].modeData] + '_bosses_killed'] >= i + 1 ? "none" : "grayscale(1)" } }
                                            :
                                            { borderRadius: ".25rem", WebkitFilter: guild.raid_progression[progress][RAID_MODE[guild.raid_objectives[progress].modeData] + '_bosses_killed'] >= i + 1 ? "none" : "grayscale(1)" }}
                                />
                            </Col>
                            )
                        })}
                    </Row>
                </Col>
                :
                <Tooltip title="Guild progress and leagues refreshes once a day for now !">
                    <Icon type="sync" />
                </Tooltip>}
        </Row >
    )
}

const LeaguePic = (props) => {
    const { img, sizeSlug, timeId } = props;

    const timeColors = {
        1: 'rgb(30,255,0)',
        2: 'rgb(0,112,255)',
        3: 'rgb(163,53,238)',
        4: 'rgb(255,128,0)',
        5: 'rgb(226,104,168)',
        6: 'rgb(229,204,128)',
    }

    return (
        <div style={{ position: 'relative' }}>
            <img style={{ borderRadius: '10px' }} alt="" src={img}></img>
            <div style={{
                position: "absolute",
                bottom: "0px",
                right: "4px",
                color: "white",
                textTransform: 'uppercase',
                fontWeight: "bolder"
            }}>{sizeSlug}</div>
            <div style={{
                content: '""',
                position: "absolute",
                height: "100%",
                width: "20px",
                top: "0px",
                backgroundImage:
                    `radial-gradient(circle at center, ${timeColors[timeId]} 6px, transparent 6px)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "bottom center",
                backgroundRepeat: "no-repeat"
            }} />
        </div>
    )
}

export { GuildLinks, ProgressKills, LeaguePic };