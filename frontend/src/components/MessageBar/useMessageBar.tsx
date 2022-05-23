import { useState } from 'react';

export function useMessageBar() {
    const [isActive, setIsActive] = useState(false);
    const [message, setMessage] = useState<string>();
    const [alertType, setAlertType] = useState<string>('info');
    // React.useEffect(() => {
    //     if (isActive === true) {
    //         setTimeout(() => {
    //             setIsActive(false);
    //         }, 9000);
    //     }
    // }, [isActive]);

    const openMessageBar = (msgAlertType: string, msg: string) => {
        let hasErrors = false
        if (msg) {
            if (msgAlertType === 'error')
                hasErrors = true
            setMessage(msg)
            setIsActive(true);
            setAlertType(msgAlertType)

        }
        return hasErrors
    }

    return { alertType, isActive, setIsActive, message, openMessageBar }
}
// const showMessageBarHandler = (messages: string) => {
//     let hasErrors = false
//     if (messages) {
//         for (const [msgAlertType, message] of Object.entries(messages)) {
//             openMessageBar(msgAlertType, message);
//             if (msgAlertType === 'error')
//                 hasErrors = true
//         }
//     }
//     return hasErrors
// }
