useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Agenda', 'Location' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Front', 'BackPortrait-Back', 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size	
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
	$ScenarioIndex = '1';
	$ScenarioDeckID = 'a';
	$Doom = '3';
	$PerInvestigator = '0';
	$Orientation = 'Standard';

	$AgendaStory = '';
	$Rules = '';
	
	$AgendaStorySpacing = '0';
		
	$Artist = '';
	$Copyright = '';

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
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	// do this first, we need the portrait panels for the title listener
	var PortraitTabArray = layoutPortraitsWithPanels( diy, bindings, 'Portrait', 'BackPortrait', true, false, true );
	var PortraitTab = PortraitTabArray[0];
	PortraitTabArray.splice( 0, 1 );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatPanel = layoutAgendaStats( diy, bindings, FACE_FRONT, PortraitTabArray );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitle( diy, bindings, true, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatPanel = layoutLocationBackStats( bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var BackConnectionsPanel = layoutConnections( bindings, [1], FACE_BACK );
	BackConnectionsPanel.setTitle( @AHLCG-Connections + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', BackConnectionsPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextTab = layoutText( bindings, [ 'AgendaStory', 'Rules' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

//	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, false, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [0, 1], FACE_FRONT );
	
	var CollectionTab = new Grid();	
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, false, false, [0, 1], [0, 1], FACE_FRONT );
	
	var EncounterTab = new Grid();
	EncounterTab.editorTabScrolling = true;
	EncounterTab.place( EncounterPanel, 'wrap, pushx, growx', EncounterImagePanel, 'wrap, pushx, growx' );
	EncounterTab.addToEditor(editor, @AHLCG-EncounterSet);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	updateReversableTextBoxShape( diy, $Orientation );

	initBodyTags( diy, Body_box );	
	
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

	Index_box = markupBox(sheet);
	Index_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ScenarioIndex-style'), null);
	Index_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'ScenarioIndex-alignment'));
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
//	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	
	createBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ) );

	initBodyTags( diy, BackBody_box );	
	
	// just going to use standard body style
	Victory_box = markupBox(sheet);
	Victory_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	Victory_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Victory-alignment'));
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, '' );

	drawName( g, diy, sheet, Name_box );

	drawBody( g, diy, sheet, Body_box, new Array( 'AgendaStory', 'Rules' ) );

	drawDoom( g, diy, sheet );

//	if ( $Artist.length > 0 ) drawArtist( g, diy, sheet );
//	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, true );

//	drawEncounterIcon( g, diy, sheet );	
//	drawEncounterInfo( g, diy, sheet );

	drawCollectorInfo( g, diy, sheet, true, true, true, true, true );
			
	drawScenarioIndexFront( g, diy, sheet, #AHLCG-Label-Agenda, Index_box );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );

	if ( $SubtitleBack.length > 0) drawSubtitleTemplate( g, sheet, '' );
	else drawTemplate( g, sheet, '' );
	drawLabel( g, diy, sheet, BackLabel_box, #AHLCG-Label-Location );
	drawName( g, diy, sheet, BackName_box );

	if ( $SubtitleBack.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, '', false );
	
	drawBody( g, diy, sheet, BackBody_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor' ) );

	drawVictory( g, diy, sheet );

//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, true );

	if ( $LocationIconBack != 'None' ) drawLocationIcon( g, diy, sheet, 'LocationIcon', true );

	drawShroud( g, diy, sheet );
	drawClues( g, diy, sheet );

	for ( let index = 1; index <= 6; index++) {
		drawLocationIcon( g, diy, sheet, 'Connection' + index + 'Icon', false );
	}

//	drawEncounterIcon( g, diy, sheet );	
//	drawEncounterInfo( g, diy, sheet );

//	if ( $ArtistBack.length > 0 ) drawArtist( g, diy, sheet );
//	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );	
	
	drawCollectorInfo( g, diy, sheet, true, true, true, true, true );
} 

function onClear() {
	setDefaults();
}

function createTextShape( textBox, textRegion, reverse ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var path = new java.awt.geom.Path2D.Double();

	var xPathPoints = new Array( 0.000, 0.000, 0.148, 0.148, 1.000, 1.000 );
	var yPathPoints = new Array( 0.000, 0.850, 0.850, 1.000, 1.000, 0.000 );

	var numPoints = xPathPoints.length;
	
	if ( reverse ) {
		// swap order and x-value
		for (let i = 0; i < numPoints / 2; i++) {
			let px = xPathPoints[i];
			let py = yPathPoints[i];
			
			xPathPoints[i] = 1.000 - xPathPoints[numPoints - i - 1];
			yPathPoints[i] = yPathPoints[numPoints - i - 1];
			
			xPathPoints[numPoints - i - 1] = 1.000 - px;
			yPathPoints[numPoints - i - 1] = py;
		}
	}
	
	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 1; i < numPoints; i++) {
		path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}

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

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );

	if ( diy.version < 4 ) {
		$PerInvestigator = '0';
	}
	if ( diy.version < 6 ) {
		$ScenarioDeckID = 'a';
		$Orientation = 'Standard';
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

	testDIYScript();
}
else {
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');
}
