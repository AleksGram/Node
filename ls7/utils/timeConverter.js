exports.convertTime = time => {
    const dateObj = new Date(time);
    const date = dateObj.toDateString();
    const hours = dateObj.getHours();
    const min = dateObj.getMinutes();
    const sec = dateObj.getSeconds();
    return `${date} ${hours}:${min < 10 ? ("0" + min) : min}:${sec < 10 ? ("0" + sec) : sec}`;
  }
  