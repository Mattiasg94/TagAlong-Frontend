import React, { PureComponent } from 'react';
import Styles from './MessageBar.module.css'

export class MessageBar extends PureComponent {
    split(messsage) {
        if(messsage)
        return messsage.split('\n').map((str,index) => <p key={index}>{str}</p>)
    }
    render() {
        const { isActive, setIsActive, message, alertType } = this.props;
        let styles ={'error':Styles.alertMessageDanger,'info':Styles.alertMessageInfo}
        return (
            <div className={isActive ? [Styles.alertMessage,styles[alertType]].join(" ")
                : [Styles.displayNone]}>
                <span onClick={() => setIsActive(false)} >&times;</span>
                {this.split(message)}
            </div>
        )
    }
}