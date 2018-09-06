chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.notifications.create('worktimer-notification', request.options, function() { });

    sendResponse();
});
