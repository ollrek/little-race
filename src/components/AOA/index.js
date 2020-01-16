import React from 'react';
import { Empty } from 'antd';

const AOA = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'center' }} className="404">
            <Empty
                description={
                    <span style={{ fontSize: '30px' }}>
                        404 - Page not found
                </span>
                }
            >
            </Empty>
        </div>
    )
};


export default AOA;