/**
 * jQuery File: 	penplate.js
 * Type: 			execute
 * Author:        	Chris Humboldt
 * Last Edited:   	24 June 2014
 */


;(function($, window, document, undefined)
{
	// Plugin setup & settings
	var $plugin_name					= 'penplate', $defaults =
	{
	};

	// The actual plugin constructor
	function Plugin($element, $options) 
	{
		this.element 					= $element;
		this.settings 					= $.extend({}, $defaults, $options);
		this._defaults 					= $defaults;
		this._name 						= $plugin_name;

		// Initilize plugin
		this.init();
	}


	// Plugin
	// ---------------------------------------------------------------------------------------
	Plugin.prototype 					= 
	{
		init 							: function()
		{
			// Variables
			// ---------------------------------------------------------------------------------------
			var $this 					= this;
			var $settings 				= $this.settings;
			var $this_penplate 			= $($this.element);
		},
		// Public functions
		// ---------------------------------------------------------------------------------------
		add_controls 					: function()
		{
			// Create the controls template
			$ar_controls 					= 
			{
				'bold' 						: '<li><a href="#" data-pen-edit="text-bold">B</a></li>',
				'italics' 					: '<li><a href="#" data-pen-edit="text-italic">I</a></li>',
				'underline'					: '<li><a href="#" data-pen-edit="text-underline">U</a></li>',
				'heading_1'					: '<li><a href="#" data-pen-edit="format-'+ $object.settings.heading_1_tag +'">H1</a></li>',
				'heading_2'					: '<li><a href="#" data-pen-edit="format-'+ $object.settings.heading_2_tag +'">H2</a></li>',
				'quote' 					: '<li><a href="#" data-pen-edit="format-blockquote" class="img-quote">Quote</a></li>',
				'link'						: '<li><a href="#" data-pen-edit="custom-link" class="img-link">Link</a></li>',
				'image' 					: '<li><a href="#" data-pen-edit="custom-image" class="img-image">Image</a></li>'
			};
		}
	};


	// Plugin wrapper
	// ---------------------------------------------------------------------------------------
	$.fn[$plugin_name] 					= function($options)
	{
		var $plugin;

		this.each(function()
		{
			$plugin 					= $.data(this, 'plugin_' + $plugin_name);

			if(!$plugin)
			{
				$plugin 				= new Plugin(this, $options);
				$.data(this, 'plugin_' + $plugin_name, $plugin);
			}
		});

		return $plugin;
	};
})(jQuery, window, document);

