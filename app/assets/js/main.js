/**
 * Created by mark on 19/06/16.
 */
(function ($) {
    'use strict';
    var wow = new WOW();
    wow.init();
    $(document).dblclick(function () {
        $(document).fullScreen(true);
    });
    $(".next").click(function () {
        var section = $(this).parent();
        $(window).scrollTo(section.next(), {
            axis: "y",
            duration: 500,
            easing: "easeInOutQuint"
        });
    });
    var fa_icons;
    $(".gamemenu li .gamemenu li").click(function (e) {
        fa_icons = shuffle((function () {
            var res = [];
            for (var i = 59392; i <= 59662; i++) {
                res.push('&#x' + Number(i).pad(3, 16) + ';');
            }
            return res
        })());
        var size = $(this).index(),
            level = $(this).parent().parent().index(),
            game = $(this).parent().parent().parent().data('game'),
            section = $(this).parent().parent().parent().parent().parent();

        // if ($.isMobile()) {
        //     section
        //         .append($("#informer"))
        //         .append($("#cboxOverlay"))
        //         .append($("#colorbox"))
        //         .bind("fullscreenchange", function () {
        //             if ($(window).height() > 568)
        //                 section.height($(window).height());
        //         })
        //         .fullScreen(true);
        // }

        if ($(window).width() < 1024)
            $(this).parent().parent().parent().animate({
                left: "-98%"
            }, 300);
        clearInterval(timer.timer);
        clearInterval(timer.timer_);
        $("#scores, #errors").text(0).data('val', 0).css({
            color: "inherit"
        });
        switch (game) {
            case 'pairs':
                return pairs(level, size);
                break;
            case 'chains':
                return chains(level, size);
                break;
            case 'maths':
                return maths(level, size, e);
                break;
        }
    });
    $("#totop").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1000, "easeInOutQuint");
    });
    $(document).scroll(function () {
        if ($(document).scrollTop() > 300)
            $("#totop").fadeIn();
        else
            $("#totop").fadeOut();
    });
    if ($(window).width() < 1024) {
        $("section")
            .hammer()
            .on("swiperight", function () {
                var $this = $(this);
                $this.find(".gamemenu").first().animate({
                    left: 0
                }, 300);
            })
            .on("swipeleft", function () {
                var $this = $(this);
                $this.find(".gamemenu").first().animate({
                    left: "-99%"
                }, 300);
            });
    }
    $("#informer").click(function () {
        $.colorbox({
            initialWidth: "95%",
            width: "95%",
            initialHeight: "10%",
            height: ($(window).width() < 1100 ? "95%" : "80%"),
            maxHeight: 900,
            open: true,
            closeButton: false,
            fixed: true,
            inline: true,
            href: "#stats",
            onCleanup: function () {
                $(window).unbind("scroll");
            },
            onComplete: function () {
                if ($(window).width() < 1100) {
                    $("#colorbox").hammer().on("swipeleft", function () {
                        $("#colorbox").animate({
                            left: "-100%"
                        }, 100, function () {
                            $.colorbox.close();
                        });
                    });
                }
                var pos = $(window).scrollTop();
                $(window).scroll(function () {
                    $(window).scrollTop(pos);
                });
                $("#stats").empty().append('<div id="gamesrate" class="statcontainer">');
                var chart = [new CanvasJS.Chart("gamesrate",
                    {
                        theme: "theme2",
                        toolTip: {
                            fontSize: 12,
                            fontFamily: "'Cairo', sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            borderThickness: 1,
                            cornerRadius: 0
                        },
                        title: {
                            text: "How much is the game",
                            fontSize: 32,
                            fontFamily: "'Cairo', sans-serif",
                            fontWeight: 200,
                            horizontalAlign: "left"

                        },
                        axisY: {
                            labelFontSize: 12,
                            labelFontFamily: "'Cairo', sans-serif",
                            labelFontWeight: 400
                        },
                        zoomEnabled: true,
                        exportFileName: "games_" + getdate(),
                        exportEnabled: true,
                        animationEnabled: true,
                        legend: {
                            verticalAlign: "bottom",
                            horizontalAlign: "center",
                            fontSize: 10,
                            fontFamily: "'Cairo', sans-serif",
                            fontWeight: 400
                        },
                        data: [
                            {
                                type: "pie",
                                showInLegend: true,
                                toolTipContent: "{legendText}: <strong>{y}</strong>",
                                indexLabel: "{label}: {y}",
                                indexLabelFontSize: 16,
                                indexLabelFontFamily: "'Cairo', sans-serif",
                                indexLabelFontWeight: 400,
                                dataPoints: (function () {
                                    var data = [];
                                    $.each(storage.get("game"), function (i, e) {
                                        var counter = 0;
                                        i = capitalize(i);
                                        $.each(e, function (i_, e_) {
                                            $.each(e_, function (i__, e__) {
                                                $.each(e__, function (i___, e___) {
                                                    counter++
                                                });
                                            });
                                        });
                                        data.push({
                                            y: counter,
                                            legendText: i,
                                            label: i
                                        });
                                    });

                                    return data;
                                })()
                            }
                        ]
                    })];
                $.each(storage.get("game"), function (i, e) {
                    var id = i + 'stats';
                    $("#stats").append('<div id="' + id + '" class="statcontainer">');
                    chart.push(new CanvasJS.Chart(id,
                        {
                            theme: "theme2",
                            toolTip: {
                                fontSize: 12,
                                fontFamily: "'Cairo', sans-serif",
                                fontWeight: 400,
                                fontStyle: "normal",
                                borderThickness: 1,
                                cornerRadius: 0
                            },
                            title: {
                                text: capitalize(i),
                                fontSize: 32,
                                fontFamily: "'Cairo', sans-serif",
                                fontWeight: 200,
                                horizontalAlign: "left"
                            },
                            axisX: {
                                valueFormatString: "DD-MM-YYYY",
                                labelFontSize: 12,
                                labelFontFamily: "'Cairo', sans-serif",
                                labelFontWeight: 200
                            },
                            axisY: {
                                title: "Scores/Errors",
                                titleFontSize: 16,
                                titleFontFamily: "'Cairo', sans-serif",
                                titleFontWeight: 400,
                                labelFontSize: 12,
                                labelFontFamily: "'Cairo', sans-serif",
                                labelFontWeight: 400

                            },
                            axisY2: {
                                title: "Time",
                                titleFontSize: 16,
                                titleFontFamily: "'Cairo', sans-serif",
                                titleFontWeight: 400,
                                labelFontSize: 12,
                                labelFontFamily: "'Cairo', sans-serif",
                                labelFontWeight: 400,
                                labelFormatter: function (e) {
                                    return e.value.toMMSS();
                                },
                                labelAngle: -30
                            },
                            zoomEnabled: true,
                            exportFileName: i + "_stats_" + getdate(),
                            exportEnabled: true,
                            animationEnabled: true,
                            legend: {
                                verticalAlign: "bottom",
                                horizontalAlign: "center",
                                fontSize: 10,
                                fontFamily: "'Cairo', sans-serif",
                                fontWeight: 400
                            },
                            data: (function () {
                                var data = [];
                                $.each(e, function (i_, e_) {
                                    $.each(e_, function (i__, e__) {
                                        var line = {
                                            type: "line",
                                            showInLegend: true,
                                            toolTipContent: "{legendText}: <strong>{y}</strong>",
                                            xValueType: "dateTime"
                                        };
                                        line['legendText'] = "ERRORS - Level: " + i_ + ", size: " + i__;
                                        line['dataPoints'] = (function () {
                                            var data_ = [];
                                            $.each(e__, function (i___, e___) {
                                                data_.push({
                                                    x: parseInt(i___),
                                                    y: e___.errors
                                                });
                                            });
                                            return data_;
                                        })();
                                        data.push(Object.assign({}, line));

                                        line['legendText'] = "SCORES - Level: " + i_ + ", size: " + i__;
                                        line['dataPoints'] = (function () {
                                            var data_ = [];
                                            $.each(e__, function (i___, e___) {
                                                data_.push({
                                                    x: parseInt(i___),
                                                    y: e___.scores
                                                });
                                            });
                                            return data_;
                                        })();
                                        data.push(Object.assign({}, line));

                                        line['legendText'] = "SECONDS - Level: " + i_ + ", size: " + i__;
                                        line['axisYType'] = "secondary";
                                        line['toolTipContent'] = "{legendText}: <strong>{label}</strong>";
                                        line['dataPoints'] = (function () {
                                            var data_ = [];
                                            $.each(e__, function (i___, e___) {
                                                data_.push({
                                                    x: parseInt(i___),
                                                    y: e___.time,
                                                    label: e___.time.toMMSS()
                                                });
                                            });
                                            return data_;
                                        })();
                                        data.push(Object.assign({}, line));
                                    });
                                });

                                return data;
                            })()
                        }));
                });
                $(chart).each(function (i, e) {
                    e.render();
                    $(".statcontainer").animate({
                        opacity: 1
                    }, 1000);
                });
            }
        });
    });
    var pairs = function (ilevel, isize) {
            var level = [12000, 10000, 8000, 6000, 2000][ilevel],
                maxerrors = [5, 8, 10, 15, 20][isize],
                size = [4, 6, 8, 10, 12][isize],
                field = $("#pairs").find(".field"),
                icons = [];

            timer.seconds = 0;
            timer.seconds_ = level / 1000;
            $("#start")
                .text(timer.seconds_.toHHMMSS())
                .css({
                    color: timer.seconds_ > 8 ? "green" : timer.seconds_ > 5 ? "yellow" : "red"
                });
            timer.timer = setInterval(function () {
                timer.seconds++;
                $("#timer")
                    .text(timer.seconds.toHHMMSS());
            }, 1000);
            timer.timer_ = setInterval(function () {
                timer.seconds_--;
                $("#start")
                    .css({
                        color: timer.seconds_ > 8 ? "green" : timer.seconds_ > 5 ? "yellow" : "red"
                    });
                $("#start")
                    .text(timer.seconds_.toHHMMSS());
            }, 1000);

            field.empty();
            for (var i = 0; i < Math.pow(size, 2) / 2; i++) {
                icons.push(fa_icons[i]);
            }
            icons = icons.concat(icons);
            icons = shuffle(icons);

            for (var i = 0, c = 0; i < Math.pow(size, 2) / size; i++) {
                field.append('<div class="row slideInDown" data-wow-delay="' + (i / 30) + 's">');
                for (var j = 0; j < size; j++, c++) {
                    field
                        .find(".row:last-child")
                        .addClass('wow')
                        .append('<div class="cell start"><div class="iwrap"><i class="icon-b" aria-hidden="true">' + icons[c])
                        .find(".cell:last-child")
                        .attr('icon', icons[c])
                        .data({
                            val: icons[c],
                            ctrl: c
                        });
                }
            }
            field
                .find(".cell")
                .find(".iwrap")
                .find("i")
                .animate({
                    opacity: 0
                }, level, "easeInCirc", function (e) {
                    clearInterval(timer.timer_);
                    var cell = $(this).parent().parent();
                    cell.click(function (e) {
                        var cell = $(this);
                        cell
                            .find(".iwrap")
                            .find("i")
                            .animate({
                                opacity: 1
                            });
                        if (!current) {
                            current = cell;
                            return false;
                        }
                        else if (current.data('ctrl') != cell.data('ctrl')) {
                            if (current.data('val') != cell.data('val')) {
                                current
                                    .find(".iwrap")
                                    .find("i")
                                    .animate({
                                        opacity: 0
                                    });
                                cell
                                    .find(".iwrap")
                                    .find("i")
                                    .animate({
                                        opacity: 0
                                    });
                                $("#errors")
                                    .data('val', ($("#errors").data('val') + 1))
                                    .text($("#errors").data('val'));
                                $("#scores")
                                    .data('val', ($("#scores").data('val') - 5))
                                    .text($("#scores").data('val'));
                            }
                            else if (current.data('val') == cell.data('val')) {
                                current.removeClass('start').unbind().find('.iwrap').css({
                                    background: "rgba(74, 197, 189, 0.4)"
                                });
                                cell.removeClass('start').unbind().find('.iwrap').css({
                                    background: "rgba(74, 197, 189, 0.4)"
                                });
                                $("#scores")
                                    .data('val', ($("#scores").data('val') + 10))
                                    .text($("#scores").data('val'));
                                if (!field.find(".cell.start").length) {
                                    clearInterval(timer.timer);
                                    storage.set('game.pairs.' + ilevel + '.' + isize + '.' + Date.now(), {
                                        scores: $("#scores").data('val'),
                                        errors: $("#errors").data('val'),
                                        time: timer.seconds
                                    });
                                }
                            }
                        }
                        current = 0;
                        if (maxerrors - $("#errors").data('val') < 3) {
                            $("#errors").css({
                                color: "yellow"
                            });
                        }
                        if (maxerrors - $("#errors").data('val') < 2) {
                            $("#errors").css({
                                color: "red"
                            });
                        }
                        if (maxerrors <= $("#errors").data('val')) {
                            clearInterval(timer.timer);
                            $("#errors").css({
                                color: "red"
                            });
                            field
                                .find(".cell")
                                .unbind()
                                .find(".iwrap")
                                .find("i")
                                .stop()
                                .animate({
                                    opacity: 1
                                });
                        }
                    })
                        .find(".iwrap")
                        .css({
                            background: "rgba(74, 75, 197, 0.4)"
                        });
                });
            return false
        },
        chains = function (ilevel, isize) {
            var level = [12000, 10000, 8000, 6000, 2000][ilevel],
                size = [4, 6, 8, 10, 12][isize],
                maxerrors = [5, 8, 10, 15, 20][isize],
                field = $("#chains").find(".field"),
                icons = [],
                flag = 0;

            timer.seconds = 0;
            timer.seconds_ = level / 1000;
            $("#start")
                .text(timer.seconds_.toHHMMSS())
                .css({
                    color: timer.seconds_ > 8 ? "green" : timer.seconds_ > 5 ? "yellow" : "red"
                });
            timer.timer = setInterval(function () {
                timer.seconds++;
                $("#timer")
                    .text(timer.seconds.toHHMMSS());
            }, 1000);
            timer.timer_ = setInterval(function () {
                timer.seconds_--;
                $("#start")
                    .css({
                        color: timer.seconds_ > 8 ? "green" : timer.seconds_ > 5 ? "yellow" : "red"
                    });
                $("#start")
                    .text(timer.seconds_.toHHMMSS());
            }, 1000);

            field.empty();
            for (var i = 0; i < size * 3; i++) {
                icons.push(fa_icons[i]);
            }
            icons = shuffle(icons);
            field
                .append('<div id="remember">')
                .append('<div id="answers">');
            var remember = $("#remember"),
                rememberRow = null,
                answers = $("#answers");
            remember.append('<div class="row">');
            rememberRow = remember.find(".row");
            for (var i = 0; i < size; i++) {
                rememberRow
                    .append('<div class="cell start wow slideInDown" data-wow-delay="' + (i / 10) + 's"><div class="iwrap"><i class="icon-b" aria-hidden="true">' + icons[i])
                    .find(".cell:last-child").data({
                    val: icons[i]
                });
            }
            icons = shuffle(icons);
            answers.animate({
                opacity: 1
            }, level, function () {
                clearInterval(timer.timer_);
                var direction = "right";
                for (var i = 0, c = 0; i < 3; i++) {
                    answers.append('<div class="row">');
                    for (var j = 0; j < size; j++, c++) {
                        answers.find(".row:last-child")
                            .append('<div class="cell wow slideInUp" data-wow-delay="' + (c / 20) + 's"><div class="iwrap"><i class="icon-b" aria-hidden="true">' + icons[c])
                            .find(".cell:last-child").data({
                            val: icons[c]
                        });
                    }
                }
                var currentCell = rememberRow
                    .find(".cell:first-child").addClass('me');
                rememberRow
                    .find(".cell")
                    .find(".iwrap")
                    .find("i")
                    .animate({
                        opacity: 0
                    }, 100, "easeOutCubic");
                answers
                    .find(".cell")
                    .click(function (e) {
                        var $this = $(this);
                        if (currentCell.data('val') == $this.data('val')) {
                            $("#scores")
                                .data('val', ($("#scores").data('val') + 10))
                                .text($("#scores").data('val'));
                            currentCell
                                .removeClass("me")
                                .find(".iwrap")
                                .find("i")
                                .animate({
                                    opacity: 1
                                }, function () {
                                    if (direction == "right") {
                                        if (currentCell.next().length) {
                                            currentCell = currentCell
                                                .next()
                                                .addClass("me");
                                        }
                                        else {
                                            direction = "left";
                                            rememberRow
                                                .find(".cell")
                                                .find(".iwrap")
                                                .find("i")
                                                .animate({
                                                    opacity: 0
                                                }, 100, "easeOutCubic", function () {
                                                    currentCell.addClass("me");
                                                });
                                        }
                                    }
                                    else if (direction == "left") {
                                        if (currentCell.prev().length) {
                                            currentCell = currentCell
                                                .prev()
                                                .addClass("me");
                                        }
                                        else {
                                            direction = "up";
                                            currentCell.removeClass("me");
                                            var flag = 0;
                                            rememberRow
                                                .find(".cell")
                                                .find(".iwrap")
                                                .find("i")
                                                .animate({
                                                    opacity: 0
                                                }, 100, "easeOutCubic", function () {
                                                    var to = setTimeout(function () {
                                                        if (!flag) {
                                                            var cells = shuffle(rememberRow
                                                                .find(".cell"));
                                                            currentCell = $(cells[0]).addClass("me");
                                                            flag = 1;
                                                        }
                                                    }, 2000);
                                                });
                                        }
                                    }
                                    else if (direction == "up") {
                                        answers
                                            .find(".cell")
                                            .unbind()
                                            .find('.iwrap')
                                            .css({
                                                background: "rgba(74, 197, 189, 0.4)"
                                            });
                                        rememberRow
                                            .find(".cell")
                                            .find(".iwrap")
                                            .find("i")
                                            .animate({
                                                opacity: 1
                                            }, 100, "easeInCirc");
                                        clearInterval(timer.timer);
                                        storage.set('game.chains.' + ilevel + '.' + isize + '.' + Date.now(), {
                                            scores: $("#scores").data('val'),
                                            errors: $("#errors").data('val'),
                                            time: timer.seconds
                                        });
                                    }
                                });
                        }
                        else {
                            $("#errors")
                                .data('val', ($("#errors").data('val') + 1))
                                .text($("#errors").data('val'));
                            $("#scores")
                                .data('val', ($("#scores").data('val') - 5))
                                .text($("#scores").data('val'));
                        }
                    })
            });
            return false;
        },
        maths = function (ilevel, isize, e) {
            var imode = $(e.target).find('.gamemenu').length ? 0 : $(e.target).index();
            var level = [15 * 60, 10 * 60, 8 * 60, 6 * 60, 5 * 60][ilevel],
                size = [[50, 80, 110, 130, 600][ilevel],
                    [60, 90, 120, 140, 700][ilevel],
                    [70, 100, 130, 150, 800][ilevel],
                    [80, 110, 140, 160, 900][ilevel],
                    [100, 130, 160, 180, 1000][ilevel]][isize],
                mode = ['+', '-', '*', '/', ['+', '-', '*', '/'][rand(0, 4)]][imode],
                field = $("#maths").find(".field");
            timer.seconds = level;
            timer.timer = setInterval(function () {
                timer.seconds--;
                $("#timer")
                    .text(timer.seconds.toHHMMSS());
            }, 1000);

            field.html('<div id="math">');
            field.append('<div id="answers">');
            var math = $("#math"),
                answers = $("#answers");
            math
                .html('<div class="row">')
                .find('.row')
                .html('<div class="cell wow slideInUp" data-wow-delay="' + (0 / 20) + 's"><div class="iwrap"><i class="icon-b math" aria-hidden="true">' + rand(10, 50))
                .append('<div class="cell wow slideInUp" data-wow-delay="' + (1 / 20) + 's"><div class="iwrap"><i class="icon-b math" aria-hidden="true">' + mode)
                .append('<div class="cell wow slideInUp" data-wow-delay="' + (2 / 20) + 's"><div class="iwrap"><i class="icon-b math" aria-hidden="true">' + rand(10, 50))
                .append('<div class="cell wow slideInUp" data-wow-delay="' + (3 / 20) + 's"><div class="iwrap"><i class="icon-b math" aria-hidden="true">=')
                .append('<div class="cell wow slideInUp" data-wow-delay="' + (4 / 20) + 's"><div class="iwrap"><input type="text" class="icon-b math" aria-hidden="true">');
            answers
                .html('<div class="row">');
            answers.animate({
                opacity: 1
            }, 1000, "easeInQuint", function () {
                for (var i = 0; i < 5; i++) {
                    answers
                        .find('.row')
                        .append('<div class="cell wow slideInUp" data-wow-delay="' + (i / 20) + 's"><div class="iwrap"><i class="icon-b math" aria-hidden="true">' + rand(10, 50));
                }
            });
        },
        schulte = function (ilevel, isize) {
        },
        seconds = function (ilevel, isize) {
        },
        bubbles = function (ilevel, isize) {
        },
        digits = function (ilevel, isize) {
        },
        reads = function (ilevel, isize) {
        },
        rand = function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        },
        getdate = function () {
            var d = new Date();
            var curr_date = d.getDate(),
                curr_month = d.getMonth(),
                curr_year = d.getFullYear();
            curr_month++;
            curr_month = curr_month < 10 ? '0' + curr_month : curr_month;

            return curr_date + '-' + curr_month + '-' + curr_year;
        },
        timer = {
            timer: 0,
            seconds: 0,
            timer_: 0,
            seconds_: 0
        },
        current = 0,
        storage = $.localStorage,
        capitalize = function (inStr) {
            return inStr.replace(/\w\S*/g, function (tStr) {
                return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase();
            });
        };
})(jQuery);

