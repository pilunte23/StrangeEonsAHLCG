importClass( ca.cgjennings.graphics.ImageUtilities );
useLibrary('tints');

importClass( java.awt.FontMetrics );
importClass( java.awt.font.FontRenderContext );
importClass( java.awt.Rectangle );
importClass( java.awt.font.TextLayout );

// The Dream-Eaters TODO:
//		Entries for prologue investigators
//		Enemy orientation (Weaver), collection info on side

// Subtitle region for neutrals
// Label region for certain classes
// Update card backs
// Line spacing dependent on OS, ugh
// Font issues

function drawTemplate( g, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if ( className != null && className.length > 0 ) {
		// asset basic weaknesses should use the AssetStory template
		if ( CardTypes[faceIndex] == 'Asset' && className == 'BasicWeakness' ) 
			image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-AssetStory' + '-' + getClassInitial( className ) + '.jp2');
		else
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

function drawAssetTemplate( g, diy, sheet, className, className2 ) {
	var faceIndex = sheet.getSheetIndex();

	// normal
	if ( className == null || className.length == 0 || className2 == null || className2 == 'None' ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// don't draw dual class if the first class isn't a valid one or if the classes match
	if ( !isDualClass( className, className2 ) ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// dual class
	var image = ImageUtils.get( 'ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '-D.jp2' );
	
	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	// draw class icons
	var classInitial = getClassInitial( className );
	var classInitial2 = getClassInitial( className2 );

	var symbolImage1 = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-ClassSymbol-' + classInitial + '.png' );
	var symbolImage2 = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-ClassSymbol-' + classInitial2 + '.png' );
	
	var symbolRegion1 = diy.settings.getRegion( getExpandedKey( faceIndex, 'ClassSymbol1-region') );
	var symbolRegion2 = diy.settings.getRegion( getExpandedKey( faceIndex, 'ClassSymbol2-region') );
	
	sheet.paintImage( g, symbolImage1, symbolRegion1 );
	sheet.paintImage( g, symbolImage2, symbolRegion2 );
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

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(187, 51, 750, 227) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 130) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 130) );
				break;
		}
	}
}

function drawGuideTemplateA4( g, sheet  ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');
	
	var w = image.getWidth();
	var h = image.getHeight();
	
	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(206, 56, 827, 250) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(189, 162, 865, 144) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(190, 162, 863, 144) );
				break;
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

	// portrait center
	var cx = image.getWidth() / 2 - imagePanX;
	var cy = image.getHeight() / 2 - imagePanY;

	var sx = region.width / imageScale;
	var sy = region.height / imageScale;

	imageCropped = ImageUtils.crop( image, cx - sx/2, cy - sy/2, sx, sy );
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

	// can't make this work without creating a new box
	// otherwise, you have to edit the text for the color change to happen
	if ( CardTypes[faceIndex] == 'Investigator') {
		if ( $CardClass != null && $CardClass.indexOf('Parallel') >= 0) {
			nameBox = markupBox(sheet);
			nameBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ParallelName-style'), null);
			nameBox.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

			initBodyTags( diy, nameBox );	
		}
	}

	if (faceIndex == FACE_FRONT) title = diy.name;
	else {
		title = $( 'Title' + BindingSuffixes[faceIndex] );
		if ( title == null ) title = diy.name;
		
		// locations are the only type that will copy the front title if back is left blank
		if ( title == '' && CardTypes[faceIndex] == 'LocationBack' ) title = diy.name;
	}
	
	if ( title.length() >  0) {
		unique = $( 'Unique' + BindingSuffixes[faceIndex] );
		if ( unique == null ) unique = $Unique;
		
		if ( unique == '1' ) {
			nameBox.markupText = '<uni>' + title;
		}
		else {
			nameBox.markupText = title;
		}
	
		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );
		if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

		if ( CardTypes[faceIndex] == 'Asset' ) {
			let class1 = $CardClass;
			let class2 = $CardClass2;
		
			let dual = isDualClass( class1, class2 );
	
			// if dual, we should shrink the text box on both sides, to keep it centered, 
			// but if the name is too long, we can extend the left side back out
			if ( dual ) {
				// using measure() is drawing an offset title for some reason, so we create a copy to get the size
				let testBox = markupBox(sheet);
				testBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
				testBox.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));
				testBox.markupText = nameBox.markupText;
				
				region.x += 30;
				region.width -= 60;

//				let height = nameBox.measure( g, region );
				let height = testBox.measure( g, region );

				// trying to figure out if it doesn't fit in the region at full size
				if ( height < 22.0 || ( height > 25.0 && title.length() > 20 ) ) {
					region.x -= 30;
					region.width += 30;
				}
			}
		}
		else if ( CardTypes[faceIndex] == 'Guide75' ) title = title.toUpperCase();	
		else if ( CardTypes[faceIndex] == 'GuideA4' ) title = title.toUpperCase();
		else if ( CardTypes[faceIndex] == 'Event' && ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness' )) region.y -= 3;

		nameBox.drawAsSingleLine( g, region );
	}
}

function drawActAgendaName( g, diy, sheet, nameBox ) {
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
	
	if ( title.length() >  0) {
		unique = $( 'Unique' + BindingSuffixes[faceIndex] );
		
		if ( unique == '1' ) {
			nameBox.markupText = '<uni>' + title;
		}
		else {
			nameBox.markupText = title;
		}
	
		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );
		if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

		nameBox.markupText = "Size";
		var lineHeight = nameBox.measure( g, region );

		var lines = diy.name.split('\n');
		
		if (lines.length > 1) region.y -= 10;
		
		var width = 0;
		for ( let i = 0; i < lines.length; i++ ) {
			nameBox.markupText = lines[i];
			width = nameBox.drawAsSingleLine( g, region );	// return the width of the last line (what we want!)

			region.y += lineHeight * 1.0;
			region.height -= lineHeight * 1.0;
		}
/*
		if (lines.length == 1) {
			// I hope this calculation works everywhere
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
				new Region( region.x + (region.width - width) / 2, region.y + 1, width + 2, 6) );
		}
*/
		return region.y + 12;
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
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );

	nameBox.markupText = "Size";	
	var lineHeight = nameBox.measure( g, region );

	var lines;
	
	if (faceIndex == FACE_FRONT) {
		if ( diy.name ) lines = diy.name.split('\n');
	}
	else {
		if ( $( 'Title' + BindingSuffixes[faceIndex] ) ) {
			lines = $( 'Title' + BindingSuffixes[faceIndex] ).split('\n');
		}
		else {
			lines = diy.name.split('\n');
		}
	}

	// assume 1 line
	if ( !lines ) return region.y + (lineHeight * 0.8) + 12;
		
	var width = 0;
	for ( let i = 0; i < lines.length; i++ ) {
		nameBox.markupText = lines[i];
		width = nameBox.drawAsSingleLine( g, region );	// return the width of the last line (what we want!)

		region.y += lineHeight * 0.8;
		region.height -= lineHeight * 0.8;
	}
		
	// I hope this calculation works everywhere
	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
		new Region( region.x + (region.width - width) / 2, region.y + 1, width + 2, 6) );

	return region.y + 12;
}

function drawSubtitle( g, diy, sheet, subtitleBox, className, drawBox ) {
	var faceIndex = sheet.getSheetIndex();

	// not currently supported
	if ( className == 'Dual' ) return;

	// can't make this work without creating a new box
	// otherwise, you have to edit the text for the color change to happen
	if ( className.indexOf('Parallel') >= 0) {
		subtitleBox = markupBox(sheet);
		subtitleBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'ParallelSubtitle-style'), null);
		subtitleBox.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Subtitle-alignment'));
	}

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
	
	var textRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'SubtitleText' + getClassInitial( className ) + '-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) textRegion.y -= 2;

	subtitleBox.markupText = subtitle;

//	subtitleBox.draw( g, textRegion );
	subtitleBox.drawAsSingleLine( g, textRegion );
}

function drawDifficulty( g, diy, sheet, textBox, text, y ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Difficulty-region') );
	region.y = y;
	
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
	
	return y + 29;
}

function drawLabel( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Label-region') );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	textBox.markupText = text.toUpperCase();
	textBox.drawAsSingleLine( g, region );
}

function drawScenarioResolutionHeader( g, diy, sheet, headerBox ) {	
	var faceIndex = sheet.getSheetIndex();

	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Header-region' ) );
							
	headerBox.markupText = #AHLCG-Scenario-Header1;
																					
	var height = headerBox.measure( g, headerRegion );
	var width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
							
	headerRegion.y += height - 0.0;
							
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

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );
	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;
	
	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	bodyBox.setTextFitting( FIT_SCALE_TEXT );	
	
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

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, regionName + '-region') );
	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;
	
	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	bodyBox.setTextFitting( FIT_SCALE_TEXT );	

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

function drawIndentedStoryBody( g, diy, sheet, headerBox, storyBox, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();

	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var fullRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var bodyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var fullStoryRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story-region' ) );
	var storyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story-region' ) );

	var horizLineSpace1 = 0;
	var horizLineSpace2 = 16;

	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) {
		fullRegion.y -= 2;
		headerRegion.y -= 2;
		bodyRegion.y -= 2;
		fullStoryRegion.y -= 2;
		storyRegion.y -= 2;

		horizLineSpace1 = 2;
		horizLineSpace2 = 14;
	}
	
	headerBox.setLineTightness( $(getExpandedKey(faceIndex, 'Header', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	headerBox.setTextFitting( FIT_SCALE_TEXT );	
	storyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Story', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	storyBox.setTextFitting( FIT_SCALE_TEXT );	
	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	bodyBox.setTextFitting( FIT_SCALE_TEXT );	

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
		headerSpacing[i] = parseInt( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4;
		headerText[i] = $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] );

		storySpacing[i] = parseInt( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4;
		storyText[i] = $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] );
		let textExists = false;
				
		headerBox.markupText = '';	// we are reusing headerBox for each section - this is required to prevent oddness that I admit I don't understand
		headerBox.markupText = headerText[i];
	
		if (headerText[i].length() > 0) {
			headerHeight[i] = headerBox.measure( g, fullRegion );
			totalHeight += headerHeight[i];
			totalHeight += headerSpacing[i];

			textExists = true;
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
		
		if (textExists) totalHeight += 16;	// for the rule and spacing
	}
	
	var scale = 1.0;

	if (totalHeight > fullHeight) scale = fullHeight / totalHeight;

	var bodyTextSize = 1.0;
	var storyTextSize = 1.0;
	var headerTextSize = 1.0;
	
	// this is more or less a guess that works so far
	var textScale = Math.sqrt( scale ) * 0.93;

	bodyTextSize = textScale * $ScaleModifier;
	storyTextSize = textScale * $ScaleModifier;
	headerTextSize = textScale * $ScaleModifier;

	for ( let i = 0; i < 3; i++ ) {	
		if ( i > 0 ) {
			if ( headerHeight[i] > 0 || storyHeight[i] > 0 || bodyHeight[i] > 0) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HRLine.png'), 
					new Region( headerRegion.x, headerRegion.y + ( horizLineSpace1 * scale * $ScaleModifier / 100.0 ), headerRegion.width, 7) );
					
				headerRegion.y += Math.ceil( horizLineSpace2 * scale * $ScaleModifier / 100.0 );
			}
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

		if (storyText[i].length() > 0) {		
			storyBox.markupText = '<size ' + storyTextSize + '%>' + storyText[i];

			storyHeight[i] = storyBox.measure( g, fullStoryRegion );
			storyRegion.height = Math.ceil( storyHeight[i] ) + 2;
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
				new Region( storyRegion.x - 18, storyRegion.y, 6, storyRegion.height - 2) );
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

	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var tightness = AHLCGObject.bodyFontTightness;
	
	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) {
		bodyRegion.y -= 2;
		tightness = tightness * 1.2;
	}

	while (text.length > 0) {
		let startMatch = /<section>|<header>|<box(?:res|sa|int)(?:\sbracket|\sheader)*>/.exec( text );
		
		let endMatch = null;
		let matchIndex = -1;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
		let intCupShape = null;
		let textRegion = new Region( bodyRegion );
		
		if ( startMatch ) {
			switch ( startMatch[0] ) {
				case '<section>':
					endMatch = /<\/section>/.exec( text );
				
					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';
							
						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
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
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness')  * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

					sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
						new Region( bodyRegion.x, bodyRegion.y + sectionHeight - 2, bodyRegion.width + 2, 6) );

					bodyRegion.y += sectionHeight - 4;
					bodyRegion.height -= (sectionHeight - 4);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				case '<header>':
					endMatch = /<\/header>/.exec( text );
				
					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';
							
						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
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

					bodyRegion.y += 8;
					bodyRegion.height -= 8;

					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness') * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

					bodyRegion.y += sectionHeight - 12;
					bodyRegion.height -= (sectionHeight - 12);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				default:	//	<box...>
					let res = ( /boxres/.exec( startMatch[0] ) != null );
					let interlude = ( /boxint/.exec( startMatch[0] ) != null );
					let header = ( /header/.exec( startMatch[0] ) != null );
					let bracket = ( /bracket/.exec( startMatch[0] ) != null );

					if ( res ) endMatch = /<\/boxres>/.exec( text );
					else if ( interlude ) {
						endMatch = /<\/boxint>/.exec( text );
						header = null;
						bracket = null;
					}
					else endMatch = /<\/boxsa>/.exec( text );

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );
					
						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';
										
						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {					
						let len = (res || interlude) ? 9 : 8;
						
						specialText = text.slice( startMatch.index, endMatch.index + len );
						postSpecialText = text.slice( endMatch.index + len );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					let headerHeight = 0;
					if ( header ) {
						headerHeight = res ? 80 : 47;
					}

					let boxRegion = new Region( bodyRegion.x - 7, bodyRegion.y, bodyRegion.width + 36, bodyRegion.height );
					
					if ( interlude ) {
						boxRegion.x += 5;
						boxRegion.width -= 7;
						
						bodyRegion.y += 5;
						bodyRegion.height -= 10;
					}

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
					
					textRegion.x = bodyRegion.x;
					textRegion.y = bodyRegion.y;
					textRegion.width = bodyRegion.width;
					textRegion.height = bodyRegion.height;
					
					if ( interlude ) {
						textRegion.width += 5;
					}

					bodyBox.markupText = specialText;
					sectionHeight = bodyBox.measure( g, textRegion );

					if (interlude) {
						let inset = 24;
						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );

						textRegion.height = sectionHeight + 2;

						// test again, sectionHeight may have increased by a line because of the CupShape
						let newSectionHeight = bodyBox.measure( g, textRegion );
						while (newSectionHeight > sectionHeight) {
							sectionHeight = newSectionHeight;
							bodyBox.setPageShape( new PageShape.CompoundShape(
								new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
								bodyRegion.y + sectionHeight - 12,
								new PageShape.InsetShape(inset, inset)
								) );
							
							textRegion.height = sectionHeight + 2;
							newSectionHeight = bodyBox.measure( g, textRegion );						
							}
					
						// test again if it shrunk again, means with the indents it doesn't fit, but without the indents, 
						// it doesn't need the extra line.  Shrink the indents.
						if (newSectionHeight < sectionHeight) {
							sectionHeight = newSectionHeight;

							do {							
								inset -= 4;
						
								bodyBox.setPageShape( new PageShape.CompoundShape(
									new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
									bodyRegion.y + sectionHeight - 12,
									new PageShape.InsetShape(inset, inset)
									) );
							
								textRegion.height = sectionHeight + 2;
								newSectionHeight = bodyBox.measure( g, textRegion );
							} while (newSectionHeight > sectionHeight && inset > 0);						
						}
				
						sectionHeight = newSectionHeight;
						if (interlude && sectionHeight < 60) sectionHeight = 60;
						textRegion.height = sectionHeight + 2;
					
						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );
					}
				
					let boxTopImage;
					let boxBottomImage;

					let boxType = 'SA';
					if ( res ) boxType = 'Res';
					else if ( interlude ) boxType = 'Int';

					if ( bracket && !interlude ) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
					else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');
						
					if ( interlude || endMatch == bracket) boxBottomImage = boxTopImage;
					else if ( endMatch ) boxBottomImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
					else boxBottomImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');
					
					let ar = boxTopImage.height / boxTopImage.width;

					sheet.paintImage( g, boxTopImage, 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, boxRegion.width * ar ) );
					
					boxRegion.y += boxRegion.width * ar;
					boxRegion.height -= boxRegion.width * ar;
					
					let minHeight = 84;
					if ( interlude ) minHeight = 60;
					
					if ( sectionHeight + headerHeight > minHeight ) {
						sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Line.png'), 
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, sectionHeight + headerHeight - minHeight ) );
					}
					
					if ( sectionHeight + headerHeight < minHeight ) sectionHeight = minHeight - headerHeight;
					boxRegion.y += sectionHeight + headerHeight;
					boxRegion.height -= ( sectionHeight + headerHeight );

					ar = boxBottomImage.height / boxBottomImage.width;

					sheet.paintImage( g, ImageUtils.mirror( boxBottomImage, false, true ), 
						new Region( boxRegion.x, boxRegion.y - minHeight, boxRegion.width, boxRegion.width * ar) );

					// draw header
					if ( header ) {						
						if ( res ) {
							let headerRegion = new Region2D( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
							
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							headerBox.markupText = #AHLCG-Scenario-Header1;
																					
							let height = headerBox.measure( g, headerRegion );
							let width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
					
							headerRegion.y += height;
							
							headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

							height += headerBox.measure( g, headerRegion );
							let width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;
							
							let headerWidth = Math.max( width1, width2 );
							
							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
								new Region( headerRegion.x + (headerRegion.width - headerWidth)/ 2, bodyRegion.y + height, headerWidth, 6) );
						}
						else {
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SAHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Standalone + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'), 
								new Region( bodyRegion.x + (bodyRegion.width - width)/ 2, bodyRegion.y + height - 2, width, 6) );
						}

						bodyRegion.y += headerHeight;
						bodyRegion.height -= headerHeight;
					}
					
					textRegion.y = bodyRegion.y;
					textRegion.height = bodyRegion.height;

					// draw main box text
					if ( res ) bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResBullet-style'), null) );
					else bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SABullet-style'), null) );
/*					
					// draw box
					g.setPaint(Color.blue);
					g.draw(new Rectangle(bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height));
					g.setPaint(Color.red);
					g.draw(new Rectangle(textRegion.x, textRegion.y, textRegion.width, textRegion.height));
*/					
					bodyBox.draw( g, textRegion );
					bodyBox.markupText = '';

					bodyRegion.x -= 34;
					bodyRegion.width += 48;

//					if ( interlude ) bodyRegion.width -= 5;

					bodyRegion.y += sectionHeight + 55;
					bodyRegion.height -= (sectionHeight + 55);

					text = postSpecialText;
					
					bodyBox.setPageShape(null);
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

// header = story/chaos
function drawChaosBody( g, diy, sheet, textBoxes, headerBox, y ) {
	var tokenName = [ 'Skull', 'Cultist', 'Tablet', 'ElderThing' ];
	var faceIndex = sheet.getSheetIndex();
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Header-region' ) );
//	var trackingHeader = $( 'TrackerBox' + BindingSuffixes[faceIndex] );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var difference = y - region.y;
	if ( difference < 0 ) difference = 0;
	else {
		region.y = y;
		region.height -= difference;
	}
	
	if ( headerBox ) {
		difference = y - headerRegion.y;

		if ( $TrackerBox.length == 0 ) difference += 12;
		else difference += 2;
		
		headerRegion.y += difference;
		headerRegion.height -= difference;

		headerBox.markupText = $HeaderBack;
		
		let newY = headerBox.draw( g, headerRegion );
		let dy = newY - region.y;

		if ( $TrackerBox.length == 0 ) difference = 15;
		else difference = 5;
			
		region.y = newY + difference;
		region.height -= dy + difference;
	}
	
	var iconRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyIcon-region' ) );

	if ( $TrackerBox.length > 0 ) {
//			region.height -= 95;
			region.height -= 90;
	}

//g.setPaint(Color.WHITE);
//g.drawRect(region.x, region.y, region.width, region.height);

	var tokenRegion = [];
	var tokenText = [];
	var tokenHeight = [];
	var tokenSpacing = [ 0, 0, 0, 0 ];
	var tokenIcon = [];
	var tokenGroup = [ 1, 2, 3, 4 ];
	var tokensInGroup = [ 0, 0, 0, 0 ];

	var minHeight;
	var minCenterSpacing;
	var minSpacing;
	var maxSpacing;
	var useOffsetPct;
	
	if ( $TrackerBox.length > 0 ) {
		minHeight = [ 48, 100, 152, 204 ];
		minCenterSpacing = [ 115, 82, 68, 52 ];
		minSpacing = 7;
		maxSpacing = 62;
		useOffsetPct = 0.6;
	}
	else {
		minHeight = [ 48, 100, 152, 204 ];
		minCenterSpacing = [ 115, 102, 85, 65 ];
		minSpacing = 15;
		maxSpacing = 62;
		useOffsetPct = 0.6;
	}
		
	var index = 0;
	var mergeIndex = 0;
//	var startingOffset = 0;

	// eliminate tokens with no text
	for ( let i = 0; i < 4; i++ ) {
		let fieldName = tokenName[i] + BindingSuffixes[faceIndex];
		let text = $( fieldName );
		
		if ( text.length() <= 0 ) tokenGroup[i] = 15;	// invalid
	}
	
	// divide into groups
	for ( let i = 0; i < 4; i++ ) {
		let fieldName = tokenName[i] + BindingSuffixes[faceIndex];
		let text = $( fieldName );
		let spacing = $( fieldName + 'Spacing' );
		let merge = $( 'Merge' + fieldName );

		if ( merge != 'None' ) {
			for ( let j = 0; j < 4; j++ ) {
				if ( merge == tokenName[j] ) {
					let minGroup = Math.min( tokenGroup[i], tokenGroup[j] );
					
					tokenGroup[i] = minGroup;
					tokenGroup[j] = minGroup;
				}
			}	
		}
	}
	
	// minimize the group numbers
	var groupCount = 0;
	for ( let group = 1; group <= 4; group++ ) {
		let inGroup = 0;
		for ( let i = group-1; i < 4; i++) {
			if ( tokenGroup[i] == group ) inGroup++;
		}
		
		if (inGroup == 0) {
			let found = false;
			for ( let i = 0; i < 4; i++) {
				if ( tokenGroup[i] > group && tokenGroup[i] <= 4 ) {
					tokenGroup[i]--;
					found = true;
				}
			}
		
			if ( found ) group--;	// look at the current index again
		}
		else {
			tokensInGroup[group-1] = inGroup;
			groupCount++;
		}
	}

	var numTokens = 0;
	for ( let i = 0; i < 4; i++ ) {
		if ( tokenGroup[i] > 0 && tokenGroup[i] <= 4 ) numTokens++;
	}
	
	// help everything fit
	if ( $TrackerBox.length > 0 && numTokens > 3) {
		region.y -= 5;
		minSpacing = 1;
	}

	var heightSum = 0;
	for ( let i = 1; i <= 4; i++ ) {		// group
		for ( let j = 0; j < 4; j++) {	// token
			if ( tokenGroup[j] == i ) {
				let fieldName = tokenName[j] + BindingSuffixes[faceIndex];
				let text = $( fieldName );
				let spacing = $( fieldName + 'Spacing' );
		
				// we will print the first defined text string for a grouping
				if ( text.length() > 0 && tokenText[i-1] == null ) {
					tokenRegion[i-1] = new Region(region);
					tokenText[i-1] = text;
					
					if (spacing != null && spacing.length() > 0) {
						tokenSpacing[i-1] = parseInt($( fieldName + 'Spacing'), 0);
					}
				}

				tokenIcon[j] = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Chaos' + tokenName[j] + '.png');
			}
		}
	}

	var totalHeight = 0;
	var totalEqualSpacingHeight = 0;
	var maxEqualCenterSpacing = 0;
	var firstBlockOffset = 0;
	
	for (let i = 0; i < groupCount; i++) {
		// if we don't use a separate box, it draws twice, another thing I don't really understand
		let Test_box = markupBox(sheet);
		Test_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'Body-style'), null);
		Test_box.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Body-alignment'));
		Test_box.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
		Test_box.setTextFitting( FIT_SCALE_TEXT );	

		Test_box.markupText = tokenText[i];
		tokenHeight[i] = Test_box.measure( g, tokenRegion[i] );

		// if there's a tracking box, this lets the icon extend up above the normal region top, so the text is at the top of the region, to save space
		if ( !headerBox && i == 0 && tokenHeight[i] < iconRegion.height ) {
			firstBlockOffset = (iconRegion.height - tokenHeight[i]) / 2;
			if (firstBlockOffset > 10) firstBlockOffset = 10;
		}

		if (tokenHeight[i] < minHeight[tokensInGroup[i]-1]) tokenHeight[i] = minHeight[tokensInGroup[i]-1];

		totalHeight += tokenHeight[i];
	}

	if ( $TrackerBox.length > 0 || headerBox ) firstBlockOffset = 0;

	// calculate the maximum spacing between box centers
	if ( groupCount > 1 ) {
		for ( let i = 0; i < groupCount-1; i++ ) {
			let spacing = (tokenHeight[i] + tokenHeight[i+1]) / 2;
		
			if ( spacing > maxEqualCenterSpacing ) maxEqualCenterSpacing = spacing;
		}

		if ( maxEqualCenterSpacing < minCenterSpacing[groupCount-1] ) maxEqualCenterSpacing = minCenterSpacing[groupCount-1];
		totalEqualHeight = (maxEqualCenterSpacing + minSpacing)*(groupCount-1) + (tokenHeight[0] + tokenHeight[groupCount-1]) / 2;
	}
	else {
		maxEqualCenterSpacing = tokenHeight[0];
		totalEqualHeight = tokenHeight[0];
	}

	var spacingType = 1;	// 0 = center, 1 = top/bottom

	if ( totalEqualHeight <= region.height ) {
		spacingType = 0;

		totalHeight = totalEqualHeight;
		
		if (totalHeight <= region.height*useOffsetPct)
			region.y += (region.height - totalEqualHeight) * 0.35;
	}
	else {
		totalHeight += minSpacing * (groupCount-1);
	}
	
	var scale = 1.0;	

	// if rescaling needed, we're going to keep decreasing scale until it fits
	// just calculating a ratio and using that significantly overestimated the reduction of scale needed
	if (region.height < totalHeight) {
		if ( !headerBox ) {
			region.y -= 5;
			region.height += 5;
			region.y -= firstBlockOffset;
			region.height += firstBlockOffset;
		}

		var minTotalHeight = 0;
		for ( let i = 0; i < groupCount; i++ ) {
			minTotalHeight += minHeight[tokensInGroup[i]-1];
		}
		minTotalHeight += minSpacing * (groupCount-1);

		if ( region.height < minTotalHeight ) {
			region.height = minTotalHeight;
		}
		
		do {
			scale -= 0.05;

			totalHeight = 0;
			for (let i = 0; i < groupCount; i++) {
				let Test_box = markupBox(sheet);
				Test_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'Body-style'), null);
				Test_box.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Body-alignment'));
				Test_box.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
				Test_box.setTextFitting( FIT_SCALE_TEXT );	

				Test_box.markupText = Test_box.markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
				tokenHeight[i] = Test_box.measure( g, tokenRegion[i] );

				if (tokenHeight[i] < minHeight[tokensInGroup[i]-1]) tokenHeight[i] = minHeight[tokensInGroup[i]-1];

				totalHeight += tokenHeight[i];
			}
			
			totalHeight += minSpacing * (groupCount-1);
		} while (region.height < totalHeight && scale > 0.1);
	}

	if (scale > 1) scale = 1;
	else if (scale < 0.5) scale = 0.5;
	
	var yOffset;

	if (spacingType == 0) {
		yOffset = region.y + (tokenHeight[0]*scale) / 2;
	
		for (let i = 0; i < groupCount; i++) {		
			yIconMin = 1000;
			yIconMax = 0;

			tokenRegion[i].y = yOffset - tokenHeight[i] / 2;
			tokenRegion[i].height = tokenHeight[i];

			if (tokensInGroup[i] > 1) {
				tokenRegion[i].x += 8;
				tokenRegion[i].width -= 8;				
			}
			else {
				tokenRegion[i].x = region.x;
				tokenRegion[i].width = region.width;
			}
		
			if (scale < 1) textBoxes[i].markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
			else textBoxes[i].markupText = tokenText[i];
		
//g.setPaint(Color.BLUE);
//g.drawRect(tokenRegion[i].x, tokenRegion[i].y, 250, tokenRegion[i].height);
			modifiedRegion = new Region( tokenRegion[i].x, tokenRegion[i].y, tokenRegion[i].width, tokenRegion[i].height );

			if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) modifiedRegion.y -= 2;
			
			textBoxes[i].draw( g, modifiedRegion );

			let tokenIndex = 0;
			for ( let j = 0; j < 4; j++ ) {				// token				
				if ( tokenGroup[j] == i+1 ) {
					let iconY = tokenRegion[i].y + tokenRegion[i].height/2 - iconRegion.height*tokensInGroup[i]/2 + tokenIndex*iconRegion.height + 1;

					if (iconY + 1 < yIconMin) yIconMin = iconY + 1;
					if (tokenRegion[i].y < yIconMin) yIconMin = tokenRegion[i].y;
					if (iconY + iconRegion.height - 3 > yIconMax) yIconMax = iconY + iconRegion.height - 3;
					if (tokenRegion[i].y + tokenRegion[i].height > yIconMax) yIconMax = tokenRegion[i].y + tokenRegion[i].height;			
//g.setPaint(Color.GREEN);
//g.drawRect(iconRegion.x, iconY, iconRegion.width, iconRegion.height);
					sheet.paintImage( g, tokenIcon[j], 
						 new Region( iconRegion.x, iconY, iconRegion.width, iconRegion.height ) );
					 
					tokenIndex++;
				}
			}

			// draw vertical lines
			if (tokensInGroup[i] > 1) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/Lines.png'), 
					new Region( iconRegion.x + iconRegion.width + 2, yIconMin, 3, yIconMax - yIconMin) );
			}

			yOffset += minSpacing + maxEqualCenterSpacing*scale;
		}
	}
	else {
		yOffset = region.y;

		for (let i = 0; i < groupCount; i++) {
			yIconMin = 1000;
			yIconMax = 0;

			tokenRegion[i].y = yOffset;
			tokenRegion[i].height = tokenHeight[i];
		
			if (tokensInGroup[i] > 1) {
				tokenRegion[i].x += 8;
				tokenRegion[i].width -= 8;				
			}
			else {
				tokenRegion[i].x = region.x;
				tokenRegion[i].width = region.width;
			}

			if (scale < 1) textBoxes[i].markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
			else textBoxes[i].markupText = tokenText[i];
//g.setPaint(Color.RED);
//g.drawRect(tokenRegion[i].x, tokenRegion[i].y, tokenRegion[i].width, tokenRegion[i].height);

			textBoxes[i].draw( g, tokenRegion[i] );

			let tokenIndex = 0;
			for ( let j = 0; j < 4; j++ ) {				// token
				if ( tokenGroup[j] == i+1 ) {
					let iconY = tokenRegion[i].y + tokenRegion[i].height/2 - iconRegion.height*tokensInGroup[i]/2 + tokenIndex*iconRegion.height + 1;
					
					if (iconY + 1 < yIconMin) yIconMin = iconY + 1;
					if (tokenRegion[i].y < yIconMin) yIconMin = tokenRegion[i].y;
					if (iconY + iconRegion.height - 3 > yIconMax) yIconMax = iconY + iconRegion.height - 3;
					if (tokenRegion[i].y + tokenRegion[i].height > yIconMax) yIconMax = tokenRegion[i].y + tokenRegion[i].height;			

//g.setPaint(Color.GREEN);
//g.drawRect(iconRegion.x, iconY, iconRegion.width, iconRegion.height);
					sheet.paintImage( g, tokenIcon[j], 
						 new Region( iconRegion.x, iconY, iconRegion.width, iconRegion.height ) );
					 
					tokenIndex++;
				}
			}

			// draw vertical lines
			if (tokensInGroup[i] > 1) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/Lines.png'), 
					new Region( iconRegion.x + iconRegion.width + 2, yIconMin, 3, yIconMax - yIconMin) );
			}

			yOffset += minSpacing + tokenHeight[i];
		}
	}
}

function drawChaosTrackerBox( g, diy, sheet, box ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'TrackerBox-region') );
	var image = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-ChaosTrackerBox.png');
	
	var w = image.getWidth();
	var h = image.getHeight();
	
	sheet.paintImage( g, image, region );
	
//	box.markupText = $( 'TrackerBox' + BindingSuffixes[faceIndex] );
	box.markupText = $TrackerBox;
	box.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'TrackerName-region') ) );
}

function drawScenarioBody( g, diy, sheet, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();

	var showTitle = false;
	var region;
			
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );	
	bodyBox.setTextFitting( FIT_SCALE_TEXT );	

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
		
	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	bodyBox.markupText = $( 'Rules' + BindingSuffixes[faceIndex] );

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawVictory( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	Victory_box.markupText = '<b>' + $( 'Victory' + BindingSuffixes[faceIndex] ) + '</b>';
	Victory_box.draw( g, diy.settings.getRegion( getExpandedKey( faceIndex, 'Victory-region') ) );
}

function drawArtist( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var artistText = $( 'Artist' + BindingSuffixes[faceIndex] );

	if ( artistText.length() > 0 ) {
		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Artist-region' ) );
		if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );
		if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

		Artist_box.markupText = #AHLCG-IllustratorShort + ' ' + artistText;
		Artist_box.drawAsSingleLine( g, region );
	}
}

function drawCopyright( g, diy, sheet, collectorX ) {
	var faceIndex = sheet.getSheetIndex();
	
	var copyright = $Copyright;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Copyright-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	// x = left edge of region, using collectorX
	var x = collectorX - region.width;

	// we want the leftmost (if more space is being taken up because of Threads-like numbers)
	if (x < region.x) region.x = collectorX - region.width;	

	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	Copyright_box.markupText = copyright;
	var width = Copyright_box.drawAsSingleLine( g, region );
	
	return region.x - width;
}

// draws collection, encounter, and copyright info, keeps track of offset because of Threads of Fate style regions
function drawCollectorInfo( g, diy, sheet, collectionNumber, collectionSuffix, encounterNumber, encounterIcon, artistName ) {	
	var faceIndex = sheet.getSheetIndex();

	var collectorX = sheet.getTemplateWidth();
	
	if ( collectionNumber ) {
		collectorX = drawCollectionNumber( g, diy, sheet, collectionSuffix );
		collectorX -= 3;
	}

	collectorX = drawCollectionIcon( g, diy, sheet, collectorX );
	collectorX -= 11;
	
	if ( encounterIcon ) {
		drawEncounterIcon( g, diy, sheet );
	}
	
	if ( encounterNumber ) {
		collectorX = drawEncounterInfo( g, diy, sheet, collectorX );
		collectorX -= 20;
	}
	
	collectorX = drawCopyright( g, diy, sheet, collectorX );
	
	if ( artistName ) drawArtist( g, diy, sheet );
}

function drawSubtype( g, diy, sheet, box, text ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Subtype-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;
	
	box.markupText = text.toUpperCase();
	box.draw( g, region );
}

function drawCost( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var cost = $( 'ResourceCost' + BindingSuffixes[faceIndex] );
	var costRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Cost-region' ) );

	if ( cost == '-' ) {
		if ( CardTypes[ faceIndex ] == 'AssetStory' )
			drawDash( g, diy, sheet, costRegion, 0, -2 );
		else if ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness' )
			drawDash( g, diy, sheet, costRegion, 0, 0 );
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

	for ( let index = 1; index <= 5; index++ ) {
		let skillName = $( 'Skill' + index + BindingSuffixes[faceIndex] );

		if ( skillName != 'None' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillBox-' + getClassInitial( className ) + '.png'), 
				diy.settings.getRegion( getExpandedKey( faceIndex, 'Skill' + index + '-region' ) ) );	

			if ( className == 'Weakness' || className == 'BasicWeakness' ) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillIcon-' + getSkillInitial( String(skillName) ) + 'W.png'), 
					diy.settings.getRegion( getExpandedKey( faceIndex, 'SkillIcon' + index + '-region') ) );
			}
			else {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillIcon-' + getSkillInitial( String(skillName) ) + '.png'), 
					diy.settings.getRegion( getExpandedKey( faceIndex, 'SkillIcon' + index + '-region') ) );
			}
		}
	}
}

function drawSlots( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var slotName1 = $( 'Slot' + BindingSuffixes[ faceIndex] );
	var slotName2 = $( 'Slot2' + BindingSuffixes[ faceIndex] );

	if (slotName2 != 'None' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName1 + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot2' + '-region' ) ) );	
		
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName2 + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot-region' ) ) );	
	}
	else if (slotName1 != 'None' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName1 + '.png'), 
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot-region' ) ) );	
	}
}

function drawSkills( g, diy, sheet, boxArray, nameArray ) {
	var faceIndex = sheet.getSheetIndex();
	var skillBox;
	
	for ( let i = 0; i < boxArray.length; i++ ) {
		skillBox = boxArray[i];
		
		// can't make this work without creating a new box
		// otherwise, you have to edit the text for the color change to happen
		if ( $CardClass != null && $CardClass.indexOf('Parallel') >= 0) {
			skillBox = markupBox(sheet);
			skillBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ParallelSkill-style'), null);
			skillBox.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Skill-alignment'));	
		}

		skillBox.markupText = $( nameArray[i] + BindingSuffixes[faceIndex] );
		
		skillBox.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, nameArray[i] + '-region' ) ) );
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

function drawCollectionNumber( g, diy, sheet, drawSuffix ) {
	var faceIndex = sheet.getSheetIndex();

	var collectionNumber = $( 'CollectionNumber' + BindingSuffixes[faceIndex] );
	if (collectionNumber == null) collectionNumber = $CollectionNumber;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'CollectionNumber-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	Collection_box.markupText = collectionNumber;
	
	if (drawSuffix) {
		if (faceIndex == FACE_FRONT) Collection_box.markupText += 'a';
		else Collection_box.markupText += 'b';
	}
	
	var width = Collection_box.drawAsSingleLine( g, region );
	
	return region.x + region.width - width;	// return left edge
}

function drawCollectionIcon( g, diy, sheet, collectorX ) {
	var faceIndex = sheet.getSheetIndex();
	
	var iconName = $Collection;
	var icon;

	let region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultCollection-portrait-clip-region' ),
		// default - if no DefaultCollection defined, use normal Collection
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Collection-portrait-clip-region' ) ) );

	if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );	
	
	// x = left edge of region, using collectorX
	var x = collectorX - region.width;
	
	// we want the leftmost (if more space is being taken up because of Threads-like numbers)
	if (x < region.x) region.x = collectorX - region.width;	

	// resource
	if ( $CollectionType == '0' ) {
		icon = createInvertedImage( ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png') );
				
		sheet.paintImage( g, icon, region );		
	}
	// custom
	else {
		// [0] because that is the type the portrait is reading its setting from
		// [1] if it is a Story card, because the front side doesn't have a portrait... this was poorly planned
		let typeIndex = 0;
		if ( CardTypes[0] == 'Story' ) typeIndex = 1;
		
		diy.settings.setRegion( 'AHLCG-' + CardTypes[typeIndex] + '-Collection-portrait-clip-region', region );
		PortraitList[getPortraitIndex( 'Collection' )].paint( g, sheet.getRenderTarget() );
	}
	
	return region.x;
}

function drawEncounterInfo( g, diy, sheet, collectorX ) {
	var encounterNumber = $( 'EncounterNumber' + BindingSuffixes[faceIndex] );
	if (encounterNumber == null) encounterNumber = $EncounterNumber;

	var encounterTotal = $( 'EncounterTotal' + BindingSuffixes[faceIndex] );
	if (encounterTotal == null) encounterTotal = $EncounterTotal;

	if ( encounterNumber == '' && encounterTotal == '' ) return 0;

	var faceIndex = sheet.getSheetIndex();
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'EncounterNumber-region' ) );
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );	

	// x = left edge of region, using collectorX
	var x = collectorX - region.width;

	// we want the leftmost (if more space is being taken up because of Threads-like numbers)
	if (x < region.x) region.x = collectorX - region.width;	

	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	if ( Eons.namedObjects.AHLCGObject.OS == 'Mac' ) {
		Encounter_box.markupText = encounterNumber + '\u200a/\u200a' + encounterTotal;
	}
	else {
		Encounter_box.markupText = encounterNumber + ' / ' + encounterTotal;
	}
	
	var width = Encounter_box.drawAsSingleLine( g, region );

	return region.x + region.width - width;		// return left edge
}

function drawEncounterIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var iconName = $Encounter;
	var returnSet = false;
	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultEncounter-portrait-clip-region' ),
		// default - if no DefaultEncounter defined, use normal Encounter
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Encounter-portrait-clip-region' ) ) );
	
	if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) {
		region = reverseRegion( region );
//		region.x += 1;
	}
	
	if ( iconName.substring(0, 6) == 'Return') {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultReturnEncounter-portrait-clip-region' ),
			// default - if no DefaultReturnEncounter defined, use normal ReturnEncounter
			diy.settings.getRegion( getExpandedKey( faceIndex, 'ReturnEncounter-portrait-clip-region' ) ) );
		
		if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) {
			region = reverseRegion( region );
		}

		// special draw, doesn't use Return icon, fills space and removes the original icon
		if ( CardTypes[faceIndex] == 'Enemy' || CardTypes[faceIndex] == 'WeaknessEnemy' || 
			 CardTypes[faceIndex] == 'Location' || CardTypes[faceIndex] == 'LocationBack' ||
			 CardTypes[faceIndex] == 'Treachery' || CardTypes[faceIndex] == 'WeaknessTreachery' ) {
		
			returnSet = true;
			iconName = iconName.substring(8);
			
			if ( iconName == 'ExtracurricularActivities' )
				iconName = 'ExtracurricularActivity';
			
			// resource
			if ( $EncounterType == '0' ) {
				sheet.paintImage( g, createReturnToImage( ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png') ), region );		
			}
			// custom
			else {
				// [0] because that is the type the portrait is reading its setting from
//				diy.settings.setRegion( 'AHLCG-' + CardTypes[0] + '-Encounter-portrait-clip-region', region );
//				PortraitList[getPortraitIndex( 'Encounter' )].paint( g, sheet.getRenderTarget() );

//				sheet.paintImage( g, createReturnToImage( PortraitList[getPortraitIndex( 'Encounter' )].getImage() ), region );		
			}
		}
		else {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png'), region );		
		}
	}
	else {
		// resource
		if ( $EncounterType == '0' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png'), region );		
		}
		// custom
		else {
			// [0] because that is the type the portrait is reading its setting from
			diy.settings.setRegion( 'AHLCG-' + CardTypes[0] + '-Encounter-portrait-clip-region', region );
			PortraitList[getPortraitIndex( 'Encounter' )].paint( g, sheet.getRenderTarget() );
		}
	}
}

function drawBasicWeaknessIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-BasicWeakness.png'), 
		diy.settings.getRegion( getExpandedKey( faceIndex, 'BasicWeaknessIcon-region' ) ) );
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
	
	if ( health == '-' ) {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		healthRegion.x += 5.0;
		healthRegion.y += 6.0;
			
		sheet.drawOutlinedTitle( g, '\u2014', healthRegion, Eons.namedObjects.AHLCGObject.costFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
	}
	else if (perInvestigator == '1') {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		let healthPerInvRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'PerInv-region' ) );
		
		if ( health == 'X' ) {
			healthRegion.x += 2;
			healthPerInvRegion.x += 2;
		}
		
		sheet.drawOutlinedTitle( g, health, healthRegion, Eons.namedObjects.AHLCGObject.enemyFont, 13.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );	
		sheet.drawOutlinedTitle( g, 'p', healthPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, 6.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
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

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Shroud-region' ) );
	var shroud = $( 'Shroud' + BindingSuffixes[faceIndex] );
		
	if ( shroud == 1 || shroud == 4 ) {
		region.x -= 2;
	}
	
	sheet.drawOutlinedTitle( g, $( 'Shroud' + BindingSuffixes[faceIndex] ), region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, new Color(0.996, 0.945, 0.859 ), new Color(0, 0, 0), 0, true );
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
	var asterisk = $( 'Asterisk' + BindingSuffixes[faceIndex] );
	var clues = $( 'Clues' + BindingSuffixes[faceIndex] );

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Clues-region' ) );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	if ( clues == '-' ) {
		drawDash( g, diy, sheet, region, 0, 6 );
	}
	else if ( perInvestigator == '1' ) {
		var perInvCluesRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'CluesPerInv-region' ) );
		var perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'PerInv-region' ) );

		if ( $Orientation == 'Reversed' ) {
			perInvCluesRegion = reverseRegion( perInvCluesRegion );
			perInvRegion = reverseRegion( perInvRegion );
			
			// flip positions
			perInvCluesRegion.x = region.x + ( (region.x + region.width) - (perInvCluesRegion.x + perInvCluesRegion.width) );
			perInvRegion.x = region.x + ( (region.x + region.width) - (perInvRegion.x + perInvRegion.width) );
		}

		let fontSize = 14.0;

		if ( clues == 'X' ) {
			perInvCluesRegion.x += 3;
			perInvRegion.x += 3;
		}
		else if ( clues == 1 ) {
			perInvRegion.x -= 4;
		}
		else if ( clues.length() > 1 ) {
			perInvRegion.x += 1;
			fontSize = 11.0;
		}	

		sheet.drawOutlinedTitle( g, clues, perInvCluesRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else if ( asterisk == '1' ) {
		let fontSize = 14.0;
		let regionXOffset = 7;
		let regionYOffset = 7;
		
		if ( clues == 1 ) {
			regionXOffset = 4;
		}
		if ( clues.length() > 1 ) {
			region.x -= 1;
			regionXOffset = 6;
			regionYOffset = 7;
			fontSize = 13.0;
		}

		region.x -= 4;
		sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
	
		let asteriskFont = new Font( Eons.namedObjects.AHLCGObject.bodyFamily, Font.ITALIC, 12.0 );

		region.x += regionXOffset + g.getFontMetrics(asteriskFont).stringWidth(clues);
		region.y += regionYOffset;
		sheet.drawOutlinedTitle( g, '*', region, asteriskFont, 12.0, 0.8, textColor, borderColor, 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, textColor, borderColor, 0, true );
	}			
}

function drawDoom( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	
	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var asterisk = $( 'Asterisk' + BindingSuffixes[faceIndex] );
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
	else if ( asterisk == '1' ) {
		let fontSize = 14.0;
		let regionXOffset = 7;
		let regionYOffset = 7;
		
		if ( doom == 1 ) {
			regionXOffset = 4;
		}
		if ( doom.length() > 1 ) {
			region.x -= 1;
			regionXOffset = 7;
			regionYOffset = 7;
			fontSize = 13.0;
		}

		region.x -= 4;
		sheet.drawOutlinedTitle( g, doom, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
	
		let asteriskFont = new Font( Eons.namedObjects.AHLCGObject.bodyFamily, Font.ITALIC, 12.0 );

		region.x += regionXOffset + g.getFontMetrics(asteriskFont).stringWidth(doom);
		region.y += regionYOffset;
		sheet.drawOutlinedTitle( g, '*', region, asteriskFont, 12.0, 0.8, textColor, borderColor, 0, true );
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
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	if ( $Orientation == 'Reversed' ) {
		region = reverseRegion( region );
		region.x -= 1;
	}

		text = text + $ScenarioDeckID;
			
	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
}

function drawScenarioIndexBack( g, diy, sheet, typeText, textBox ) {
	var faceIndex = sheet.getSheetIndex();
	var text = $ScenarioIndex;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'ScenarioIndex-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	text = typeText.toUpperCase() + ' ' + $ScenarioIndex + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
	textBox.markupText = '';
	textBox.markupText = text;
	var height = textBox.measure(g, region);
	textBox.markupText = '';

	if ( height < 15 ) {	// fits on one line
		textBox.markupText = text;
		textBox.draw( g, region );	
	}
	else {
		var lineHeight = region.height / 2;
	
		// first line
		region.height -= lineHeight;
	
		text = $ScenarioIndex + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 );
			
		textBox.markupText = typeText.toUpperCase();
		textBox.drawAsSingleLine( g, region );

		// second line
		region.y += lineHeight;

		textBox.markupText = text;
		textBox.drawAsSingleLine( g, region );
	}
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

function drawWatermark( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var image = null;	
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Watermark-portrait-clip-region' ) );

	if ( $EncounterType == '0' ) {
		image = ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + $Encounter + '.png');
		}
	// custom
	else {
		image = PortraitList[getPortraitIndex( 'Encounter' )].getImage();
	}

	var sizedImage = ImageUtils.resize( image, region.width, region.height );

	g.setComposite( AlphaComposite.SrcOver.derive(0.06) );
	g.drawImage( sizedImage, region.x, region.y, null );
}

