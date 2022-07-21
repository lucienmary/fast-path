const DEBUG_STOP_REDIRECT = false;                                      // FALSE by default.
const BUTTON_GO = document.getElementById('button-go');
const INPUT_PATH = document.getElementById('input-path');
const CHECKBOX_NEWTAB = document.getElementById('input-target-link');
const ERROR_AREA = document.getElementById('errorArea');                // Area for error alert. (Hidden if no error)

window.addEventListener("load", function () {
    saveInputPath();
    saveCheckboxNewTab();

    INPUT_PATH.focus();
});

INPUT_PATH.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        BUTTON_GO.click();
    }
  });

BUTTON_GO.addEventListener('click', () => {
    if (INPUT_PATH.value.length != 0) {
        chrome.storage.sync.set({ "inputPathStorage": INPUT_PATH.value });
    }else{
        displayError('Please fill in the field.');
        return;
    }
    chrome.storage.sync.set({ "checkboxNewtabStorage": CHECKBOX_NEWTAB.checked });
    saveInputPath();
    saveCheckboxNewTab();

    chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
        var currentUrl = new URL(tabs[0].url);
        var entireUrlToUse = currentUrl.origin + INPUT_PATH.value;

        if (DEBUG_STOP_REDIRECT == false) {
            if (CHECKBOX_NEWTAB.checked == true) {
                chrome.tabs.create({ url: entireUrlToUse, index: tabs[0].index });
            } else {
                chrome.tabs.update(undefined, { url: entireUrlToUse });
            }
        }
    });
}, false);

function saveInputPath() {
    chrome.storage.sync.get("inputPathStorage", function (item) {
        if (item.inputPathStorage) {
            INPUT_PATH.value = item.inputPathStorage;
        }else{
            INPUT_PATH.value = '';
        }
    });
}

function saveCheckboxNewTab() {
    chrome.storage.sync.get("checkboxNewtabStorage", function (item) {
        CHECKBOX_NEWTAB.checked = item.checkboxNewtabStorage;
    });
}

function displayError(errorMsg) {
    ERROR_AREA.innerHTML = errorMsg;
    ERROR_AREA.classList.add('display');

    setTimeout(() => {
        ERROR_AREA.classList.remove('display');
    }, 2500);
}


// Shortcuts.
chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'go-to-the-path':
            BUTTON_GO.click();
            break;
        case 'new-tab':
            CHECKBOX_NEWTAB.click();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

// Display shortcuts in popup.
chrome.commands.getAll((commands) => {   
    for (let {name, shortcut} of commands) {
        const KEY = document.getElementById(`key-command_${name}`);
        KEY.innerText = shortcut;
    }
});