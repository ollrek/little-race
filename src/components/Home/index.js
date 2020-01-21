import React, { useContext, useEffect, useState } from 'react';
import StartingBlock from '../StartingBlock';
import Progress from '../Progress';

import { FirebaseContext } from '../Firebase';

const Home = () => {
    const firebase = useContext(FirebaseContext);
    const [progressData, setProgressData] = useState([])
    const [activeData, setActiveData] = useState('')

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            const progressResult = await firebase.progress().orderBy('status', 'desc').limit(2).get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs;
                    }
                    else return;
                });
            setProgressData(progressResult.map(progress => progress.data()));

            const activeResults = await firebase.stats().doc('active').get().then(
                (snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.data().value;
                    }
                    else return;
                });
            setActiveData(activeResults + '');
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Home" >
            <StartingBlock />
            {progressData.map((o) => <Progress data={o} key={o.status} active={activeData}/>)}
        </div >
    );
}

export default Home;