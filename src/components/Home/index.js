import React, { useContext, useEffect, useState } from 'react';
import StartingBlock from '../StartingBlock';
import Progress from '../Progress';

import { FirebaseContext } from '../Firebase';

const Home = () => {
    const firebase = useContext(FirebaseContext);
    const [progressData, setProgressData] = useState([])
    // const [didMount, setDidMount] = useState(false)

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const progressResult = await firebase.progress().where('status', 'in', [1, 2]).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs;
                    }
                    else return;
                });
            setProgressData(progressResult.map(progress => progress.data()).sort(function (a, b) {
                return b.status - a.status;
            }));
        }

        fetchData() 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Home" >
            <StartingBlock />
            {progressData.map((o) => <Progress data={o} key={o.status} />)}
        </div >
    );
}

export default Home;