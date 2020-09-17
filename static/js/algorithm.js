"use strict";
if (document.getElementById('triptych')) {
    var triptych = new Vue({
        el: '#triptych',
        data: {
            isTextActive: true,
            isPlaygroundActive: true,
            isListingActive: false,
            isMobile: false,
            txtRef: document.querySelector('.text-container'),
            pgrRef: document.querySelector('.playground-container'),
            lstRef: document.querySelector('.implementation-container')
        },
        created: function () {
            const mql = window.matchMedia('(max-width: 991px)');
            this.matchMediaHandler(mql);
            mql.addListener(this.matchMediaHandler.bind(this));
        },
        methods: {
            toggleText: function (saveState = true) {
                if (this.isTextActive) return;
                this.isTextActive = true;
                this.isPlaygroundActive = false;
                this.isListingActive = false;

                this.txtRef.classList.remove('d-none');
                this.pgrRef.classList.add('d-none');
                this.lstRef.classList.add('d-none');
            },
            togglePlayground: function (saveState = true) {
                if (this.isPlaygroundActive && this.isMobile) return;

                if (this.isPlaygroundActive && !this.isMobile) {
                    this.isPlaygroundActive = false;
                    this.txtRef.classList.add('col-12');
                    this.pgrRef.classList.add('d-none');
                    return;
                }

                this.isTextActive = false;
                this.isPlaygroundActive = true;
                this.isListingActive = false;

                if (this.isMobile) {
                    this.txtRef.classList.add('d-none');
                    this.pgrRef.classList.remove('d-none');
                    this.lstRef.classList.add('d-none');
                } else {
                    this.txtRef.classList.remove('col-12');
                    this.txtRef.classList.add('col-6');
                    this.pgrRef.classList.remove('d-none');
                    this.lstRef.classList.add('d-none');
                }
            },
            toggleListing: function (saveState = true) {
                if (this.isListingActive && this.isMobile) return;

                if (this.isListingActive && !this.isMobile) {
                    this.isListingActive = false;
                    this.txtRef.classList.add('col-12');
                    this.lstRef.classList.add('d-none');
                    return;
                }

                this.isTextActive = false;
                this.isPlaygroundActive = false;
                this.isListingActive = true;

                if (this.isMobile) {
                    this.txtRef.classList.add('d-none');
                    this.pgrRef.classList.add('d-none');
                    this.lstRef.classList.remove('d-none');
                } else {
                    this.txtRef.classList.remove('col-12');
                    this.txtRef.classList.add('col-6');
                    this.pgrRef.classList.add('d-none');
                    this.lstRef.classList.remove('d-none');
                }
            },
            onSwitchToMobile: function () {
                this.isTextActive = true;
                this.isPlaygroundActive = false;
                this.isListingActive = false;

                this.txtRef.classList.remove('d-none');
                this.pgrRef.classList.add('d-none');
                this.lstRef.classList.add('d-none');

                this.txtRef.classList.remove('col-6');
                this.pgrRef.classList.remove('col-6');
                this.lstRef.classList.remove('col-6');

                this.txtRef.classList.add('col-12');
                this.pgrRef.classList.add('col-12');
                this.lstRef.classList.add('col-12');
            },
            onSwitchToDesktop: function () {
                this.isTextActive = true;
                this.isPlaygroundActive = true;
                this.isListingActive = false;

                this.txtRef.classList.remove('d-none');
                this.pgrRef.classList.remove('d-none');
                this.lstRef.classList.add('d-none');

                this.txtRef.classList.remove('col-12');
                this.pgrRef.classList.remove('col-12');
                this.lstRef.classList.remove('col-12');

                this.txtRef.classList.add('col-6');
                this.pgrRef.classList.add('col-6');
                this.lstRef.classList.add('col-6');
            },
            matchMediaHandler: function (e) {
                this.isMobile = e.matches;
                this.isMobile ? this.onSwitchToMobile() : this.onSwitchToDesktop();
            }
        }
    });
}


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
        $jumper.css({'width': '', 'opacity': ''});
        $articleHeader.removeClass('py-2').addClass('py-4')
    } else {
        $articleHeader.addClass('article-header_sticky');
        $jumper.css({'width': $jumper.get(0).scrollWidth + 'px', 'opacity': '1'});
        $articleHeader.removeClass('py-4').addClass('py-2')
    }
}, {
    threshold: 1,
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