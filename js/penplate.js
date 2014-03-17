/**
 * jQuery File: 	penplate.js
 * Type:			plugin
 * Author:        	Chris Humboldt
 * Last Edited:   	17 March 2014
 */


// Plugin
(function($){

	var $penplate							= function()
	{	
		// ------------------------------------------------ Setup
		var $object 						= this;
		

		// ------------------------------------------------ Settings
		$object.settings 					= {};
		

		// ------------------------------------------------ Initialize
		$object.init 						= function($element, settings)
		{	
			// Check if the settings are being edited via the call
			$object.settings 				= $.extend($object.settings, settings);

			// Some variables
			$this_penplate					= $element;

			// Setup
			$this_penplate.attr({ 'contenteditable' : 'true' });

			// Penplate functions
			$object.bold_selection();
		}
		

		// ------------------------------------------------ Functions
		$object.bold_selection 				= function()
		{
			$('.pen-bold').on('click', function()
			{
				document.execCommand('bold');
			});
		}
	};
	
	// Call the plugin
	$.fn.penplate							= function($options)
	{	
		var len 							= this.length;

		return this.each(function(index)
		{	
			var me 							= $(this), key = 'penplate' + (len > 1 ? '-' + ++index : ''), instance = (new $penplate).init(me, $options);
			me.data(key, instance).data('key', key);
		});
	};
	
}(jQuery));