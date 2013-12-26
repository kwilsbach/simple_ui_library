$(function ($) {

	var Omniclick = function (config) {
		if (!(this instanceof Omniclick)) {
			return new Omniclick(config);
		}
		
		this.init();
	};

	Omniclick.prototype = {
		init: function () {
			this.bindEvents();
		},
		bindEvents: function () {
			var that = this;
			$('html body').on('click', '[data-omniture]', function () {
				console.log('hello')
				var $this = $(this);
				that.triggerOmniture($this.attr('data-omniture') , $this.attr('data-omniture-context'));
			});
		},
		triggerOmniture: function (omni, context) {
			if (context !== undefined) {
				omni_track(omni + ':' + context);
			} else {
				omni_track(omni);
			}
		}
	};

	Nutrisystem_JS.register('Omniclick', Omniclick);
	
}(jquery191));