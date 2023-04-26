$(function () {
    const $inputPath = $('#input-path'),
        $btnSecondChoice = $('#input-target-link'),
        $inputDest = $('#input-target-link'),
        $inputGroup = $('#input-tabgroup'),
        $btnSubmit = $('#button-go'),
        $errorMsgArea = $('#errorArea');
    
    const $userChoices = {
        path: '',
        destination: 'win',
        group: false
    };
    const $appSettings = {
        lang: 'en',
        shortcut: {
            pathKey: '',
            destinationKey: '',
            groupKey: '',
            btnSubmitKey: ''
        }
    };

    function displayErrorMsg(msg) {
        $errorMsgArea[0].innerHTML = msg;
        $errorMsgArea.addClass('display');

        setTimeout(() => {
            $errorMsgArea.removeClass('display');
        }, 2500);
    }

    function displayRange(e) {
        let currentValue = parseInt(e.target.value);

        if (currentValue == 0) {
            $inputDest[0].className = 'range-thumb-left';

        }else if (currentValue == 1) {
            $inputDest[0].className = 'range-thumb-center';

        }else {
            $inputDest[0].className = 'range-thumb-right';
        }
    }

    function pathApplication(e) {
        if ($inputPath[0].value.length != 0) {
            chrome.storage.sync.set({ "inputPath": $inputPath.value });
        } else {
            displayErrorMsg('Please specify a path above.');
            return;
        }

        // TODO : ouvrir le chemin dans le tab ou win. + groupe.
    }

    $inputDest.on('click', displayRange);
    $btnSubmit.on('click', pathApplication);

});