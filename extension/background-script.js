function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "notification") {
    localStorage['notificationCount'] = (localStorage['notificationCount'] || 0) + 1;
    sleep(request.delay*1000).then(function() { // .rewrite with value to check against `localStorage['notificationCount']`
      chrome.notifications.create(`cookify-notification${localStorage['notificationCount']}`, request.options);
      sendResponse();
    });
  }
});
