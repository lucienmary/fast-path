$(function () {
    const $inputUrl = $('#input-path'),
        $inputDest = $('#input-target-link'),
        $inputGroup = $('#input-tabgroup'),
        $btnSubmit = $('#button-go');
    
    const $userChoices = {
        url: '',
        destination: 'win',
        group: false
    };
    const $appSettings = {
        lang: 'en',
        shortcut: {
            urlKey: '',
            destinationKey: '',
            groupKey: '',
            btnSubmitKey: ''
        }
    };

    $inputDest.on('click', (e) => {
        let currentValue = parseInt(e.target.value);

        if (currentValue < 2) {
            currentValue++;
        } else {
            currentValue = 0;
        }

        $inputDest.val(currentValue);


    });

});

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