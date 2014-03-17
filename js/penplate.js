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
			$this_penplate_content 			= jQuery.trim($this_penplate.html());

			// Setup
			$this_penplate.find('p:first').addClass('first-paragraph');
			if($this_penplate.find('p:first').hasClass('first-paragraph') == false)
			{
				$this_penplate.html('<p>'+ $this_penplate_content +'</p>');
			}
			$this_penplate.attr({ 'contenteditable' : 'true' });
			// document.execCommand('defaultParagraphSeparator', false, 'p');

			// Penplate functions
			$object.new_paragraph();
			$object.edit_selection();
		}
		

		// ------------------------------------------------ Functions
		// Edit current selection
		$object.edit_selection				= function()
		{
			$('.penplate-controls a').on('click', function($e)
			{
				// Prevent default link action
				$e.preventDefault();

				// Some variables
				$this 						= $(this);
				$pen_edit					= $this.data('pen-edit');
				$ex_pen_edit				= $pen_edit.split('-');
				$pen_edit_type 				= $ex_pen_edit[0];
				$pen_edit_action 			= $ex_pen_edit[1];

				// Text actions
				if($pen_edit_type == 'text')
				{
					// Appy the action
					document.execCommand($pen_edit_action);
				}
				// Format blocks
				else if($pen_edit_type == 'format')
				{
					// Get parent tag type
					$parent_tag_type 		= $object.get_parent_tag_type();
					// console.log($parent_tag_type);

					// Apply the format
					if($parent_tag_type != $pen_edit_action)
					{
						document.execCommand('formatBlock', false, $pen_edit_action);
					}
					else
					{
						document.execCommand('formatBlock', false, 'p');
					}
				}
			});
		}

		// Get parent tag type
		$object.get_parent_tag_type 		= function()
		{
			// Some variables
			$crt_selection 					= window.getSelection();

			// Return parent tag type
			return $crt_selection.anchorNode.parentElement.nodeName.toLowerCase();
		}

		// New paragraph
		$object.new_paragraph 				= function()
		{
			$this_penplate.on('keypress', function($e)
			{
			    if($e.keyCode == '13')
			    {
			    	setTimeout(function()
			    	{
			    		document.execCommand('formatBlock', false, 'p');
			    	},
			    	30);
			    }
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