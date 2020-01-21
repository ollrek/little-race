import app from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
class Firebase {
    constructor() {
        app.initializeApp(config);
        this.db = app.firestore();

        this.db.enablePersistence()
            .catch(function (err) {
                console.log(err);
            });
    }

    // *** User API ***
    // user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.collection("users");

    // *** Guild API ***
    guilds = () => this.db.collection("guilds");

    // *** Progress API ***
    progress = () => this.db.collection("progress");

    // *** Stats API ***
    stats = () => this.db.collection("stats");

    // *** Leagues API ***
    leagues = (progress, slug) => this.db.collection("leagues").doc(progress).collection("objective");

}

export default Firebase;