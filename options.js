const chromeSettingsButton = document.getElementById('chrome-setting-btn');

chromeSettingsButton.addEventListener('click', () => {
    console.log('lol');
    chrome.tabs.create({'url': `chrome://extensions/?id=${chrome.runtime.id}`});
});