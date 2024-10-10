"use client";
import React from "react";
import styles from "../css/passwordResetStyle.module.css";
import PasswordChange from "./PasswordChange";
import EmailInput from "./EmailInput";

export default class PasswordResetApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: 'EmailInput'
        };
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const resetParam = urlParams.get('reset');

        if (resetParam) {
            this.setState({ currentComponent: 'PasswordChange' });
        }
    }

    switchComponent = (componentName) => {
        this.setState({ currentComponent: componentName });
    }

    render() {
        const { currentComponent } = this.state;
        const { passwordResetData } = this.props;

        return (
            <div>
                {currentComponent === 'EmailInput' &&
                    <EmailInput
                        passwordResetData={passwordResetData}
                        onSwitchComponent={this.switchComponent}
                    />}
                {currentComponent === 'PasswordChange' &&
                    <PasswordChange
                        passwordResetData={passwordResetData}
                    />}
            </div>
        );
    }
}

