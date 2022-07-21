// Like an e.preventDefault() for the "Go!" button.
const redirectActive = true;
// ------------------------------------------------

const buttonGo = document.getElementById('button-go');
const inputPath = document.getElementById('input-path');
const inputTargetLink = document.getElementById('input-target-link');
const errorArea = document.getElementById('errorArea');

window.addEventListener("load", function () {
    saveInputPath();
    saveinputTargetLink();
});

buttonGo.addEventListener('click', () => {

    if (inputPath.value.length != 0) {
        chrome.storage.sync.set({ "inputPath": inputPath.value });
    }else{
        displayError('Please fill in the field.');
        return;
    }
    chrome.storage.sync.set({ "inputTargetLink": inputTargetLink.checked });
    saveInputPath();
    saveinputTargetLink();

    chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
        var currentUrl = new URL(tabs[0].url);
        var entireUrlToUse = currentUrl.origin + inputPath.value;

        if (redirectActive == true) {
            if (inputTargetLink.checked == true) {
                chrome.tabs.create({ url: entireUrlToUse, index: tabs[0].index });
            } else {
                chrome.tabs.update(undefined, { url: entireUrlToUse });
            }
        }
    });
}, false);

function saveInputPath() {
    chrome.storage.sync.get("inputPath", function (item) {

        console.log(item.inputPath);
        if (item.inputPath) {
            inputPath.value = item.inputPath;
        }else{
            inputPath.value = '';
        }
    });
}

function saveinputTargetLink() {
    chrome.storage.sync.get("inputTargetLink", function (item) {
        inputTargetLink.checked = item.inputTargetLink;
    });
}

function displayError(errorMsg) {
    errorArea.innerHTML = errorMsg;
    errorArea.classList.add('display');

    setTimeout(() => {
        errorArea.classList.remove('display')
    }, 2500);
}


// Raccourci "Go!"

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'go-to-the-path':
            buttonGo.click();
            break;
        case 'new-tab':
            inputTargetLink.click();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

// document.addEventListener("keydown", function (e) {
//     if ((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.altKey && e.code === "KeyE") {
//         inputTargetLink.click();
//     } else if ((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.code === "KeyE") {
//         buttonGo.click();
//     }
// });