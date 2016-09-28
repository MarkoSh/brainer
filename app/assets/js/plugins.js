/**
 * Created by mark on 26/06/16.
 */

Number.prototype.pad = function (w, r, z) {
    z = z || '0';
    r = r || 10;
    var n = parseInt(this).toString(r) + '';
    return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;
};
Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};
Number.prototype.toMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ':' + seconds;
};

(function ($) {
    $.fn.redraw = function () {
        return $(this).hide().each(function () {
            var redraw = this.offsetHeight;
        }).show();
    };
    $.fn.isOnScreen = function () {
        var element = this.get(0);
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
    };
    $.fn.doorCloser = function () {
    };
    $.isMobile = function () {
        try {
            document.createEvent("TouchEvent");
            return true;
        }
        catch (e) {
            return false;
        }
    };
})(jQuery);