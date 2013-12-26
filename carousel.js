$(function ($) {

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


		this.defaults = (function (that) {

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
		addPaneWrapper: function () {
			var that = this,
				$html = $('<div class="ns-pane-wrapper"></div>');

			this.defaults.$panes.appendTo($html);
			$html
			.prependTo(this.defaults.$carousel)
			.css({
				width: function () {
					return that.defaults.$panes.length * that.defaults.$panes[0].offsetWidth + 'px';
				},
				height: function () {
					return that.defaults.$panes[0].offsetHeight + 'px';
				}
			});

			this.defaults.$panes.last().prependTo($html);
			$html.css({left:- that.defaults.$panes[0].offsetWidth});

			this.defaults['$panes-wrapper'] = $html;

			
		},
		bindEvents: function () {
			var that = this;

			this.setInterval();

			this.defaults.$carousel.on('click', '.controls a', $.proxy(this.controlClicked, this));
			this.defaults.$carousel.on('mouseover, mouseenter', $.proxy(this.mouseEnter, this));
			this.defaults.$carousel.on('mouseout, mouseleave', $.proxy(this.mouseOut, this));
			
			// pausing the carousel if any link within a pane is clicked
			this.defaults.$panes.on('click', 'a', function () {
				that.defaults.pause = true;
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
				dir = $('div.pane[data-carousel-pane=' + $ct.attr('rel') + ']', this.defaults['$panes-wrapper']).index() === 0 ?
					'prev' : 'next';
			
			if (!$ct.hasClass('arrow')) {
				this.defaults['$controls'].removeClass('active');
				this.defaults['$panes'].removeClass('active');
				$ct.addClass('active');
				$('div.pane[data-carousel-pane=' + $ct.attr('rel') + ']', this.defaults['$panes-wrapper']).addClass('active');
				this.goToPane($ct.attr('rel'), dir);
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
		goToPane: function (rel, dir) {
			var that = this;
			this.defaults['$panes-wrapper'].stop().animate({
				left: - $('div.pane[data-carousel-pane=' + rel + ']', this.defaults['$panes-wrapper']).position().left
				},
				that.defaults['speed'],
				function() {
					if (dir === 'next') {
						var prevPanes = $('div.pane[data-carousel-pane=' + rel + ']', this).prevAll().sort(function (a,b) {
							return $(a).index() - $(b).index();
						});
						prevPanes = prevPanes.not(":last");
						prevPanes.appendTo(this);
					} else {
						$('div.pane', that.defaults['$panes-wrapper']).last().prependTo(this);
					}
					$(this).css({left:-1080});
				}
			);
		},
		autoCarousel: function () {
			$('.active', this.defaults.$controls.parent()).next().click();
		},
		setInterval: function () {
			var that = this;
			that.carouselInterval = setInterval($.proxy(that.autoCarousel, that), that.defaults.rotateSpeed);
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
			this.defaults.pause = false;
			this.clearInterval();
		},
		mouseOut: function () {
			if (this.defaults.pause === false) {
				this.restartInterval();
			}
		}
	};

	Nutrisystem_JS.register('Carousel', Carousel);
	
}(jquery191));