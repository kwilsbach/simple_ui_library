;(function ($) {

	Nutrisystem_JS.initializedCarousels = {};

	var Carousel = function (config) {

		var that = this;
		this.config = config;
		this.carouselSelector = that.config && that.config.carousel ? that.config.carousel : '.ns-carousel';

		// if this carousel is instantiated a second time, stop second instantiation and return.
		if (Nutrisystem_JS.initializedCarousels[this.carouselSelector] !== undefined) {
			return;
		}

		if (!(this instanceof Carousel)) {
			return new Carousel(config);
		}

        this.actions = {
            fade: this.fadeToPane,
            slide: this.slideToPane,
            default: this.fadeToPane
        }

        this.wrapperMods = {
            fade: this.fadeWrapper,
            slide: this.slideWrapper,
            default: this.slideWrapper
        }

		this.settings = (function (that) {

			var $carousel = that.config && that.config.carousel ? $(that.config.carousel) : $('.ns-carousel');

			return {
				$carousel: $carousel,
				$panes: $('.pane', $carousel),
				$controls: $('.controls a', $carousel),
				speed: 1000,
				rotateSpeed: 7000,
				pause: false,
                action: 'fade'
			};
		}(this));

		this.init();
		Nutrisystem_JS.initializedCarousels[this.carouselSelector] = this;
	};

	Carousel.prototype = {
		init: function () {
			this.addPaneWrapper();
			this.bindEvents();
		},
        slideWrapper: function (wrapper) {
            var that = this;
            wrapper.css({
                left:- that.settings.$panes[0].offsetWidth,
                width: function () {
                    return that.settings.$panes.length * that.settings.$panes[0].offsetWidth + 'px';
                },
                height: function () {
                    return that.settings.$panes[0].offsetHeight + 'px';
                }
            });
            this.settings.$panes.last().prependTo($html);
        },
        fadeWrapper: function (wrapper) {
            var that = this;
            wrapper.css({
                height: function () {
                    return that.settings.$panes[0].offsetHeight + 'px';
                }
            });

            that.settings.$panes.css({
                position: 'absolute',
                left: 0,
                top:0,
                opacity: 0
            })
            .first()
            .css({
                opacity:1
            });
        },
        addPaneWrapper: function () {
			var that = this,
				$html = $('<div class="ns-pane-wrapper"></div>');

			this.settings.$panes.appendTo($html);
			$html.prependTo(this.settings.$carousel);

            this.wrapperMods[this.settings['action']].call(this, $html);

			this.settings['$panes-wrapper'] = $html;

		},
		bindEvents: function () {
			var that = this;

			this.setInterval();

			this.settings.$carousel.on('click', '.controls a', $.proxy(this.controlClicked, this));
			this.settings.$carousel.on('mouseover, mouseenter', $.proxy(this.mouseEnter, this));
			this.settings.$carousel.on('mouseout, mouseleave', $.proxy(this.mouseOut, this));
			
			// pausing the carousel if any link within a pane is clicked
			this.settings.$panes.on('click', 'a', function () {
				that.settings.pause = true;
				$.proxy(that.clearInterval, that);
			});
		},
		controlClicked: function (event) {
			event.preventDefault();
			this.restartInterval();
			var $ct = $(event.target),
				$prev = $ct.siblings('.active').prev(),
				$next = $ct.siblings('.active').next(),
				// if the target is the pane at index 0 we need to let the goToPane method know to move
				// the last pane to the front.
				dir = $('div.pane[data-carousel-pane=' + $ct.attr('rel') + ']', this.settings['$panes-wrapper']).index() === 0 ?
					'prev' : 'next';
			
			if (!$ct.hasClass('arrow')) {
				this.settings['$controls'].removeClass('active');
				this.settings['$panes'].removeClass('active');
				$ct.addClass('active');
				$('div.pane[data-carousel-pane=' + $ct.attr('rel') + ']', this.settings['$panes-wrapper']).addClass('active');
                if (this.actions[this.settings['action']] !== undefined) {
				    this.actions[this.settings['action']].call(this, $ct.attr('rel'), dir);
                } else {
                    this.actions['default'].call(this, $ct.attr('rel'), dir);
                }
			} else {
				if ($ct.hasClass('prev')) {
					if (!$prev.hasClass('arrow')) {
						$prev.click();
					} else {
						$ct.siblings('.next').prev().click();
					}
				} else {
					if (!$next.hasClass('arrow')) {
						$next.click();
					} else {
						$ct.siblings('.prev').next().click();
					}
				}
			}
			// we're still supported older IE; it doesn't recognize preventDefault()
			return false;
		},
        fadeToPane: function (rel, dir) {
            var that = this,
                activePane = $('div.pane[data-carousel-pane=' + rel + ']', this.settings['$panes-wrapper']);

            activePane.stop().animate({
                opacity: 1
                },
                that.settings['speed']
            )
            .siblings(':visible')
            .stop()
            .animate({
                    opacity: 0
                },
                that.settings['speed']
            )
        },
        slideToPane: function (rel, dir) {
			var that = this;

			this.settings['$panes-wrapper'].stop().animate({
				left: - $('div.pane[data-carousel-pane=' + rel + ']', this.settings['$panes-wrapper']).position().left
				},
				that.settings['speed'],
				function() {
					if (dir === 'next') {
						var prevPanes = $('div.pane[data-carousel-pane=' + rel + ']', this).prevAll().sort(function (a,b) {
							return $(a).index() - $(b).index();
						});
						prevPanes = prevPanes.not(":last");
						prevPanes.appendTo(this);
					} else {
						$('div.pane', that.settings['$panes-wrapper']).last().prependTo(this);
					}
					$(this).css({left:-1080});
				}
			);
		},
		autoCarousel: function () {
			$('.active', this.settings.$controls.parent()).next().click();
		},
		setInterval: function () {
			var that = this;
			that.carouselInterval = setInterval($.proxy(that.autoCarousel, that), that.settings.rotateSpeed);
		},
		clearInterval: function () {
			if (this.carouselInterval) {
				clearInterval(this.carouselInterval);
			}
		},
		restartInterval: function () {
			this.clearInterval();
			this.setInterval();
		},
		mouseEnter: function () {
			this.settings.pause = false;
			this.clearInterval();
		},
		mouseOut: function () {
			if (this.settings.pause === false) {
				this.restartInterval();
			}
		}
	};

	Nutrisystem_JS.register('Carousel', Carousel);
	
}(jquery191));