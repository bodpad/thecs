"use strict";
var triptych = new Vue({
    el: '#triptych',
    data: {
        leftHidden: JSON.parse(localStorage.getItem('triptych') || '{}').leftHidden,
        centerHidden: JSON.parse(localStorage.getItem('triptych') || '{}').centerHidden,
        rightHidden: JSON.parse(localStorage.getItem('triptych') || '{}').rightHidden,
    },
    created: function () {
        if (this.leftHidden)
            this.hideLeft(false);
        if (this.centerHidden)
            this.hideCenter(false);
        if (this.rightHidden)
            this.hideRight(false);
    },
    methods: {
        hideLeft: function (saveState = true) {
            if (saveState) {
                this.leftHidden = !this.leftHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.leftHidden = this.leftHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(1)');
            if (this.leftHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideCenter: function (saveState = true) {
            if (saveState) {
                this.centerHidden = !this.centerHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.centerHidden = this.centerHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(2)');
            if (this.centerHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        },
        hideRight: function (saveState = true) {
            if (saveState) {
                this.rightHidden = !this.rightHidden;
                const ls = JSON.parse(localStorage.getItem('triptych') || '{}');
                ls.rightHidden = this.rightHidden;
                localStorage.setItem('triptych', JSON.stringify(ls));
            }
            const el = document.querySelector('.triptych > *:nth-child(3)');
            if (this.rightHidden) {
                el.style.width = '0';
                el.style.maxWidth = '0';
            }
            else {
                el.style.width = null;
                el.style.maxWidth = null;
            }
        }
    }
});

/**
 * Change all active tabs on selected snippet language
 * @type {*|jQuery}
 */
$('input[type="radio"]').on('change', function (event) {
    if (!event.target.id.startsWith('__tabbed')) return;
    var label = event.target.nextElementSibling; // HTMLLabelElement
    $('label').each(function(i, el){
        if (label === el) return;
        if (!el.htmlFor.startsWith('__tabbed')) return;
        if (el.innerText !== label.innerText) return;
        $(el).prev().prop("checked", true);
    });
});


/**
 *
 * @type {*|jQuery}
 */
var headerHeight = $('.navbar').outerHeight();
var $articleHeader = $('#article-header');
var $implementationContainer = $('.implementation-container');
var $playgroundContainer = $('.playground-container');
var $jumper = $('.jumper');


$(window).on('scroll', function() {
    var windowScrollTop = $(this).scrollTop();

    if ($implementationContainer.length || $playgroundContainer.length) {
        var offset = (headerHeight - windowScrollTop) > 0 ? headerHeight - windowScrollTop : 0;
        var height = $(this).height() - $articleHeader.outerHeight() - 16 - offset;
        if ($implementationContainer.length) $implementationContainer.height(height);
        if ($playgroundContainer.length) $playgroundContainer.height(height);
    }

}).trigger('scroll');

var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
        $articleHeader.removeClass('article-header_sticky');
        $jumper.css({
            'width': '',
            'opacity': ''
        });
    } else {
        $articleHeader.addClass('article-header_sticky');
        $jumper.css({
            'width': $jumper.get(0).scrollWidth + 'px',
            'opacity': '1'
        });
    }
}, {
    threshold: 1.0,
});
observer.observe($articleHeader.get(0));

/**
 *
 */
if ($('.star-ratings').length) {
    window.addEventListener("rate-success", function (e) {
        // console.log(e.detail);
    }, false);
}