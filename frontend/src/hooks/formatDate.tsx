const formatDate = (date: string) => {
    // 2022-05-17T19:46:42Z
    const [year, month, rest1] = date.split('-')
    const [day, rest2] = rest1.split('T')
    const [hour, minute, _] = rest2.split(':')
    return `${month}/${day} ${hour}:${minute}`
}
export default formatDate;
