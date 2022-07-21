const CHROME_SETTINGS_BUTTON = document.getElementById('chrome-settings-btn');
const CHROME_SHORTCUTS_BUTTON = document.getElementById('chrome-shortcuts-btn');

CHROME_SETTINGS_BUTTON.addEventListener('click', () => {
    chrome.tabs.create({'url': `chrome://extensions/?id=${chrome.runtime.id}`});
});

CHROME_SHORTCUTS_BUTTON.addEventListener('click', () => {
    chrome.tabs.create({'url': 'chrome://extensions/shortcuts'});
});