// alert("script");

const ul = document.getElementById("list");

const convertTime = time => {
  const dateObj = new Date(time);
  const date = dateObj.toDateString();
  const hours = dateObj.getHours();
  const min = dateObj.getMinutes();
  const sec = dateObj.getSeconds();
  return `${date} ${hours}:${min < 10 ? ("0" + min) : min}:${sec < 10 ? ("0" + sec) : sec}`;
}

fetch("/messages")
  .then(res => res.json())
  .then(data => {
    data.forEach(({text, sender, addedAt}) => {
      const li = document.createElement("li");
      li.innerHTML = `${convertTime(addedAt)} <br/>
      <span>${sender}</span> </br>
      <b>${
        text
      }</b>`;
      ul.appendChild(li);
    });
  });

