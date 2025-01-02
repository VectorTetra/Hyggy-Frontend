"use client";
import themeFrame from "@/app/AdminPanel/tsx/ThemeFrame";
import { ThemeProvider } from "@mui/material";
import React from "react";
import EmailInput from "./EmailInput";
import PasswordChange from "./PasswordChange";

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
            <ThemeProvider theme={themeFrame}>

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
            </ThemeProvider>
        );
    }
}

