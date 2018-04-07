importClass( ca.cgjennings.graphics.ImageUtilities );
useLibrary('tints');

importClass( java.awt.FontMetrics );

function drawTemplate( g, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if (className != null && className.length > 0) {
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '-' + getClassInitial( className ) + '.jp2');
	}
	else
	{
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '.jp2');
	}
	
	var w = image.getWidth();
	var h = image.getHeight();

	if ((CardTypes[faceIndex] == 'Act' || CardTypes[faceIndex] == 'Agenda') && $Orientation == 'Reversed' ) {
		sheet.paintImage( g, ImageUtils.mirror(image, true, false), new Region(0, 0, w, h) );
	}
	else {	
		sheet.paintImage( g, image, new Region(0, 0, w, h) );
	}
}

function drawBackTemplate( g, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	var templateSetting = getExpandedKey( faceIndex, 'Default-template');

	image = ImageUtils.get( $( templateSetting ) );
	
	var w = image.getWidth();
	var h = image.getHeight();
	
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function drawGuideTemplate( g, sheet  ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');
	
	var w = image.getWidth();
	var h = image.getHeight();
	
	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		if ( locale == 'it' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 130) );
		}
	}
}

function drawGuidePortraits( g, diy, sheet ) {
	var bodyRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') );

	for( let index = 0; index < PortraitList.length; index++ ) {
		var portrait = PortraitList[index];
		var image = portrait.getImage();
		var stencil = portrait.getClipStencil();

		if ( stencil != null ) {
			var invertStencil = createAlphaInvertedImage( stencil );
		
			var scale = portrait.getScale();
			var panX = portrait.getPanX();
			var panY = portrait.getPanY();

			var gs = invertStencil.getGraphics();
			gs.setComposite(AlphaComposite.SrcIn);
			gs.drawImage( image, stencil.getWidth()/2 - image.getWidth()*scale/2 + panX, stencil.getHeight()/2 - image.getHeight()*scale/2 + panY, image.getWidth()*scale, image.getHeight()*scale, null );
			gs.dispose();
		
			sheet.paintImage(g, invertStencil, bodyRegion );
		}
	}
}

function drawFadedPortrait( g, diy, sheet, portrait, mask ) {
	var image = PortraitList[getPortraitIndex( portrait )].getImage();
	var imagePanX = PortraitList[getPortraitIndex( portrait )].getPanX();
	var imagePanY = PortraitList[getPortraitIndex( portrait )].getPanY();
	var imageRotation = PortraitList[getPortraitIndex( portrait )].getRotation();
	var imageScale = PortraitList[getPortraitIndex( portrait )].getScale();
	
	var region = diy.settings.getRegion( getExpandedKey( FACE_FRONT, portrait + '-portrait-clip-region') );

	var s = imageScale;

	var imageScaled = ImageUtils.resize( image, image.width * s + 0.5, image.height * s + 0.5, true );	
	var cx = imageScaled.getWidth() / 2 - imagePanX;
	var cy = imageScaled.getHeight() / 2 - imagePanY;

	imageCropped = ImageUtils.crop( imageScaled, cx - region.width/2, cy - region.height/2, region.width, region.height );
	imageCropped = createStencilImage( imageCropped, mask );

	sheet.paintImage(g, imageCropped, region );
}

function drawSubtitleTemplate( g, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if (className != null && className.length > 0) {
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'ST-' + getClassInitial( className ) + '.jp2');
	}
	else
	{
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'ST.jp2');
	}
	
	var w = image.getWidth();
	var h = image.getHeight();
	
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function drawName( g, diy, sheet, nameBox ) {
	var faceIndex = sheet.getSheetIndex();
	var title = '';
	var unique = '';
	
	if (faceIndex == FACE_FRONT) title = diy.name;
	else {
		title = $( 'Title' + BindingSuffixes[faceIndex] );
		if ( title == null ) title = diy.name;
		
		// locations are the only type that will copy the front title if back is left blank
		if ( title == '' && CardTypes[faceIndex] == 'LocationBack' ) title = diy.name;
	}
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	if ( CardTypes[faceIndex] == 'Guide75' ) title = title.toUpperCase();	
	
	if ( title.length() >  0) {
		unique = $( 'Unique' + BindingSuffixes[faceIndex] );
		
		if (unique == '1' || CardTypes[faceIndex] == 'Investigator' || CardTypes[faceIndex] == 'InvestigatorBack' ) {
			nameBox.markupText = '<uni><b>' + title + '</b>';
		}
		else {
			nameBox.markupText = '<b>' + title + '</b>';
		}

	nameBox.drawAsSingleLine( g, region );
	}
}
/*
function drawRotatedName( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var title = '';

	if (faceIndex == FACE_FRONT) title = diy.name;
	else {
		title = $( 'Title' + BindingSuffixes[faceIndex] );
		if (title == null) title = diy.name;
	}

	g.setPaint( new Color( 0, 0, 0 ) );	
	sheet.drawRotatedTitle( g, title, diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region' ) ), Eons.namedObjects.AHLCGObject.costFont, 12.5, 0, 1 );
}
*/
function drawRotatedName (g, diy, sheet ){
	var faceIndex = sheet.getSheetIndex();
	var title = '';

	if (faceIndex == FACE_FRONT) title = diy.name;
	else {
		title = $( 'Title' + BindingSuffixes[faceIndex] );
		if (title == null) title = diy.name;
	}

	// from LotR
	BackName_box.markupText = title;
	var oldTransform = g.getTransform();
	g.rotate(-Math.PI/2,0,0);
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region' ) );
	var newRegion = region.clone();
	var x = region.getX(); 
	var y = region.getY();
	var w = region.getWidth();
	var h = region.getHeight();
	newRegion.setRect( -h-y, x, h, w );
	BackName_box.draw( g, newRegion );
	g.setTransform( oldTransform );
}

function drawChaosName( g, diy, sheet, nameBox ) {
	var faceIndex = sheet.getSheetIndex();

	nameBox.markupText = '<b>' + diy.name + '</b>';

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );

	var width = nameBox.drawAsSingleLine( g, region );

	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
		new Region( region.x + (region.width - width) / 2 , region.y + region.height, width + 2, 6) );
}

function drawSubtitle( g, diy, sheet, subtitleBox, className, drawBox ) {
	var faceIndex = sheet.getSheetIndex();
	
	if ( drawBox ) {
		var image = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Subtitle-' + getClassInitial( className )  + '.png');
	
		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Subtitle' + getClassInitial( className ) + '-region' ) );

		var iw = image.getWidth();
		var ih = image.getHeight();
	
		var x = region.x + (region.width - iw)/2;
	
		sheet.paintImage( g, image, new Region(x, region.y, iw, ih) );
	}
	
	var subtitle = $( 'Subtitle' + BindingSuffixes[faceIndex] );
	if (subtitle == null) subtitle = $Subtitle;
	
	subtitleBox.markupText = subtitle;
	subtitleBox.draw( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'SubtitleText' + getClassInitial( className ) + '-region' ) ) );
}

function drawDifficulty( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'Difficulty-region') ) );
}

function drawLabel( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();

	textBox.markupText = text.toUpperCase();
	textBox.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'Label-region') ) );
}

function drawScenarioResolutionHeader( g, diy, sheet, headerBox ) {	
	var faceIndex = sheet.getSheetIndex();

	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Header-region' ) );
							
	headerBox.markupText = #AHLCG-Scenario-Header1;
																					
	var height = headerBox.measure( g, headerRegion );
	var width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
							
	headerRegion.y += height - 3.0;
							
	headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

	height = headerBox.measure( g, headerRegion );
	var width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
							
	var headerWidth = Math.max( width1, width2 );
							
	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
		new Region( headerRegion.x + (headerRegion.width - headerWidth)/ 2, headerRegion.y + height, headerWidth, 3) );
}

function drawBody( g, diy, sheet, bodyBox, partsArray ) {
	var faceIndex = sheet.getSheetIndex();
	var Text = '';

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );

	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	// if there is no trait text, add a little spacing
	var traitText = $( 'Traits' + BindingSuffixes[faceIndex] );
	// null if it doesn't exist
	if ( traitText == '' ) {
		Text = Text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt 6pt>';
	}

	for( let index = 0; index < partsArray.length; index++ ) {
		Text = addTextPart( faceIndex, Text, partsArray[index], diy );
		Text = addSpacing( faceIndex, Text, partsArray[index], diy );
	}

	bodyBox.markupText = Text;

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawBodyWithRegionName( g, diy, sheet, bodyBox, partsArray, regionName ) {
	var faceIndex = sheet.getSheetIndex();
	var Text = '';

	// if there is no trait text, add a little spacing
	var traitText = $( 'Traits' + BindingSuffixes[faceIndex] );
	// null if it doesn't exist
	if ( traitText == '' ) {
		Text = Text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt 6pt>';
	}

	for( let index = 0; index < partsArray.length; index++ ) {
		Text = addTextPart( faceIndex, Text, partsArray[index], diy );
		Text = addSpacing( faceIndex, Text, partsArray[index], diy );
	}
	
	bodyBox.markupText = Text;

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, diy.settings.getRegion( getExpandedKey( faceIndex, regionName + '-region') ) );
}

function drawIndentedStoryBody( g, diy, sheet, headerBox, storyBox, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();

	var fullRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var bodyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var fullStoryRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story-region' ) );
	var storyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story-region' ) );
	
	var defaultSpacing = 8;
	
	var suffixArray = [ 'A', 'B', 'C' ];
	
	var headerHeight = [ 0, 0, 0 ];
	var headerSpacing = [ 0, 0, 0 ];
	var storyHeight = [ 0, 0, 0 ];
	var storySpacing = [ 0, 0, 0 ];
	var bodyHeight = [ 0, 0, 0 ];
	var fullHeight = fullRegion.height;
	var totalHeight = 0;
	var headerText = [ '', '', ''];
	var storyText = [ '', '', '' ];
	var bodyText = [ '', '', '' ];
	
	for ( let i = 0; i < 3; i++ ) {		
		if ( i > 0) {
			headerSpacing[i] = parseInt( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 2;
			headerText[i] = $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] );
		}

		storySpacing[i] = parseInt( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 2;
		storyText[i] = $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] );
		let textExists = false;
				
		if ( i > 0 ) {
			headerBox.markupText = '';	// we are reusing headerBox for each section - this is required to prevent oddness that I admit I don't understand
			headerBox.markupText = headerText[i];
	
			if (headerText[i].length() > 0) {		
				headerHeight[i] = headerBox.measure( g, fullRegion );
				totalHeight += headerHeight[i];
				totalHeight += headerSpacing[i];

				textExists = true;
			}
		}
		
		storyBox.markupText = '';	// we are reusing storyBox for each section - this is required to prevent oddness that I admit I don't understand
		storyBox.markupText = storyText[i];
	
		if (storyText[i].length() > 0) {		
			storyHeight[i] = storyBox.measure( g, fullStoryRegion );
			totalHeight += storyHeight[i];
			totalHeight += storySpacing[i];

			textExists = true;
		}
		
		bodyText[i] = '';
		
		bodyText[i] = addTextPart( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );
		bodyText[i] = addSpacing( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );

		bodyBox.markupText = '';	// we are reusing bodyBox for each section - this is required to prevent oddness that I admit I don't understand
		bodyBox.markupText = bodyText[i];
	
		updateNameTags( bodyBox, diy );
	
		if ((bodyText[i]).length > 0) {		
			bodyHeight[i] = bodyBox.measure( g, fullRegion );
			totalHeight += bodyHeight[i];

			textExists = true;
		}
		
		if (i > 0 && textExists) totalHeight += 16;	// for the rule and spacing
	}
	
	var scale = 1.0;

	if (totalHeight > fullHeight) scale = fullHeight / totalHeight;

	var bodyTextSize = 1.0;
	var storyTextSize = 1.0;
	var headerTextSize = 1.0;
	
	// this is more or less a guess that works so far
	var textScale = Math.sqrt( scale ) * 0.92;

	bodyTextSize = textScale * $ScaleModifier;
	storyTextSize = textScale * $ScaleModifier;
	headerTextSize = textScale * $ScaleModifier;

	for ( let i = 0; i < 3; i++ ) {	
		if ( i > 0 ) {
			if ( headerHeight[i] > 0 || storyHeight[i] > 0 || bodyHeight[i] > 0) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HRLine.png'), 
					new Region( headerRegion.x, headerRegion.y + ( 3 * scale), headerRegion.width, 10) );
					
				headerRegion.y += Math.ceil( 18 * scale );
			}
			
			// if we are scaling down, the text won't necessarily fill the box, so we are recalculating the height
			headerRegion.height = Math.ceil( headerHeight[i] * scale );
			if (headerText[i].length() > 0) {		
				headerBox.markupText = '<size ' + headerTextSize + '%>' + headerText[i];

				headerHeight[i] = headerBox.measure( g, fullRegion );
				headerRegion.height = Math.ceil( headerHeight[i] );
			}
		
			storyRegion.y = headerRegion.y + headerRegion.height + Math.ceil( headerSpacing[i] * scale );
			storyRegion.height = Math.ceil( storyHeight[i] * scale );
		}
		else {
			storyRegion.height = Math.ceil( storyHeight[i] * scale );
		}

		if (storyText[i].length() > 0) {		
			storyBox.markupText = '<size ' + storyTextSize + '%>' + storyText[i];

			storyHeight[i] = storyBox.measure( g, fullStoryRegion );
			storyRegion.height = Math.ceil( storyHeight[i] );
		}
 
		bodyRegion.y = storyRegion.y + storyRegion.height + Math.ceil( storySpacing[i]  * scale );
		bodyRegion.height = Math.ceil( bodyHeight[i] * scale );
		if (bodyText[i].length > 0) {	
			bodyBox.markupText = '<size ' + bodyTextSize + '%>' + bodyText[i];

			bodyHeight[i] = bodyBox.measure( g, fullRegion );
			bodyRegion.height = Math.ceil( bodyHeight[i] );
		}

		if (headerHeight[i] > 0) {
			headerBox.markupText = '<size ' + headerTextSize + '%>' + headerText[i];

			headerBox.draw( g, headerRegion );
		}

		if ( storyHeight[i] > 0 ) {
			storyBox.markupText = '<size ' + storyTextSize + '%>' + storyText[i];

			storyBox.draw( g, storyRegion );
		
			sheet.paintImage( g, createDarkenedImage( ImageUtils.get('ArkhamHorrorLCG/images/Lines.png') ), 
				new Region( storyRegion.x - 18, storyRegion.y + 2, 6, storyRegion.height - 4) );
		}
	
		if (bodyHeight[i] > 0) {
			bodyBox.markupText = '<size ' + bodyTextSize + '%>' + bodyText[i];

			bodyBox.draw( g, bodyRegion );
		}
		
		// update regions (everything is based off of headerRegion.y)
		headerRegion.y = bodyRegion.y + bodyRegion.height + ( 2 * scale);
	}
}

function drawGuideBody( g, diy, sheet, bodyBox, headerBox, bodyRegion, text ) {
	var faceIndex = sheet.getSheetIndex();

	while (text.length > 0) {
		let startMatch = /<section>|<header>|<box(?:res|sa)(?:\sbracket|\sheader)*>/.exec( text );
		
		let endMatch = null;
		let matchIndex = -1;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
	
		if ( startMatch ) {
			switch ( startMatch[0] ) {
				case '<section>':
					endMatch = /<\/section>/.exec( text );
				
					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';
							
						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';
										
						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {					
						specialText = text.slice( startMatch.index, endMatch.index + 10 );
						postSpecialText = text.slice( endMatch.index + 10 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness') );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

					sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
						new Region( bodyRegion.x, bodyRegion.y + sectionHeight - 2, bodyRegion.width + 10, 6) );

					bodyRegion.y += sectionHeight - 8;
					bodyRegion.height -= (sectionHeight - 8);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );

					text = postSpecialText;
					break;
				case '<header>':
					endMatch = /<\/header>/.exec( text );
				
					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';
							
						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';
										
						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {					
						specialText = text.slice( startMatch.index, endMatch.index + 9 );
						postSpecialText = text.slice( endMatch.index + 9 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

//					bodyRegion.y += 14;
//					bodyRegion.height -= 14;

					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness') );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

					bodyRegion.y += sectionHeight - 10;
					bodyRegion.height -= (sectionHeight - 10);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );

					text = postSpecialText;
					break;
				default:	//	<box...>
					let res = ( /boxres/.exec( startMatch[0] ) != null );
					let header = ( /header/.exec( startMatch[0] ) != null );
					let bracket = ( /bracket/.exec( startMatch[0] ) != null );

					if ( res ) endMatch = /<\/boxres>/.exec( text );
					else endMatch = /<\/boxsa>/.exec( text );
				
					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';
							
						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';
										
						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {					
						specialText = text.slice( startMatch.index, endMatch.index + 8 + res );
						postSpecialText = text.slice( endMatch.index + 8 + res );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					let headerHeight = 0;
					if ( header ) {
						headerHeight = res ? 80 : 47;
					}

					let boxRegion = new Region( bodyRegion.x - 7, bodyRegion.y, bodyRegion.width + 36, bodyRegion.height );

					// space before header/first text
					bodyRegion.x += 34;
					bodyRegion.width -= 48;
					if ( header ) {
						bodyRegion.y += 29;
						bodyRegion.height -= 29;
					}
					else {
						bodyRegion.y += 27;
						bodyRegion.height -= 27;
					}

					bodyBox.markupText = specialText;
					sectionHeight = bodyBox.measure( g, bodyRegion );

					let boxTopImage;
					let boxBottomImage;

					let boxType = res ? 'Res' : 'SA';
															
					if (bracket) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
					else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');
						
					if ( endMatch == bracket ) boxBottomImage = boxTopImage;
					else if ( endMatch) boxBottomImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
					else boxBottomImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');
/*
		var icon_tinter = new TintCache( new TintFilter(), boxTopImage );
		icon_tinter.setFactors( 90.0, 0.04, 1.00 );

		boxTopImage = icon_tinter.getTintedImage();
*/	
					let ar = boxTopImage.height / boxTopImage.width;
					
					sheet.paintImage( g, boxTopImage, 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, boxRegion.width * ar ) );
					
					boxRegion.y += boxRegion.width * ar;
					boxRegion.height -= boxRegion.width * ar;
					
					if ( sectionHeight + headerHeight > 84 ) {
						sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Line.png'), 
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, sectionHeight + headerHeight - 84 ) );
					}
					
					if ( sectionHeight + headerHeight < 84 ) sectionHeight = 84 - headerHeight;
					boxRegion.y += sectionHeight + headerHeight;
					boxRegion.height -= ( sectionHeight + headerHeight );

					ar = boxBottomImage.height / boxBottomImage.width;

					sheet.paintImage( g, ImageUtils.mirror( boxBottomImage, false, true ), 
						new Region( boxRegion.x, boxRegion.y - 84, boxRegion.width, boxRegion.width * ar) );

					// draw header
					if ( header ) {						
						if ( res ) {
							let headerRegion = new Region2D( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
							
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							headerBox.markupText = #AHLCG-Scenario-Header1;
																					
							let height = headerBox.measure( g, bodyRegion );
							let width1 = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;
							
							headerRegion.y += height;
							
							headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

							height += headerBox.measure( g, bodyRegion );
							let width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
							
							let headerWidth = Math.max( width1, width2 );
							
							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
								new Region( bodyRegion.x + (bodyRegion.width - headerWidth)/ 2, bodyRegion.y + height, headerWidth, 6) );
						}
						else {
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SAHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Standalone + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
//							headerBox.draw( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
								new Region( bodyRegion.x + (bodyRegion.width - width)/ 2, bodyRegion.y + height - 2, width, 6) );
						}

						bodyRegion.y += headerHeight;
						bodyRegion.height -= headerHeight;
					}

					// draw main box text
					if ( res ) bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResBullet-style'), null) );
					else bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SABullet-style'), null) );
					
					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

					bodyRegion.x -= 34;
					bodyRegion.width += 48;
					// okay, this probably different for nonheader...
					bodyRegion.y += sectionHeight + 55;
					bodyRegion.height -= (sectionHeight + 55);

					text = postSpecialText;
					break;
			}
		}
		else {
			bodyBox.markupText = text;
			bodyBox.draw( g, bodyRegion );
			bodyBox.markupText = '';
		
			text = '';
		}
	}
}

function drawChaosBody( g, diy, sheet, textBoxes ) {
	var tokenName = [ 'Skull', 'Cultist', 'Tablet', 'ElderThing' ];

	var faceIndex = sheet.getSheetIndex();
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var iconRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyIcon-region' ) );
	
	var tokenRegion = [];
	var tokenText = [];
	var tokenHeight = [];
	var tokenSpacing = [];
	var tokenIcon = [];
	
	var minHeight = 63;
	var standardSpacing = 17;

	var index = 0;
	
	for ( let i = 0; i < 4; i++ ) {
		let fieldName = tokenName[i] + BindingSuffixes[faceIndex];
		let text = $( fieldName );
		let spacing = $( fieldName + 'Spacing' );
		
		if (text.length() > 0) {
			tokenRegion[index] = region;
			tokenText[index] = text;
			
			if (spacing != null && spacing.length() > 0) {
				tokenSpacing[index] = parseInt($( fieldName + 'Spacing'), 10) + standardSpacing;		
			}
			else {
				tokenSpacing[index] = standardSpacing;
			}
			
			tokenIcon[index] = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Chaos' + tokenName[i] + '.png');
			
			index++;
		}
	}

	var totalHeight = 0;
	
	for (let i = 0; i < tokenRegion.length; i++) {
		let Test_box = markupBox(sheet);
		Test_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'Body-style'), null);
		Test_box.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Body-alignment'));
		Test_box.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') );	

		Test_box.markupText = tokenText[i];
		tokenHeight[i] = Test_box.measure( g, tokenRegion[i] );
		if (tokenHeight[i] < minHeight) tokenHeight[i] = minHeight;
		
		totalHeight += tokenHeight[i];
		totalHeight += tokenSpacing[i];
	}

	scale = region.height / totalHeight;
	if (scale > 1) scale = 1;

	var y = region.y;
	for (let i = 0; i < tokenRegion.length; i++) {
		tokenRegion[i].y = y;
		tokenRegion[i].height = tokenHeight[i] * scale;

		textBoxes[i].markupText = tokenText[i];
		textBoxes[i].draw( g, tokenRegion[i] );
		
		sheet.paintImage( g, tokenIcon[i], 
			 new Region( iconRegion.x, tokenRegion[i].y + (tokenRegion[i].height - iconRegion.height)/2 + region.height * 0.06, iconRegion.width, iconRegion.height ) );
		
		y += tokenRegion[i].height;
		y += tokenSpacing[i] * scale;
	}
}

function drawScenarioBody( g, diy, sheet, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();

	var showTitle = false;
	var region;
		
	var pageType = $( 'PageType' + BindingSuffixes[faceIndex] );
		
	if ( pageType == 'Title' ) {
		if ( faceIndex == FACE_FRONT ) {
			if ( diy.name != '' ) showTitle = true;
		}
		else {
			if ( $TitleBack != '' ) showTitle = true;
		}

		if ( showTitle ) region = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyName-region') );
		else region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	}
	else if ( pageType == 'Resolution' ) {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyResolution-region') );
	}		
	else {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	}
		
	bodyBox.markupText = $( 'Rules' + BindingSuffixes[faceIndex] );

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawVictory( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	Victory_box.markupText = '<b>' + $( 'Victory' + BindingSuffixes[faceIndex] ) + '</b>';
	Victory_box.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'Victory-region') ) );
}

function drawArtist( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Artist-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	Artist_box.markupText = #AHLCG-IllustratorShort + $( 'Artist' + BindingSuffixes[faceIndex] );
	Artist_box.drawAsSingleLine( g, region );
}

function drawCopyright( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
//	var copyright = $( 'Copyright' + BindingSuffixes[faceIndex] );
//	if (copyright == null) copyright = $Copyright;
	var copyright = $Copyright;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Copyright-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	Copyright_box.markupText = copyright;
	Copyright_box.drawAsSingleLine( g, region );
}

function drawCollectionNumber ( g, diy, sheet, drawSuffix ) {
	var faceIndex = sheet.getSheetIndex();

	var collectionNumber = $( 'CollectionNumber' + BindingSuffixes[faceIndex] );
	if (collectionNumber == null) collectionNumber = $CollectionNumber;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'CollectionNumber-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	Collection_box.markupText = collectionNumber;
	
	if (drawSuffix) {
		if (faceIndex == FACE_FRONT) Collection_box.markupText += 'a';
		else Collection_box.markupText += 'b';
	}
	
	Collection_box.drawAsSingleLine( g, region );
}

function drawCost( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var cost = $( 'ResourceCost' + BindingSuffixes[faceIndex] );
	var costRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Cost-region' ) );
/*
	if ( $CardClass == 'Investigator-specific' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-CostNoLevel.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'CostNoLevel-region' ) ) );

		costRegion.y += 2.0;
	}
*/
	if ( cost == '-' ) {
		if ( CardTypes[ faceIndex ] == 'AssetStory' )
			drawDash( g, diy, sheet, costRegion, 0, -2 );
		else if ( $CardClass == 'Weakness' )
			drawDash( g, diy, sheet, costRegion, 0, 0 );
/*
		else if ( $CardClass == 'Investigator-specific' )
			drawDash( g, diy, sheet, costRegion, 0, -1 );	
*/		
		else
			drawDash( g, diy, sheet, costRegion, 2, 0 );		
	}
	else if ( cost == 'X' ) {
		sheet.drawOutlinedTitle( g, cost, costRegion, Eons.namedObjects.AHLCGObject.costFont, 14.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, cost, costRegion, Eons.namedObjects.AHLCGObject.costFont, 16.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
}

function drawLevel( g, diy, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var level = $( 'Level' + BindingSuffixes[faceIndex] );
	
	if (level == 'None') {
		if ( CardTypes[ faceIndex] == 'Skill' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-NoLevelSkill.png'), 
				diy.settings.getRegion( getExpandedKey( faceIndex, 'NoLevel-region' ) ) );
		}
		else {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-NoLevel.png'), 
				diy.settings.getRegion( getExpandedKey( faceIndex, 'NoLevel-region' ) ) );
		}
	}
	else if (level > 0) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Level-' + level + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Level-region' ) ) );
	}
}

function drawSkillIcons( g, diy, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();

	for ( let index = 1; index <= 4; index++ ) {
		let skillName = $( 'Skill' + index + BindingSuffixes[faceIndex] );

		if ( skillName != 'None' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillBox-' + getClassInitial( className ) + '.png'), 
				diy.settings.getRegion( getExpandedKey( faceIndex, 'Skill' + index + '-region' ) ) );	

			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillIcon-' + getSkillInitial( String(skillName) ) + '.png'), 
				diy.settings.getRegion( getExpandedKey( faceIndex, 'SkillIcon' + index + '-region') ) );	
		}
	}
}

function drawSlot( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var slotName = $( 'Slot' + BindingSuffixes[ faceIndex] );

	if (slotName != 'None' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot-region' ) ) );	
	}
}

function drawSkills( g, diy, sheet, boxArray, nameArray ) {
	var faceIndex = sheet.getSheetIndex();

	for ( let i = 0; i < boxArray.length; i++ ) {
		boxArray[i].markupText = $( nameArray[i] + BindingSuffixes[faceIndex] );
		boxArray[i].drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, nameArray[i] + '-region' ) ) );
	}
}

function drawStamina( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var stamina = $( 'Stamina' + BindingSuffixes[ faceIndex] );

	if (stamina != 'None') {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Stamina-' + stamina + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Stamina-region' ) ) );		
	}
}

function drawSanity( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var sanity = $( 'Sanity' + BindingSuffixes[faceIndex] );

	if (sanity != 'None') {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Sanity-' + sanity + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Sanity-region' ) ) );		
	}
}

function drawEncounterIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var iconName = $Encounter;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultEncounter-portrait-clip-region' ),
		// default - if no DefaultEncounter defined, use normal Encounter
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Encounter-portrait-clip-region' ) ) );

	if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) {
		region = reverseRegion( region );
		region.x += 1;
	}

	// resource
	if ( $EncounterType == '0' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png'), region );		
	}
	// custom
	else {	
		diy.settings.setRegion( 'AHLCG-' + CardTypes[0] + '-Encounter-portrait-clip-region', region );
		PortraitList[getPortraitIndex( 'Encounter' )].paint( g, sheet.getRenderTarget() );
	}
}

function drawCollectionIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var iconName = $Collection;
	var icon;

	let region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultCollection-portrait-clip-region' ),
		// default - if no DefaultCollection defined, use normal Collection
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Collection-portrait-clip-region' ) ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );	
	
	// resource
	if ( $CollectionType == '0' ) {
		icon = createInvertedImage( ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png') );
				
		sheet.paintImage( g, icon, region );		
	}
	// custom
	else {
		diy.settings.setRegion( 'AHLCG-' + CardTypes[0] + '-Collection-portrait-clip-region', region );
		
		PortraitList[getPortraitIndex( 'Collection' )].paint( g, sheet.getRenderTarget() );
	}
}

function drawOverlay( g, diy, sheet, overlayName ) {
	var faceIndex = sheet.getSheetIndex();

	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-' + overlayName + '.png'), 
		diy.settings.getRegion( getExpandedKey( faceIndex, overlayName + '-region' ) ) );
}

function drawEnemyStats( g, diy, sheet, statNames ) {
	var faceIndex = sheet.getSheetIndex();

	for (let i = 0; i < statNames.length; i++) {
		let stat = statNames[i];
		let statValue = $( stat + BindingSuffixes[faceIndex] );
		
		let statRegion = diy.settings.getRegion( getExpandedKey(faceIndex, stat + '-region' ) );
		
		if ( statValue == '-' ) {
			statRegion.y += 6.0;
			
			sheet.drawOutlinedTitle( g, '\u2014', statRegion, Eons.namedObjects.AHLCGObject.costFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
		}
		else
			sheet.drawOutlinedTitle( g, statValue, statRegion, Eons.namedObjects.AHLCGObject.enemyFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
	}
}

function drawEnemyHealth( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var health = $( 'Health' + BindingSuffixes[faceIndex] );
	
	if (perInvestigator == '1') {
		sheet.drawOutlinedTitle( g, health, diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) ), Eons.namedObjects.AHLCGObject.enemyFont, 13.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
		sheet.drawOutlinedTitle( g, 'p', diy.settings.getRegion( getExpandedKey(faceIndex, 'PerInv-region' ) ), Eons.namedObjects.AHLCGObject.symbolFont, 6.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, health, diy.settings.getRegion( getExpandedKey(faceIndex, 'Health-region' ) ), Eons.namedObjects.AHLCGObject.enemyFont, 13.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
	}	
}

function drawDamage( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var damage = $( 'Damage' + BindingSuffixes[faceIndex] );

	for ( let i = 1; i <= damage; i++ ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Damage.png'), 
			diy.settings.getRegion( getExpandedKey(faceIndex, 'Damage' + i + '-region' ) ) );		
	}
}

function drawHorror( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var horror = $( 'Horror' + BindingSuffixes[faceIndex] );

	for ( let i = 1; i <= horror; i++ ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Horror.png'), 
			diy.settings.getRegion( getExpandedKey(faceIndex, 'Horror' + i + '-region' ) ) );		
	}
}

function drawEncounterInfo( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'EncounterNumber-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );	

	var encounterNumber = $( 'EncounterNumber' + BindingSuffixes[faceIndex] );
	if (encounterNumber == null) encounterNumber = $EncounterNumber;

	var encounterTotal = $( 'EncounterTotal' + BindingSuffixes[faceIndex] );
	if (encounterTotal == null) encounterTotal = $EncounterTotal;

	Encounter_box.markupText = encounterNumber + '\u200a/\u200a' + encounterTotal;
	Encounter_box.drawAsSingleLine( g, region );
}

function drawLocationIcon( g, diy, sheet, locationIconName, drawBaseCircle )
{	
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	if (drawBaseCircle) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-LocationCircle.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'BaseIcon-region' ) ) );				
	}
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, locationIconName + '-region' ) );

	var locationIcon = $( locationIconName + BindingSuffixes[faceIndex] );

	if ( locationIcon == 'Copy front' )	locationIcon = $( locationIconName );

	if ( locationIcon != 'None' && locationIcon != 'Empty' ) {
		var index = AHLCGObject.locationIcons.indexOf( locationIcon );

		var icon_tinter = new TintCache( new TintFilter(), Eons.namedObjects.AHLCGObject.baseLocationIcon );
		var hsb = diy.settings.getTint( 'AHLCG-' + locationIcon + '-tint' );
		icon_tinter.setFactors( hsb[0], hsb[1], hsb[2] );

		var locationImage = icon_tinter.getTintedImage();

		var ig = locationImage.createGraphics();
		ig.drawImage( ImageUtils.get( 'ArkhamHorrorLCG/icons/AHLCG-Loc' + locationIcon + '.png' ), 5, 5, null );

		sheet.paintImage(g, locationImage, region );
	}
}

function drawShroud( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	sheet.drawOutlinedTitle( g, $( 'Shroud' + BindingSuffixes[faceIndex] ), diy.settings.getRegion( getExpandedKey( faceIndex, 'Shroud-region' ) ), Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, new Color(0.996, 0.945, 0.859 ), new Color(0, 0, 0), 0, true );
}

function drawClues( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var piIconSize = 7.0;
	
	// 254, 241, 219
	var lightColor = new Color(0.996, 0.945, 0.859);
	var darkColor = new Color(0, 0, 0);
	
	var textColor;
	var borderColor;
	
	if (CardTypes[faceIndex] == 'Act') {
		piIconSize = 6.0;
		textColor = lightColor;
		borderColor = darkColor;
	}
	else {
		textColor = darkColor;
		borderColor = lightColor;
	}
	
	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var clues = $( 'Clues' + BindingSuffixes[faceIndex] );

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Clues-region' ) );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	if ( clues == '-' ) {
		drawDash( g, diy, sheet, region, 0, 6 );
	}
	else if (perInvestigator == '1') {
		var perInvCluesRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'CluesPerInv-region' ) );
		var perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'PerInv-region' ) );

		if ( $Orientation == 'Reversed' ) {
			perInvCluesRegion = reverseRegion( perInvCluesRegion );
			perInvRegion = reverseRegion( perInvRegion );
			
			// flip positions
			perInvCluesRegion.x = region.x + ( (region.x + region.width) - (perInvCluesRegion.x + perInvCluesRegion.width) );
			perInvRegion.x = region.x + ( (region.x + region.width) - (perInvRegion.x + perInvRegion.width) );
		}

		var fontSize = 14.0;

		if ( clues.length() > 1 ) {
			region.x -= 1;
			perInvRegion.x += 1;
			fontSize = 11.0;
		}

		sheet.drawOutlinedTitle( g, clues, perInvCluesRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, textColor, borderColor, 0, true );
	}			
}

function drawDoom( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var doom = $( 'Doom' + BindingSuffixes[faceIndex] );
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Doom-region' ) );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );
	
	var textColor = new Color(0.996, 0.945, 0.859);
	var borderColor = new Color(0, 0, 0);
	var piIconSize = 6.0;

	if ( doom == '-' ) {		
		drawDash( g, diy, sheet, region, 0, 6 );
	}
	else if (perInvestigator == '1') {
		let perInvDoomRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'DoomPerInv-region' ) );
		let perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'PerInv-region' ) );

		if ( $Orientation == 'Reversed' ) {
			perInvDoomRegion = reverseRegion( perInvDoomRegion );
			perInvRegion = reverseRegion( perInvRegion );
			
			// flip positions
			perInvDoomRegion.x = region.x + ( (region.x + region.width) - (perInvDoomRegion.x + perInvDoomRegion.width) );
			perInvRegion.x = region.x + ( (region.x + region.width) - (perInvRegion.x + perInvRegion.width) );
		}

		let fontSize = 14.0;

		if ( doom.length() > 1 ) {
			perInvDoomRegion.x -= 1;
			perInvRegion.x += 1;
			fontSize = 11.0;
		}

		sheet.drawOutlinedTitle( g, doom, perInvDoomRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else {	
		if ( $Orientation == 'Reversed' ) {
			region.x -= 1;
			}
	
		sheet.drawOutlinedTitle( g, doom, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, new Color(0.996, 0.945, 0.859), new Color(0, 0, 0), 0, true );
	}
}

function drawScenarioIndexFront( g, diy, sheet, typeText, textBox ) {
	var faceIndex = sheet.getSheetIndex();
	var text = typeText + ' ' + $ScenarioIndex;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'ScenarioIndex-region' ) );
	
//	if ( faceIndex == FACE_FRONT ) {
		if ( $Orientation == 'Reversed' ) {
			region = reverseRegion( region );
			region.x -= 1;
		}

		text = text + $ScenarioDeckID;
//	}
//	else {
//		text = text.toUpperCase() + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
//	}
			
	textBox.markupText = text;
//	textBox.draw( g, region );	
	textBox.drawAsSingleLine( g, region );

}

function drawScenarioIndexBack( g, diy, sheet, typeText, textBox ) {
	var faceIndex = sheet.getSheetIndex();
//	var text = typeText + ' ' + $ScenarioIndex;
	var text = $ScenarioIndex;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'ScenarioIndex-region' ) );
	
	var lineHeight = region.height / 2;
	
	// first line
	region.height -= lineHeight;
	
//	if ( faceIndex == FACE_FRONT ) {
//		if ( $Orientation == 'Reversed' ) {
//			region = reverseRegion( region );
//			region.x -= 1;
//		}

//		text = text + $ScenarioDeckID;
//	}
//	else {
//		text = text.toUpperCase() + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
		text = text + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
//	}
			
	textBox.markupText = typeText.toUpperCase();
	textBox.drawAsSingleLine( g, region );

	// second line
	region.y += lineHeight;

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
	
//	text = typeText.toUpperCase() + ' ' + $ScenarioIndex + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
//	textBox.markupText = text;
//	textBox.draw( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'ScenarioIndex-region' ) ) );	
}

function drawDash( g, diy, sheet, region, offsetX, offsetY ) {
	var faceIndex = sheet.getSheetIndex();

	var dashX = 26;
	var dashY = 10;

	// center in region
	region.x = region.x + ( region.width - dashX ) / 2 + offsetX;
	region.y = region.y + ( region.height - dashY ) / 2 + offsetY;
	region.width = 26;
	region.height = 10;

	var hsb = diy.settings.getTint( getExpandedKey( faceIndex, 'Dash-tint' ) );
	
	var dashImage = ImageUtils.get( 'ArkhamHorrorLCG/numbers/AHLCG-Cost--.png', true );

	var filter = new ca.cgjennings.graphics.filters.TintFilter( hsb[0], hsb[1], hsb[2] );
	
	dashImage = filter.filter( dashImage, null );
	
	sheet.paintImage(g, dashImage, region );
}

function drawPageNumber ( g, diy, sheet, pageBox ) {
	var faceIndex = sheet.getSheetIndex();

	var pageNumber = $( 'Page' + BindingSuffixes[faceIndex] );
	var region;
	
	if ( Number($Page) % 2 == 0 ) region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageEven-region' ) );
	else region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageOdd-region' ) );
	
	pageBox.markupText = pageNumber;
	pageBox.drawAsSingleLine( g, region );
}
