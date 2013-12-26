$(function ($) {

	var Stalker = function (config) {
		if (!(this instanceof Stalker)) {
			return new Stalker(config);
		}
		this.defaults = (function (that) {
			var defaultStalkerClass = 'main_cta';
			return {
				$stalkerElement: $('#' + defaultStalkerClass),
				fixed: false
			};
		}(this));
		this.init();
	};

	Stalker.prototype = {
		init: function () {
			this.bindEvents();
			this.offset = this.defaults.$stalkerElement.offset();
		},
		bindEvents: function () {
			var that = this;
			$(window).scroll(function(event){
				if ($(this).scrollTop() >= that.offset.top && !that.defaults.fixed) {
					that.defaults.$stalkerElement.addClass('fixed');
					that.defaults.fixed = true;
				} else if ($(this).scrollTop() < that.offset.top && that.defaults.fixed) {
					that.defaults.fixed = false;
					that.defaults.$stalkerElement.removeClass('fixed');
				}
			});
		}
	};

	Nutrisystem_JS.register('Stalker', Stalker);
	
}(jquery191));