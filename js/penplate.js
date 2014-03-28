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
		// Setup
		// ---------------------------------------------------------------------------------------
		var $object 						= this;
		var $this_penplate;
		var $window_type;
		var $controls_template 				= '';
		var $ar_controls;
		

		// Settings
		// ---------------------------------------------------------------------------------------
		$object.settings 					= 
		{
			breakpoint						: '700',
			bold 							: true,
			italics 						: true,
			underline 						: true,
			heading_1						: true,
			heading_2						: true,
			quote 							: true,
			link 							: true,
			image 							: false,
			heading_1_tag 					: 'h3',
			heading_2_tag 					: 'h4',
			controls 						: ['bold', 'italics', 'underline', 'heading_1', 'heading_2', 'quote', 'link']
		};
		

		// Initialize
		// ---------------------------------------------------------------------------------------
		$object.init 						= function($element, settings)
		{	
			// Check if the settings are being edited via the call
			$object.settings 				= $.extend($object.settings, settings);

			// Some variables
			$this_penplate					= $element;
			$this_penplate_content 			= jQuery.trim($this_penplate.html());

			// Setup
			$object.add_controls();
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
			$object.window_resize();
		}
		

		// Functions
		// ---------------------------------------------------------------------------------------
		// Add controls
		$object.add_controls					= function()
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

			$controls_template 				+= '<div class="penplate-controls"><ul>';

				// Set each control
				$.each($object.settings.controls, function($key, $value)
				{
					$controls_template 		+= $ar_controls[$value];
				});

			$controls_template += '</ul></div>';

			// Append the controls
			$('body').append($controls_template);
		}

		// Window type
		$object.window_type					= function()
		{
			if($(window).width() <= $object.settings.breakpoint)
			{
				// Set the type variable
				$('html').addClass('penplate-small-view');
				$('html').removeClass('penplate-large-view');
				$window_type 				= 'small-view';

				// Reset the controls position
				$object.reset_position();
			}
			else
			{
				// Set the type variable
				$('html').removeClass('penplate-small-view');
				$('html').addClass('penplate-large-view');
				$window_type 				= 'large-view';
			}
		}

		// Reset the controls position
		$object.reset_position					= function()
		{
			$('.penplate-controls').css({ top: '0', left: '0' });
		}

		// Activate controls
		$object.activate_controls			= function($this_penplate)
		{
			// Show
			$('html').on('mouseup', function()
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
			$range 							= $selection.getRangeAt(0);
			$range_start 					= $range.startOffset;
			$range_end 						= $range.endOffset;
			$is_range 						= false;

			// Set is range
			if(($range_end - $range_start) != 0)
			{
				$is_range 					= true;
			}

			// Only show if range
			if($is_range == true)
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
			if($('html').hasClass('show-penplate-controls'))
			{
				if($('html').hasClass('penplate-controls-open'))
				{
					$('html').removeClass('show-penplate-controls').removeClass('penplate-controls-open');

					if($window_type == 'large-view')
					{
						$('.penplate-controls').css({ top: '-100px' });
					}
				}
			}
		}

		// Set controls position
		$object.set_control_position 		= function()
		{
			if($window_type == 'large-view')
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

		// Window resize
		$object.window_resize			= function()
		{
			$(window).on('resize', function()
			{
				$object.window_type();
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