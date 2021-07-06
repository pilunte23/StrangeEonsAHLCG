useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Story', 'Location' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'BackPortrait-Back', 'Collection-Back', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();
	
	diy.version = 14;
}

function setDefaults() {
	// front
	$Template = 'Story';
	
	$TraitsA = '';
	$HeaderA = '';
	$AccentedStoryA = '';
	$RulesA = '';
	$HeaderB = '';
	$AccentedStoryB = '';
	$RulesB = '';
	$HeaderC = '';
	$AccentedStoryC = '';
	$RulesC = '';

	$TraitsASpacing = '0';
	$HeaderASpacing = '0';
	$AccentedStoryASpacing = '0';
	$HeaderBSpacing = '0';
	$AccentedStoryBSpacing = '0';
	$HeaderCSpacing = '0';
	$AccentedStoryCSpacing = '0';

	$Victory = '';
	$VictorySpacing = '0';
	
	$ScaleModifier = '100';

	// back
	$TitleBack = '';
	$SubtitleBack = '';
	
	$TraitsBack = '';
	$KeywordsBack = '';
	$RulesBack = '';
	$FlavorBack = '';
	$VictoryBack = '';
	
	$TraitsBackSpacing = '0';
	$KeywordsBackSpacing = '0';
	$RulesBackSpacing = '0';
	$FlavorBackSpacing = '0';

	$ShroudBack = '1';
	$CluesBack = '1';
	$PerInvestigatorBack = '1';

	$LocationIconBack = 'Circle';
	$Connection1IconBack = 'None';
	$Connection2IconBack = 'None';
	$Connection3IconBack = 'None';
	$Connection4IconBack = 'None';
	$Connection5IconBack = 'None';
	$Connection6IconBack = 'None';

	$ArtistBack = '';
	$Copyright = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatPanel = layoutStoryStats( bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitle( diy, bindings, true, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatPanel = layoutLocationBackStats( bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var BackConnectionsPanel = layoutConnections( bindings, [1], FACE_BACK );
	BackConnectionsPanel.setTitle( @AHLCG-Connections + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [1], FACE_BACK );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', BackConnectionsPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextPanelA = layoutText( bindings, [ 'Traits', 'Header', 'AccentedStory', 'Rules' ], 'A', FACE_FRONT );
	TextPanelA.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' A)' );
	TextPanelA.editorTabScrolling = true;

	var TextPanelB = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'B', FACE_FRONT );
	TextPanelB.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' B)' );
	TextPanelB.editorTabScrolling = true;

	var TextPanelC = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'C', FACE_FRONT );
	TextPanelC.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' C)' );
	TextPanelC.editorTabScrolling = true;

	var VictoryPanel = layoutVictoryText( bindings, FACE_FRONT );

	var scaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifier', scaleSpinner, [0] );

	var TextTab = new Grid();
	TextTab.editorTabScrolling = true;
	TextTab.place(
		TextPanelA, 'wrap, pushx, growx', 
		TextPanelB, 'wrap, pushx, growx', 
		TextPanelC, 'wrap, pushx, growx', 
		VictoryPanel, 'wrap, pushx, growx',
		@AHLCG-TextScale, 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left'
	);
	
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	PortraitTab = layoutPortraits( diy, bindings, null, 'BackPortrait', true, false, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [1], FACE_FRONT );
	
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
	// always use Story settings, Chaos doesn't have label or Story settings
	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Label-style', null);
	Label_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Label-alignment');

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	

	Traits_box = markupBox(sheet);
	Traits_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Traits_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
	Traits_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Header', '-tightness') + '-tightness') );	

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Header_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
	Header_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Header', '-tightness') + '-tightness') );	

	Story_box = markupBox(sheet);
	Story_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Story-style', null);
	Story_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Story-alignment');
	Story_box.setLineTightness( $('AHLCG-Story-Story-tightness') );	

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

	initBodyTags( diy, Traits_box );	
	initBodyTags( diy, Header_box );	
	initBodyTags( diy, Story_box );	
	initBodyTags( diy, Body_box );	

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Copyright-alignment'));
 
	initCopyrightTags( diy, Copyright_box );	
}

function createBackPainter( diy, sheet ) {
	BackLabel_box  = markupBox(sheet);
	BackLabel_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Label-style'), null);
	BackLabel_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Label-alignment'));

	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));

	BackSubtitle_box = markupBox(sheet);
	BackSubtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Subtitle-style'), null);
	BackSubtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Subtitle-alignment'));

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	
//	createBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ) );
	setBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ) );

	initBodyTags( diy, BackBody_box );	
	
	// just going to use standard body style
	Victory_box = markupBox(sheet);
	Victory_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	Victory_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Victory-alignment'));

	BackArtist_box = markupBox(sheet);
	BackArtist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Artist-style'), null);
	BackArtist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Artist-alignment'));

	BackCopyright_box = markupBox(sheet);
	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Copyright-style'), null);
	BackCopyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Copyright-alignment'));
 
	initCopyrightTags( diy, BackCopyright_box );	

	BackCollection_box = markupBox(sheet);
	BackCollection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'CollectionNumber-style'), null);
	BackCollection_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'CollectionNumber-alignment'));

	BackEncounter_box = markupBox(sheet);
	BackEncounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'EncounterNumber-style'), null);
	BackEncounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'EncounterNumber-alignment'));
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );
	
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	if ( $Template == 'Story' ) {
		drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Story );
		drawName( g, diy, sheet, Name_box );
	}
	else {
		if ( diy.name != '' ) y = drawChaosName( g, diy, sheet, Name_box );
	}

	drawIndentedStoryBody( g, diy, sheet, Traits_box, Header_box, Story_box, Body_box );

	drawEncounterIcon( g, diy, sheet );	
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );

	if ( $SubtitleBack.length > 0) drawSubtitleTemplate( g, sheet, '' );
	else drawTemplate( g, sheet, '' );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Location );
	drawName( g, diy, sheet, BackName_box );

	if ( $SubtitleBack.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, '', false );
	
	drawBody( g, diy, sheet, BackBody_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor' ) );

	drawVictory( g, diy, sheet );

	if ( $LocationIconBack != 'None' ) drawLocationIcon( g, diy, sheet, 'LocationIcon', true );

	drawShroud( g, diy, sheet );
	drawClues( g, diy, sheet );

	for ( let index = 1; index <= 6; index++) {
		drawLocationIcon( g, diy, sheet, 'Connection' + index + 'Icon', false );
	}

//	drawCollectorInfo( g, diy, sheet, true, false, true, true, true );
	drawCollectorInfo( g, diy, sheet, BackCollection_box, false, BackEncounter_box, true, BackCopyright_box, BackArtist_box );
}

function onClear() {
	setDefaults();
}
/*
function createBackTextShape( textBox, textRegion ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var path = new java.awt.geom.Path2D.Double();

	// asymmetrical	
	var xPathPoints = new Array( 0.154, 0.000, 0.000, 1.000, 1.000, 0.951, 0.846 );
	var yPathPoints = new Array( 0.000, 0.174, 1.000, 1.000, 0.319, 0.125, 0.000 );
	
	var xControlPoints = new Array( 0.107, 0.107, 0.991, 0.962, 0.936, 0.900 );
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
*/
function setBackTextShape( box, region ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	box.pageShape = AHLCGObject.getLocationTextShape( region );
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 5 ) {
		updateLocation( 'Back' );
	}

	if ( diy.version < 7 ) {
		$HeaderA = '';
		$HeaderASpacing = '0';
	}
	if ( diy.version < 12 ) {
		$TraitsA = '';
		$TraitsASpacing = '0';
	}
	if ( diy.version < 13 ) {
		$Victory = '';
		$VictorySpacing = '0';
	}
	if ( diy.version < 14 ) {
		$Template = 'Story';
	}

	updateCollection();
	updateEncounter();

	diy.version = 14;
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

	testDIYScript();
}
else {
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');
}
