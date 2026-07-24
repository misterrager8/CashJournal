import moment from "moment";

export const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => (data.success ? callback(data) : alert(data.msg)));

export const moment_ = (timestamp) => {
  let time_ = timestamp ? moment(timestamp) : moment();
  time_.add(time_.utcOffset(), "minutes");
  return time_;
};

export const moment2 = (timestamp) => {
  let time_ = timestamp ? moment(timestamp) : moment();
  return time_;
};
