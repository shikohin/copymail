import React from 'react';
import Base from './components/Base';
import io from 'socket.io-client';

require('!style!css!bootstrap/dist/css/bootstrap.css');
require('./assets/sass/style.scss');

const App = React.createClass({
    render() {
        return (
            <Base
                state={this.state}
                handle={this.handleDataChange}
                handleMessages={this.handleMessagesChange}
            />
        );
    },

    getInitialState() {
        return {
            file           : null,
            socket         : null,
            messages       : [],
            currentMessage : '',
            copying        : false,
            progress       : 0
        };
    },

    handleDataChange(data) {
        this.setState({
            file    : (typeof data.file != "undefined") ?  data.file : '',
            response: (typeof data.response != "undefined") ?  data.response : ''
        });
    },

    handleMessagesChange(messages) {
        this.setState({messages: messages});
    },

    componentWillMount() {
        let socket = io.connect('http://' + document.domain + ':' + location.port);
        let app = this;

        socket.on('server_error', function(json) {
            app.setState({
                copying: false,
                progress: json.data.progress,
                currentMessage: json.data.currentMessage
            });
        });

        socket.on('update_progress', function(json) {
            app.setState({
                progress: json.progress,
                currentMessage: json.currentMessage
            });
        });

        this.setState({socket: socket})
    }
});

export default App;