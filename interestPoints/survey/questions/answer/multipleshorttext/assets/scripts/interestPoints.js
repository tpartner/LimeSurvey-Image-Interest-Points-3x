
/***** 
    JavaScript for the interestPoints custom question theme
    Copyright (C) 2018 - Tony Partner (http://partnersurveys.com)
    Licensed MIT, GPL
    Version - 1.0
    Create date - 15/11/2018
*****/

$(document).on('ready pjax:scriptcomplete',function(){
	
	$('.interest-points-outer-wrapper').each(function(i) {

		// Define some stuff...
		var thisQuestion = $(this).closest('.multiple-short-txt');
		var qID = $(thisQuestion).attr('id').replace(/question/, '');
		var thisImage = $('img.interest-image:eq(0)', thisQuestion);
		var thisItemsStart = $('.items-start:eq(0)', thisQuestion);
		
		if($('#question'+qID+' .interest-points-outer-wrapper .marker').length == 0) {
		
			$('#question'+qID).addClass('interest-points-question');	
			$('body').addClass('with-interest-points-question');
			
			var answersLength = $('.question-item input:text', thisQuestion).length;
			var markersLength = answersLength/3;
			
			// Wait until image loads...
			
			$(thisImage).one('load', function() {
				// Loop through sub-questions
				var i;
				for (i = 0; i < markersLength; i++) {
					// Insert the markers
					$('.interest-points-outer-wrapper:eq(0)', thisQuestion).append('<div class="marker minus parked" data-sign="-" data-index="minus-'+i+'">\
																						<i class="fa fa-minus"></i>\
																					</div>\
																					<div class="input-wrapper" data-index="plus-'+i+'">\
																						<div class="input">\
																							<input class="form-control" type="text" />\
																						</div>\
																						<div class="controls">\
																							<i class="fa fa-check pull-left"></i>\
																							<i class="fa fa-trash pull-right"></i>\
																						</div>\
																					</div>\
																					<div class="marker plus parked" data-sign="+" data-index="plus-'+i+'">\
																						<i class="fa fa-plus"></i>\
																					</div>\
																					<div class="input-wrapper" data-index="minus-'+i+'">\
																						<div class="input">\
																							<input class="form-control" type="text" />\
																						</div>\
																						<div class="controls">\
																							<i class="fa fa-check pull-left"></i>\
																							<i class="fa fa-trash pull-right"></i>\
																						</div>\
																					</div>');
				
					// Returning to page
					var newIndex = 3*i;
					if($.trim($('.question-item input:text:eq('+newIndex+')', thisQuestion).val()) != '') {
						var signText = 'plus';
						if($.trim($('.question-item input:text:eq('+newIndex+')', thisQuestion).val()) == '-') {
							signText = 'minus';
						}
						var thisMarker = $('.marker[data-index="'+signText+'-'+i+'"]', thisQuestion);
						
						// Position marker
						var markerWidth = thisMarker.width();
						var markerHeight = thisMarker.height();
						var coords = $.trim($('.question-item input:text:eq('+(newIndex+1)+')', thisQuestion).val()).split(',');
						var xCoord = coords[0];
						var xPx = thisImage.width()*(xCoord/100);
						var xOffset = markerWidth/2;
						xPx = xPx-xOffset;
						var yCoord = coords[1];
						var yPx = thisImage.height()*(yCoord/100);
						var yOffset = (markerHeight/2);
						yPx = yPx-yOffset+thisItemsStart.height();
						thisMarker.removeClass('parked').css({
							'left': xPx+'px',
							'top': yPx+'px'
						});
				
						// Marker attributes
						thisMarker.attr('data-rel-x', xCoord);
						thisMarker.attr('data-rel-y', yCoord);
						
						// Position text input
						positionInput(thisMarker, xCoord, yCoord);
						
						// Load text input
						var thisInputWrapper = $('.input-wrapper[data-index="'+signText+'-'+i+'"]', thisQuestion);
						$('input:text', thisInputWrapper).val($.trim($('.question-item input:text:eq('+(newIndex+2)+')', thisQuestion).val()));
					}
				}
			 
				// Render the markers draggable
				$('.interest-points-outer-wrapper .marker', thisQuestion).draggable({ 
					revert: 'invalid', 
					zIndex: 2700, 
					helper: 'original',
					containment: '.interest-points-padding',
					//handle: '.interest-points-outer-wrapper .marker',
					start: function(event, ui) {
						if($(ui.helper).hasClass('disabled-marker')) {
							return false;
						}
						$(ui.helper).addClass('ui-draggable-helper').removeClass('parked');
						var thisIndex = $(ui.helper).attr("data-index");
						var thisInputWrapper = $('.input-wrapper[data-index="'+thisIndex+'"]', thisQuestion);
						$('.input-wrapper', thisQuestion).fadeOut(300, function(e) {
							//$('input', thisInputWrapper).val(''); // Reset input value
						});
					},
					stop: function(event, ui) {
					}
				});
			 
				// Set the droppable target
				$('.droppable', thisQuestion).droppable({ 
					hoverClass: 'target-hover',
					tolerance: 'touch', 
					accept: '.marker' 
				});
			 
				// After dropped
				$('.droppable', thisQuestion).bind('drop', function(event, ui) {
	 
					var thisMarker = $(ui.draggable[0]);
					var markerWidth = thisMarker.width();
					var markerHeight = thisMarker.height();
					var posX = ui.position.left;
					var posY = ui.position.top;
					var relPosX = posX + (markerWidth/2);
					var relPosY = posY - thisItemsStart.height() + (markerHeight/2);
					var xRelPercent = ((relPosX/thisImage.width())*100).toFixed(2);
					var yRelPercent = ((relPosY/thisImage.height())*100).toFixed(2);
					
					thisMarker.attr('data-rel-x', xRelPercent);
					thisMarker.attr('data-rel-y', yRelPercent);
					
					var thisIndex = $(thisMarker).attr("data-index");
					var thisInputWrapper = $('.input-wrapper[data-index="'+thisIndex+'"]', thisQuestion);
					
					// Marker to park				
					if(relPosY < 0) {
						thisMarker.addClass('parked').attr('data-rel-x', '').attr('data-rel-y', '');
						$('input', thisInputWrapper).val(''); // Reset input value
					}
					// Position comments input
					else {
						positionInput(thisMarker, xRelPercent, yRelPercent);
						$(thisInputWrapper).fadeIn(300, function(e) {
							$('input:text', this).focus();
						});
					}
					
					// Handle markers
					if($('.marker:not(.parked)', thisQuestion).length >= markersLength) {
						$('.marker.parked', thisQuestion).addClass('disabled-marker');
					}
					else {
						$('.marker.parked', thisQuestion).removeClass('disabled-marker');
					}
				});
				
				// Click events
				$('.interest-points-outer-wrapper', thisQuestion).on('click', '.marker:not(.parked)', function(e) {
					var thisIndex = $(this).attr("data-index");
					$('.input-wrapper[data-index!="'+thisIndex+'"]', thisQuestion).fadeOut(300);
					$('.input-wrapper[data-index="'+thisIndex+'"]', thisQuestion).fadeIn(300, function(e) {
						$('input:text', this).focus();
					});
				});
				$('.interest-points-outer-wrapper img', thisQuestion).on('click', function(e) {
					$(this).closest('.interest-points-outer-wrapper').find('.input-wrapper').fadeOut(300);
				});
				$('.input-wrapper .fa-check', thisQuestion).on('click', function(e) {
					$(this).closest('.input-wrapper').fadeOut(300);
				});
				$('.input-wrapper .fa-trash', thisQuestion).on('click', function(e) {
					var thisIndex = $(this).closest('.input-wrapper').attr("data-index");
					$(this).closest('.input-wrapper').fadeOut(300, function(e) {
						$('.marker[data-index="'+thisIndex+'"]', thisQuestion).addClass('parked').attr('data-rel-x', '').attr('data-rel-y', '');
						$('input', this).val(''); // Reset input value
					});
				});
				
			}).each(function() {
				if(this.complete) $(this).load(); // Hack to work around image caching
			});
				
			function positionInput(thisMarker, xRelPercent, yRelPercent) {
				var thisIndex = $(thisMarker).attr('data-index');
				var markerWidth = thisMarker.width();
				var markerHeight = thisMarker.height();
				var position = thisMarker.position();
				var thisInputWrapper = $('.input-wrapper[data-index="'+thisIndex+'"]', thisQuestion);
				var rightRule = Number(thisImage.width())-(position.left+(markerWidth/2))+'px';
				var leftRule = 'auto';
				if(xRelPercent <= 50) {
					var rightRule = 'auto';
					var leftRule = (position.left+(markerWidth/2))+'px';
				}
				var bottomRule = Number($('.interest-points-outer-wrapper:eq(0)', thisQuestion).height())-(position.top+(markerHeight/2))+'px';
				var topRule = 'auto';
				if(yRelPercent <= 50) {
					var bottomRule = 'auto';
					var topRule = (position.top+(markerHeight/2))+'px';
				}
				$(thisInputWrapper).css({
					'left': leftRule,
					'right': rightRule,
					'top': topRule,
					'bottom': bottomRule
				});
			}
			
			function repositionMarker(thisMarker) {
				var markerWidth = thisMarker.width();
				var markerHeight = thisMarker.height();
				var xCoord = thisMarker.attr('data-rel-x');
				var xPx = thisImage.width()*(xCoord/100);
				var xOffset = markerWidth/2;
				xPx = xPx-xOffset;
				var yCoord = thisMarker.attr('data-rel-y');
				var yPx = thisImage.height()*(yCoord/100);
				var yOffset = (markerHeight/2);
				yPx = yPx-yOffset+thisItemsStart.height();
				thisMarker.css({
					'left': xPx+'px',
					'top': yPx+'px'
				});
				positionInput(thisMarker, xCoord, yCoord);
			}
			$(window).on('resize', function(e) {
				$('.marker:not(.parked)', thisQuestion).each(function(i) {
					repositionMarker($(this));
				});				
			});
			
			
			// Interrupt the Next/Submit function 
			$('#limesurvey').submit(function(e) {
				// To-Do - Validation?
				
				// Load inputs
				$('.question-item input:text', thisQuestion).val('');
				$('.marker:not(.parked)', thisQuestion).each(function(i) {
					var thisIndex = $(this).attr("data-index");
					var newIndex = 3*i;
					$('.question-item input:text:eq('+newIndex+')', thisQuestion).val($(this).attr('data-sign'));
					//alert($('.question-item input:text:eq('+newIndex+')', thisQuestion).val());
					$('.question-item input:text:eq('+(newIndex+1)+')', thisQuestion).val($(this).attr('data-rel-x')+','+$(this).attr('data-rel-y'));
					$('.question-item input:text:eq('+(newIndex+2)+')', thisQuestion).val($('.input-wrapper[data-index="'+thisIndex+'"]', thisQuestion).find('input:text').val());
				});
			});	
		}
	});
});