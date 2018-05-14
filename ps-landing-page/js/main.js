/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
var sections = $('.section');

var delay = 0;
var delayLaunch = 1100;
var timeoutId;
var animationIsFinished = false;

function headerPosition(){
    var currentPosition = $(this).scrollTop();

    sections.removeClass('active').each(function() {
        var top = $(this).offset().top - 80,
            bottom = top + 80 + $(this).height();

        if (currentPosition >= top && currentPosition <= bottom) {
            var section = $(this).attr('id'),
                hposition = $(this).data('header-position'),
                h = $('#header');

            sections.removeClass('active');
            $(this).addClass('active');

            $('#menu li').removeClass('active');
            $('#menu li a[href=#' + section + '], #menu li a[href=' + section + ']').parent().addClass('active');

            var target = $(this.hash)

            if ( hposition != 'bottom' ) {
                console.log('top');
                h.removeClass('sticky-bottom');
            } else {
                console.log('bottom');
                h.addClass('sticky-bottom');
            }
        }
    });
}

// to top right away
if ( window.location.hash ) scroll(0,0);
// void some browsers issue
setTimeout( function() { scroll(0,0); }, 1);

function goTo(){
    var hb = $('html, body');

    $('a[href*=#]:not([href=#])').click(function(e) {
        e.preventDefault();

        var target = $(this.hash),
            el = $(this),
            curItem = $(this).parent(),
            curTime = new Date().getTime();

            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

        // check if target exists
        if ( $(target).length ) {
            // same page links

            // leaving section
            $('#menu li').removeClass('active');

            curItem.addClass('active');
            
            clearTimeout(timeoutId);

            timeoutId = setTimeout(function(){
                console.log('scroll time!');

                animationIsFinished = true;
                
                hb.stop(true, false).animate({
                    scrollTop: target.offset().top
                }, 1000, 'easeInOutExpo', function(){
                    window.location.hash = '#' + target.attr('id');
                });

            }, delay);

            return animationIsFinished;
        } else {
            // external links with hash

            var link = $(this).prop('hash');

            console.log('external link with hash - scroll to the top!');

            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(function(){
                animationIsFinished = true;

                console.log('redirect to the page');
                window.location.replace(link);

            }, delay);

            return animationIsFinished;
        }
    });

    $('a[href]:not([href*=#],[href*=tel],[href*=mailto],[href*=http])').click(function(e) {
        // Except for native functions or external links with such as: facebook, instagram, etc.
        e.preventDefault();

        var el = $(this),
            target = $(this).attr('href');

        console.log('external link without hash - scroll to the top!');

        // if menu is not open
        if ( !el.hasClass('goto') ) {
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(function(){
                animationIsFinished = true;

                console.log('redirect to the page');
                window.location.replace(target);

            }, delay);

            return animationIsFinished;
        }
    });

    // ONLY if we have anchor on the url
    if( window.location.hash ) {
        var target = window.location.hash;

        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

        if ($(target).length) {
            hb.stop(true, false).animate({
                scrollTop: $(window.location.hash).offset().top
            }, 1000, 'easeInOutExpo');
        }
    }
}

$(window).load(function() {
    headerPosition();
    goTo();
});

$(function() {
    $(window).scroll(function() {
        headerPosition();
    });
});