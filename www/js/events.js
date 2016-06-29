var EVENTS = (function() {
    var onBeginClick = function() {
        UI.navigateToInterstitial();
    }

    var onBeginStoryClick = function() {
        AUDIO.playAudio($audioPlayer, ASSETS_SLUG + 'geology-edit616.mp3');

        if ($(this).hasClass('guided')) {
            VR.turnOnAnimations();
        } else {
            VR.turnOffAnimations();
        }

        VR.setCurrentScene(0);
        VR.changeVRScene();

        if ($(this).hasClass('vr-device')) {
            VR.enterVR();
            UI.setupVRUI();
        } else {
            UI.setupDeviceNarrativeUI();
        }

        UI.updateSceneData();
        UI.setAudioPlayerToPlaying();
        UI.setupConclusionCard();
        UI.navigateToVR();
    }

    var onZenButtonClick = function(e) {
        currentScene = $(this).data('scene');
        var ambiAudio = ASSETS_SLUG + $scene.data('ambi');
        AUDIO.playAudio($ambiPlayer, ambiAudio);
        VR.enterMomentOfZen();
        UI.setupDeviceZenUI();
    }

    var onFullscreenButtonClick = function() {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            UTILS.exitFullscreen();
        } else {
            UTILS.requestFullscreen();
        }
    }

    var onMore360Click = function() {
        UTILS.exitFullscreen();
        UI.navigateToConclusion();
        AUDIO.stopAllAudio();
        UI.toggleAudioPlayer();
    }

    var onPlayClick = function() {
        AUDIO.resumeAudio();
        UI.toggleAudioPlayer();
    }

    var onPauseClick = function() {
        AUDIO.pauseAudio();
        UI.toggleAudioPlayer();
    }

    var onMuteClick = function() {
        AUDIO.toggleAmbiAudio();
        UI.toggleMuteButton();
    }

    var onModalCloseClick = function() {
        UI.closeModal($(this));
    }

    var onLearnMoreClick = function() {
        UI.showDetailModal();
    }

    var onCursorClick = function() {
        if ($audioPlayer.data('jPlayer').status.paused) {
            AUDIO.resumeAudio();
        } else {
            AUDIO.pauseAudio();
        }
    }

    var onVREnter = function() {
        UI.setupVRUI();
        inVR = true;
    }

    var onVRExit = function() {
        var scene = UTILS.getParameterByName('scene', window.location.href);

        if (scene) {
            UI.setupDeviceZenUI();
        } else {

            if (endedAudioInVR) {
                UI.navigateToConclusion();
                $('.instructions-png')
            } else {
                UI.setupDeviceNarrativeUI();
            }
        }
        inVR = false;
    }

    var onSceneSwitch = function() {
        VR.changeVRScene();
        UI.updateSceneData();
    }

    var onTimeupdate = function(e) {
        var position = e.jPlayer.status.currentTime;
        VR.getNewVRSceneFromAudioPosition(position);
    }

    var onSeek = function(e) {
        VR.cancelAnimation();
    }

    var onEnded = function(e) {
        if (inVR) {
            VR.cancelAnimation();
            VR.navigateToEndScene();
        } else {
            UTILS.exitFullscreen();
            UI.navigateToConclusion();
        }
        AUDIO.stopAllAudio();
    }

    var onRestartStoryClick = function(e) {
        UI.navigateToInterstitial();
        UTILS.resetState();
    }

    var onModalDeviceClick = function(e) {
        UI.setupDeviceZenUI();
        var ambiAudio = ASSETS_SLUG + $scene.data('ambi');
        AUDIO.playAudio($ambiPlayer, ambiAudio);
    }

    var onModalVRClick = function(e) {
        VR.enterVR();
        UI.setupVRUI();
        var ambiAudio = ASSETS_SLUG + $scene.data('ambi');
        AUDIO.playAudio($ambiPlayer, ambiAudio);
    }


    return {
        'onBeginClick': onBeginClick,
        'onBeginStoryClick': onBeginStoryClick,
        'onZenButtonClick': onZenButtonClick,
        'onFullscreenButtonClick': onFullscreenButtonClick,
        'onMore360Click': onMore360Click,
        'onMuteClick': onMuteClick,
        'onPlayClick': onPlayClick,
        'onPauseClick': onPauseClick,
        'onModalCloseClick': onModalCloseClick,
        'onLearnMoreClick': onLearnMoreClick,
        'onCursorClick': onCursorClick,
        'onVREnter': onVREnter,
        'onVRExit': onVRExit,
        'onSceneSwitch': onSceneSwitch,
        'onTimeupdate': onTimeupdate,
        'onSeek': onSeek,
        'onEnded': onEnded,
        'onRestartStoryClick': onRestartStoryClick,
        'onModalDeviceClick': onModalDeviceClick,
        'onModalVRClick': onModalVRClick
    }
})();