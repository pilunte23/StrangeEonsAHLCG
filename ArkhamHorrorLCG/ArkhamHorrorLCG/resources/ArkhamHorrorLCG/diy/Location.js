useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

useLibrary('tints');

importClass( arkham.component.DefaultPortrait );
importClass(arkham.HSBPanel);

const CardTypes = [ 'Location', 'LocationBack' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Both', 'BackPortrait-Back', 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );
	
	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();

	diy.version = 8;
}

function setDefaults() {	
	// front
	$Subtitle = '';
	$Traits = '';
	$Keywords = '';
	$Rules = '';
	$Flavor = '';
	$Victory = '';
	
	$TraitsSpacing = '0';
	$KeywordsSpacing = '0';
	$RulesSpacing = '0';
	$FlavorSpacing = '0';
	
	$LocationIcon = 'Circle';
	$Connection1Icon =  'None';
	$Connection2Icon = 'None';
	$Connection3Icon = 'None';
	$Connection4Icon = 'None';
	$Connection5Icon = 'None';
	$Connection6Icon = 'None';

	$Artist = '';
	$Copyright = '';

	$Shroud = '1';
	$Clues = '1';
	$PerInvestigator = '1';
	$BackType = 'Standard';
	
	// back
	$TitleBack = '';
	$SubtitleBack = '';
	
	$TraitsBack = '';
	$KeywordsBack = '';
	$RulesBack = '';
	$FlavorBack = '';
	
	$TraitsBackSpacing = '0';
	$KeywordsBackSpacing = '0';
	$RulesBackSpacing = '0';
	$FlavorBackSpacing = '0';

	$LocationIconBack = 'Copy front';
	$Connection1IconBack = 'Copy front';
	$Connection2IconBack = 'Copy front';
	$Connection3IconBack = 'Copy front';
	$Connection4IconBack = 'Copy front';
	$Connection5IconBack = 'Copy front';
	$Connection6IconBack = 'Copy front';

	$ArtistBack = '';

	$PortraitShare = '1';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, true, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatPanel = layoutLocationStats( bindings, FACE_FRONT );
	var ConnectionPanel = layoutConnections( bindings, [0, 1], FACE_FRONT );	
	ConnectionPanel.setTitle( @AHLCG-Connections + ': ' + @AHLCG-Front );
	
	var BackTitlePanel = layoutTitle( diy, bindings, true, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackConnectionPanel = layoutConnections( bindings, [1], FACE_BACK );	
	BackConnectionPanel.setTitle( @AHLCG-Connections + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', ConnectionPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackConnectionPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );
	
	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, true, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [0, 1], FACE_FRONT );
	
	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, false, [0, 1], [0, 1], FACE_FRONT );
	
	var EncounterTab = new Grid();
	EncounterTab.editorTabScrolling = true;
	EncounterTab.place( EncounterPanel, 'wrap, pushx, growx', EncounterImagePanel, 'wrap, pushx, growx' );
	EncounterTab.addToEditor(editor, @AHLCG-EncounterSet);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	Subtitle_box = markupBox(sheet);
	Subtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtitle-style'), null);
	Subtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtitle-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );

	initBodyTags( diy, Body_box );	
	
	// just going to use standard body style
	Victory_box = markupBox(sheet);
	Victory_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Victory_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Victory-alignment'));
	Victory_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Victory', '-tightness') + '-tightness') );	

	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Artist-alignment'));

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Copyright-alignment'));

	initCopyrightTags( diy, Copyright_box );	

	Collection_box = markupBox(sheet);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'CollectionNumber-style'), null);
	Collection_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'CollectionNumber-alignment'));

	Encounter_box = markupBox(sheet);
	Encounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'EncounterNumber-style'), null);
	Encounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'EncounterNumber-alignment'));
}

function createBackPainter( diy, sheet ) {
	BackLabel_box  = markupBox(sheet);
	BackLabel_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Label-style'), null);
	BackLabel_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Label-alignment'));

	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));

	BackSubtitle_box = markupBox(sheet);
	BackSubtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtitle-style'), null);
	BackSubtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtitle-alignment'));

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	
	createBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ) );

	initBodyTags( diy, BackBody_box );	
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	if ( $Subtitle.length > 0) drawSubtitleTemplate( g, sheet, '' );
	else drawTemplate( g, sheet, '' );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Location );
	drawName( g, diy, sheet, Name_box );

	if ( $Subtitle.length > 0 ) drawSubtitle( g, diy, sheet, Subtitle_box, '', false );
	
	drawBody( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor' ) );

	drawVictory( g, diy, sheet );

	if ( $LocationIcon != 'None' ) drawLocationIcon( g, diy, sheet, 'LocationIcon', true );

	drawShroud( g, diy, sheet );
	drawClues( g, diy, sheet );

	for ( let index = 1; index <= 6; index++) {
		drawLocationIcon( g, diy, sheet, 'Connection' + index + 'Icon', false );
	}

	drawCollectorInfo( g, diy, sheet, true, false, true, true, true );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	if ( $BackType == 'Standard' ) {
		if ( $PortraitShare == '1' ) {
			PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );
		}
		else {
			PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );
		}

		if ( $SubtitleBack.length > 0) drawSubtitleTemplate( g, sheet, '' );
		else drawTemplate( g, sheet, '' );
		
		drawLabel( g, diy, sheet, BackLabel_box, #AHLCG-Label-Location );
		
		drawName( g, diy, sheet, BackName_box );

		if ( $SubtitleBack.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, '', false );

		drawCollectionIcon( g, diy, sheet );

		if ( $LocationIconBack != 'None' && !( $LocationIcon == 'None' && $LocationIconBack == 'Copy front' ) ) drawLocationIcon( g, diy, sheet, 'LocationIcon', true );

		drawBody( g, diy, sheet, BackBody_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor' ) );

		for ( let index = 1; index <= 6; index++) {
			drawLocationIcon( g, diy, sheet, 'Connection' + index + 'Icon', false );
		}

		drawEncounterIcon( g, diy, sheet );	

		// this is icky...
		if ( $Artist.length > 0 ) drawArtist( g, diy, sheet );
		if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );	

	}
	else {
		drawBackTemplate( g, sheet );
	}
}

function onClear() {
	setDefaults();
}

function createTextShape( textBox, textRegion ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var path = new java.awt.geom.Path2D.Double();

	// asymmetrical	
	var xPathPoints = new Array( 0.074, 0.000, 0.000, 1.000, 1.000, 0.951, 0.926 );
	var yPathPoints = new Array( 0.000, 0.174, 1.000, 1.000, 0.319, 0.125, 0.000 );
	
	var xControlPoints = new Array( 0.037, 0.107, 0.991, 0.962, 0.936, 0.970 );
	var yControlPoints = new Array( 0.153, 0.139, 0.278, 0.167, 0.132, 0.174 );
	
	var numPoints = xPathPoints.length;
	
	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	// just create by hand, it's asymmetrical
	path.curveTo( x + w * xControlPoints[0], y + h * yControlPoints[0],
		x + w * xControlPoints[1], y + h * yControlPoints[1],
		x + w * xPathPoints[1], y + h * yPathPoints[1]
	);
	
	for (let i = 2; i <= 4; i++) {
		path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
	}

	for (let i = 5; i <= 6; i++) {
		path.curveTo( x + w * xControlPoints[i*2 - 8], y + h * yControlPoints[i*2 - 8],
			x + w * xControlPoints[i*2 - 7], y + h * yControlPoints[i*2 - 7],
			x + w * xPathPoints[i], y + h * yPathPoints[i]
		);
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}

function createBackTextShape( textBox, textRegion ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

//	var xPathPoints = new Array( 0.151, 0.000, 0.000, 1.000, 1.000, 0.849 );
	var xPathPoints = new Array( 0.111, 0.000, 0.000, 1.000, 1.000, 0.889 );
	var yPathPoints = new Array( 0.000, 0.204, 1.000, 1.000, 0.204, 0.000 );
	
	var path = new java.awt.geom.Path2D.Double();

	var numPoints = xPathPoints.length;

	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 1; i < numPoints; i++) {
		path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}

function createVictoryTextShape( textBox, textRegion ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var xPathPoints = new Array( 0.000, 1.000, 1.000, 0.500, 0.000 );
	var yPathPoints = new Array( 0.000, 0.000, 1.000, 1.000, 0.500 );
//	var xPathPoints = new Array( 0.000, 1.000, 1.000 );
//	var yPathPoints = new Array( 0.000, 0.000, 1.000 );
	
	var path = new java.awt.geom.Path2D.Double();

	var numPoints = xPathPoints.length;

	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 1; i < numPoints; i++) {
		path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 3 ) {
		$BackType = 'Standard';
	}
	if ( diy.version < 4 ) {
		$SubtitleBack = '';
		if ( $BackType == null ) $BackType = 'Standard';
	}
	
	updateCollection();
	updateEncounter();
	
	diy.version = 8;
}

function onWrite( diy, oos ) {
	writePortraits( oos, PortraitTypeList );
}

// This is part of the diy library; calling it from within a
// script that defines the needed functions for a DIY component
// will create the DIY from the script and add it as a new editor;
// however, saving and loading the new component won't work correctly.
// This means you can test your script directly by running it without
// having to create a plug-in (except to make any required resources
// available).
if( sourcefile == 'Quickscript' ) {
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-preferences.js' );

	testDIYScript();
}
else {
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-preferences.js');
}
