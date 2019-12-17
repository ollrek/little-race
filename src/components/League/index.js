import React, { Component } from 'react';
import { FirebaseContext } from '../Firebase';

class League extends Component {
    render() {
        return (
            <div className="League">
                <FirebaseContext.Consumer>
                    {firebase => <SignUpForm firebase={firebase} />}
                </FirebaseContext.Consumer>
            </div>
        )
    }
}

const INITIAL_STATE = {
    fullname: "",
    email: "",
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const { fullname, email } = this.state;

        console.log(this.props.firebase);
        this.props.firebase.users().add({
            fullname: fullname,
            email: email
        });
        this.setState({
            fullname: "",
            email: "",
        });
    };

    render() {
        const {
            fullname,
            email,
        } = this.state;

        return (
            <div className="SignUpForm">
                <form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        name="fullname"
                        placeholder="Full name"
                        onChange={this.onChange}
                        value={fullname}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={this.onChange}
                        value={email}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default League;

export { SignUpForm };