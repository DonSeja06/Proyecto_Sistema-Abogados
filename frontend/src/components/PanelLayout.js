import React, { Component } from 'react';
import NavegacionPanel from './NavegacionPanel';
import './PanelLayout.css';

export default class PanelLayout extends Component {
    render() {
        return (
            <div className="panel-container">
                <NavegacionPanel />
                <div className="container mt-4">
                    {this.props.children}
                </div>
            </div>
        )
    }
}