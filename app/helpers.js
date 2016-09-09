export const calcPrice = function(startPrice, endPrice, startDate, endDate) {
  return (startPrice - endPrice) / 
    ((Date.parse(endDate)) - Date.parse(startDate)) 
  * (Date.parse(endDate) - Date.now());
};

export const calcTime = function(endDate) {

  var duration = Date.parse(endDate) - Date.now();
  var seconds = parseInt((duration / 1000) % 60);
  var minutes = parseInt((duration / (1000 * 60)) % 60);
  var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  var days = parseInt(((duration) / (1000 * 60 * 60 * 24)) % 365);

  days = (days < 10) ? '0' + days : days;
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return days + ' days  ' + hours + ':' + minutes + ':' + seconds + ' hours';
};