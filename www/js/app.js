// Global jQuery references
var $document;
var $body;
var $section;
var $intro;
var $vr;
var $conclusion;
var $begin;
var $ambiPlayer;
var $audioPlayer;
var $playerWrapper;
var $scenes;
var $canvas;
var $play;
var $pause;
var $returnButtons;
var $sceneClose;
var $fullscreen;

var NO_AUDIO = (window.location.search.indexOf('noaudio') >= 0);
var ASSETS_SLUG = APP_CONFIG.DEPLOYMENT_TARGET !== 'production' ? 'http://stage-apps.npr.org/' + APP_CONFIG.PROJECT_SLUG + '/assets/' : 'assets/'
var currentScene;

/*
 * Run on page load.
 */
var onDocumentLoad = function(e) {
    // Cache jQuery references
    $document = $('document');
    $body = $('body');
    $section = $('.section');
    $intro = $('.intro');
    $vr = $('.vr');
    $conclusion = $('.conclusion');
    $begin = $('.begin');
    $ambiPlayer = $('.ambi-player');
    $audioPlayer = $('#audio-player');
    $playerWrapper = $('.player-wrapper');
    $scenes = $('a-entity.scene');
    $play = $('.play');
    $pause = $('.pause');
    $returnButtons = $('.scene-buttons button')
    $sceneClose = $('.scene-close');
    $fullscreen = $('.fullscreen');

    $begin.on('click', onBeginClick);
    $play.on('click', resumeAudio);
    $pause.on('click', pauseAudio);
    $returnButtons.on('click', onReturnButtonClick);
    $sceneClose.on('click', onSceneCloseClick);
    $fullscreen.on('click', onFullscreenButtonClick)

    $section.css({
        'opacity': 1,
        'visibility': 'visible'
    });

    setupAudioPlayers();
}

var setupAudioPlayers = function() {
    $audioPlayer.jPlayer({
        loop: false,
        supplied: 'mp3',
        timeupdate: onTimeupdate,
        volume: NO_AUDIO ? 0 : 0.001
    });

    $ambiPlayer.jPlayer({
        loop: true,
        supplied: 'mp3',
        volume: NO_AUDIO ? 0 : 1,
        cssSelectorAncestor: null
    })
}

var playAudio = function($player, audioURL) {
    $player.jPlayer('setMedia', {
        mp3: audioURL
    }).jPlayer('play');
    $play.hide();
    $pause.show();
}

var pauseAudio = function() {
    $audioPlayer.jPlayer('pause');
    $pause.hide();
    $play.show();
}

var resumeAudio = function() {
    $audioPlayer.jPlayer('play');
    $play.hide();
    $pause.show();
}

var onTimeupdate = function(e) {
    var duration = e.jPlayer.status.duration;
    var position = e.jPlayer.status.currentTime;

    for (var i = 0; i < COPY['vr'].length; i++) {
        var thisRow = COPY['vr'][i];
        if (position < thisRow['end_time'] && position > 0) {
            if (thisRow['id'] === currentScene) {
                break;
            } else {
                currentScene = thisRow['id'];
                $canvas.velocity('fadeOut', {
                    duration: 1000,
                    complete: showCurrentScene
                });
                break;
            }
        } else if (position > 120) {
            exitFullscreen();
            $vr.hide();
            $fullscreen.hide();
            $conclusion.show();
            $audioPlayer.jPlayer('stop');
            $ambiPlayer.jPlayer('stop');
        }
    }
}

var showCurrentScene = function() {
    $scenes.find('.sky').attr('visible', 'false');
    $('#' + currentScene).find('.sky').attr('visible', 'true');

    var ambiAudio = ASSETS_SLUG + $('#' + currentScene).data('ambi');
    playAudio($ambiPlayer, ambiAudio);

    $canvas.velocity('fadeIn', {
        duration: 1000,
        complete: function() {
            document.querySelector('#' + currentScene + ' .sky').emit('enter-scene');
        }
    });
}

var requestFullscreen = function() {
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
    }
}

var exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

var onBeginClick = function() {
    $section.hide();
    $fullscreen.show();
    currentScene = $scenes.eq(0).attr('id');
    $canvas = $('canvas.a-canvas');

    showCurrentScene();
    document.querySelector('#' + currentScene + ' .sky').emit('enter-scene');

    playAudio($audioPlayer, ASSETS_SLUG + 'geology-rough-713.mp3');

}

var onReturnButtonClick = function(e) {
    var $this = $(this);
    currentScene = $this.data('scene');
    showCurrentScene();
    $conclusion.hide();
    $playerWrapper.hide();
    $vr.show();
    $fullscreen.show();
    $sceneClose.show();
}

var onSceneCloseClick = function() {
    $vr.hide();
    $fullscreen.hide();
    $conclusion.show();
    $ambiPlayer.jPlayer('stop');
}

var onFullscreenButtonClick = function() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        exitFullscreen();
    } else {
        requestFullscreen();
    }
}

$(onDocumentLoad);
