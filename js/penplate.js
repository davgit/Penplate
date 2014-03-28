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
		var $this_penplate;
		

		// ------------------------------------------------ Settings
		$object.settings 					= 
		{
			breakpoint						: '700',
		};
		

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
			document.execCommand('defaultParagraphSeparator', false, 'p');

			// Window type
			$object.window_type();
			$(window).resize(function()
			{
				$object.window_type();
			});

			// Penplate functions
			$object.new_paragraph();
			$object.edit_selection();
			$object.activate_controls($this_penplate);
		}
		

		// ------------------------------------------------ Functions
		// Window type
		$object.window_type					= function()
		{
			if($(window).width() <= $object.settings.breakpoint)
			{
				// Set the type variable
				$('html').addClass('penplate-small-view');
				$('html').removeClass('penplate-large-view');
			}
			else
			{
				// Set the type variable
				$('html').removeClass('penplate-small-view');
				$('html').addClass('penplate-large-view');
			}
		}

		// Activate controls
		$object.activate_controls			= function($this_penplate)
		{
			// Show
			$this_penplate.on('mouseup', function()
			{
				$object.check_selection();
			});
			$this_penplate.on('keyup', function()
			{
				$object.check_selection();
			});

			// Hide
			$('html').on('click', function($e)
			{
				// Some variables
				var $target 				= $($e.target);
				var $target_check 			= $target.parents('.penplate-controls').length;

				// Hide the menu under condition
				if($target_check == false)
				{
					$object.hide_controls();
				}
				$(window).resize(function()
				{
					$object.hide_controls();
				});
			});
		}

		// Check selection
		$object.check_selection 			= function()
		{
			// Check if selection is empty
			$selection 						= window.getSelection();

			// Only show if range
			if($selection.type == 'Range')
			{
				// Show the controls
				$object.show_controls();
			}
		}

		// Show controls
		$object.show_controls 				= function()
		{
			// Position control			
			$object.set_control_position();

			// Show the controls
			if($('html').hasClass('show-penplate-controls') == false)
			{	
				// Attach class to HTML
				$('html').addClass('show-penplate-controls');
			}

			$('.penplate-controls').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function()
			{
				if($('html').hasClass('show-penplate-controls') == true)
				{
					$('html').addClass('penplate-controls-open');
				}
			});
		}

		// Hide controls
		$object.hide_controls 				= function()
		{
			// Remove class on HTML 
			if($('html').hasClass('penplate-'))
			{
				if($('html').hasClass('penplate-controls-open'))
				{
					$('html').removeClass('show-penplate-controls').removeClass('penplate-controls-open');
					$('.penplate-controls').css({ top: '-100px' });
				}
			}
		}

		// Set controls position
		$object.set_control_position 		= function()
		{
			// Some variables
			$control_w 						= $('.penplate-controls').outerWidth();
			$control_h 						= $('.penplate-controls').height();
   			$selection 						= window.getSelection();
   			$range 							= $selection.getRangeAt(0);
   			$boundary						= $range.getBoundingClientRect();
   			$boundary_center 				= ($boundary.left + $boundary.right) / 2;

			// Some variables
			$offset_left 					= $boundary_center - ($control_w / 2);
			$offset_top						= $boundary.top + window.pageYOffset - ($control_h + 12);

			// Set the position
			$('.penplate-controls').css({ left: $offset_left, top: $offset_top });
        }

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

					// Apply the format
					if($parent_tag_type != $pen_edit_action)
					{
						// Super parent
						$super_parent 	= window.getSelection().anchorNode.parentElement.parentElement.nodeName.toLowerCase();

						// Block quote check - Firefox issue with parent tag being p within blockquote
						if($pen_edit_action == 'blockquote')
						{
			                document.execCommand('outdent', false, null);

			                if($super_parent != 'blockquote'){
								document.execCommand('formatBlock', false, $pen_edit_action);
							}
			            }
			            else
			            {
			            	document.execCommand('formatBlock', false, $pen_edit_action);
			            }
					}
					else
					{
						document.execCommand('formatBlock', false, 'p');
					}
				}

				// Reposition controls if need be
				setTimeout(function()
		    	{
					$object.set_control_position();
		    	},
		    	30);
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
			    	10);
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