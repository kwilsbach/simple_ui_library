$(function ($) {

	var Popup = function (config) {
		if (!(this instanceof Popup)) {
			return new Popup(config);
		}
		this.config = config;
		this.openPopups = [];

		this.defaults = (function (that) {
			var trigger_class = 'ns-popup-trigger';
			return {
				trigger_class: trigger_class,
				$popup_triggers: $('a.' + trigger_class)
			};
		}(this));

		this.init();
	};

	Popup.prototype = {
		init: function () {
			this.bindEvents();
		},
		bindEvents: function () {
			var that = this;

			$('body').on('click', '.' + this.defaults.trigger_class, function (event) {
				event.preventDefault();
				var $this = $(this),
					url = $this.attr('href');
				that.openPopup(url.substring(url.indexOf('#')), $this.attr('data-omniture-context'), event);
			});

			$('body').on('click', function (event) {
				if(!$(event.target).hasClass(that.defaults.trigger_class) &&
					!$(event.target).parents().hasClass(that.defaults.trigger_class) &&
					!$(event.target).parents().hasClass('ns-popup') &&
					!$(event.target).hasClass('ns-popup') ) {
						for (var pop = 0; pop < that.openPopups.length; i+=1) {
							that.hidePopup(that.openPopups[pop]);
						}
				}
			});
		},
		openPopup: function (id, omnitureContext, event) {
			var $popup = $(id),
				$omnitureTags = $('[data-omniture]', $popup),
				that = this;
				
			if ($popup.parent().get( 0 ).tagName !== 'BODY') {
				$popup.prependTo('body');
			}

			if ($omnitureTags.length !== 0 && omnitureContext !== undefined) {
				$omnitureTags.attr({
					'data-omniture-context': omnitureContext
				});
			}


			if (!$popup.is(':visible')) {
				this.openPopups.push($popup);
			}
			
			$popup.css({
				position: 'absolute',
				top: function () {
					var top = event.pageY - 100 + 'px';
					return top;
				},
				left: function () {
					var left;
					if (event.pageX + $popup.width() > $( window ).width()) {
						left = $( window ).width() - $popup.width() - 100 + 'px';
					} else if (event.pageX - 100 <= 0) {
						left = event.pageX + 100 + 'px';
					} else {
						left = event.pageX - 100 + 'px';
					}
					return left;
				},
				display: 'block',
				zIndex: '1000'
			})
			.find('a.close')
			.unbind()
			.on('click', function (event) {
				event.preventDefault();
				that.hidePopup($popup);
			});
		},
		hidePopup: function (popup) {
			popup.hide();
			this.removePopFromArray(popup);
		},
		removePopFromArray: function (popup) {
			this.openPopups = $.grep(this.openPopups, function (value) {
				return value != popup;
			});
		}
		
	};

	Nutrisystem_JS.register('Popup', Popup);
	
}(jquery191));