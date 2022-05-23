import axios from "axios";
import { csrftoken } from '../csrftoken';

const SendEmail = (userIds, action, targetId) => {
    axios.post(`api/email/${userIds}/${action}/${targetId}/`, { headers: { 'X-CSRFToken': csrftoken } })
        .then((res) => {
        })
        .catch(errors => console.warn(errors));
};

export default SendEmail;