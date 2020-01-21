import React from 'react';
import { Row, Col, Statistic, Button, Tooltip } from 'antd';
const { Countdown } = Statistic;

const Progress = (props) => {
    const { data, active } = props;
    var style = {
        height: props.type && props.type === 'guild' ? '120px' : '220px',
        marginTop: '10px',
        background: `top / cover no-repeat url(/raid/${data.slug}/banner.webp)`
    }

    if (data.status === 2) {
        // eslint-disable-next-line 
        Object.assign(style, { filter: 'gray', WebkitFilter: 'grayscale(1)' })
    }

    return (
        <div className="Progress">
            <Row type="flex" align="middle" style={style}>
                <Col span={24}>
                    {/* Header */}
                    {props.type && props.type === 'guild' ? ''
                        : <Row type="flex" justify="center" gutter={[0, 32]}>
                            <Col style={{ color: 'white', fontSize: '18px' }}>
                                {data.status === 2 ? 'Upcoming' : data.status === 1 ? 'Currently progressing' : 'Finished'}
                            </Col>
                        </Row>
                    }
                    {/* Progress text */}
                    <Row type="flex" justify="center" gutter={[0, 100]}>
                        <Col style={{ color: 'white', fontSize: '30px', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                            <img style={{ width: '100%' }} alt="" src={"/raid/" + data.slug + "/text.png"} />
                        </Col>
                    </Row>
                    {/* Footer */}
                    {props.type && props.type === 'guild' ? ''
                        :
                        < Row type="flex" justify="center" gutter={[0, 32]}>
                            <Col style={{ color: 'white', fontSize: '20px' }}>
                                {data.status === 2 ? (
                                    <Row type="flex" justify="center" gutter={20}>
                                        <Col>
                                            <Countdown format="D [days] HH:mm:ss" valueStyle={{ color: 'white', fontSize: '24px' }} value={data.release} />
                                        </Col>
                                        <Col>
                                            <Tooltip placement="topLeft" title="Register NOW from your guild page !" arrowPointAtCenter>
                                                <Button icon="warning" shape="circle"></Button>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                ) : data.status === 1 && active > 0 ? `${active} active guilds` : ''}
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        </div >
    );
}

export default Progress;