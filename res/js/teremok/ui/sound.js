/**
 * Sound element
 * @param id
 * @constructor
 */
T.UI.Sound = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);

    /**
     * Play sound
     */
    self.play = function () {
        this.getElement()[0].play();
    };
};

T.UI.Sound.prototype = Object.create(T.UI.BasicElement.prototype);