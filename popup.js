const DEBUG_STOP_REDIRECT = false;                                      // FALSE by default.
const BUTTON_GO = document.getElementById('button-go');
const INPUT_PATH = document.getElementById('input-path');
const CHECKBOX_NEWTAB = document.getElementById('input-target-link');
const CHECKBOX_TABGROUP = document.getElementById('input-tabgroup');
const ERROR_AREA = document.getElementById('errorArea');                // Area for error alert. (Hidden if no error)

window.addEventListener("load", () => {
    getInputPath();
    getCheckboxNewTab();
    updateRangeNewTab(true);

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
    getInputPath();
    getCheckboxNewTab();

    chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
        var currentUrl = new URL(tabs[0].url);
        var entireUrlToUse = currentUrl.origin + INPUT_PATH.value;

        if (DEBUG_STOP_REDIRECT == false) {
                console.log(CHECKBOX_NEWTAB.value);

            if (CHECKBOX_NEWTAB.value == '0') {
                chrome.windows.create({url: entireUrlToUse, type: "normal"});
            } else if (CHECKBOX_NEWTAB.value == '1') {
                chrome.tabs.create({ url: entireUrlToUse, index: tabs[0].index });

            } else {
                chrome.tabs.update(undefined, { url: entireUrlToUse });
            }
        }
    });
}, false);

function getInputPath() {
    chrome.storage.sync.get("inputPathStorage", function (item) {
        if (item.inputPathStorage) {
            INPUT_PATH.value = item.inputPathStorage;
        }else{
            INPUT_PATH.value = '';
        }
    });
}

function getCheckboxNewTab() {
    chrome.storage.sync.get("checkboxNewtabStorage", function (item) {
        if (item.checkboxNewtabStorage) {
            CHECKBOX_NEWTAB.value = item.checkboxNewtabStorage;
        }else{
            CHECKBOX_NEWTAB.value = '0';
        }
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
chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'go-to-the-path':
            BUTTON_GO.click();
            break;
        case 'new-tab':
            if (CHECKBOX_NEWTAB.value < 2) {
                CHECKBOX_NEWTAB.value++;
            } else {
                CHECKBOX_NEWTAB.value = 0;
            }
            updateRangeNewTab();
            break;
        case 'tabgroup':
            CHECKBOX_TABGROUP.click();
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

CHECKBOX_NEWTAB.addEventListener("click", updateRangeNewTab);

function updateRangeNewTab(isLoading) {
    chrome.storage.sync.set({"checkboxNewtabStorage": CHECKBOX_NEWTAB.value });
    chrome.storage.local.get(function(result){console.log(result)})

    if (CHECKBOX_NEWTAB.value == 0) {
        CHECKBOX_NEWTAB.classList.remove('range-thumb-center', 'range-thumb-right', 'no-transition');
        CHECKBOX_NEWTAB.classList.add('range-thumb-left');
    }else if (CHECKBOX_NEWTAB.value == 1) {
        CHECKBOX_NEWTAB.classList.remove('range-thumb-left', 'range-thumb-right', 'no-transition');
        CHECKBOX_NEWTAB.classList.add('range-thumb-center');
        if (isLoading == true) CHECKBOX_NEWTAB.classList.add('no-transition');
    } else {
        CHECKBOX_NEWTAB.classList.remove('range-thumb-left', 'range-thumb-center', 'no-transition');
        CHECKBOX_NEWTAB.classList.add('range-thumb-right');
        if (isLoading == true) CHECKBOX_NEWTAB.classList.add('no-transition');
    }
};