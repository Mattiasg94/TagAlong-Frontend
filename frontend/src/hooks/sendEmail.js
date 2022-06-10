import axios from "axios";
import { csrftoken } from '../csrftoken';

import {url} from '../routes';
const SendEmail = (userIds, action, targetId) => {
    axios.post(`${url}api/email/${userIds}/${action}/${targetId}/`, { headers: { 'X-CSRFToken': csrftoken } })
        .then((res) => {
        })
        .catch(errors => console.warn(errors));
};

export default SendEmail;