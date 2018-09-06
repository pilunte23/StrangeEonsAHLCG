useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Agenda', 'AgendaBack' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Front', 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size	
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );
	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();
	
	diy.version = 7;
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
		
	// back
	$TitleBack = '';

	$HeaderABack = '';
	$AccentedStoryABack = '';
	$RulesABack = '';
	$HeaderBBack = '';
	$AccentedStoryBBack = '';
	$RulesBBack = '';
	$HeaderCBack = '';
	$AccentedStoryCBack = '';
	$RulesCBack = '';

	$HeaderABackSpacing = '0';
	$AccentedStoryABackSpacing = '0';
	$HeaderBBackSpacing = '0';
	$AccentedStoryBBackSpacing = '0';
	$HeaderCBackSpacing = '0';
	$AccentedStoryCBackSpacing = '0';
		
	$ScaleModifier = '100';
		
	$Artist = '';
	$Copyright = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	// do this first, we need the portrait panels for the title listener
	var PortraitTabArray = layoutPortraitsWithPanels( diy, bindings, 'Portrait', null, true, false, false );
	var PortraitTab = PortraitTabArray[0];
	PortraitTabArray.splice( 0, 1 );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatPanel = layoutAgendaStats( diy, bindings, FACE_FRONT, PortraitTabArray );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitle( diy, bindings, false, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextTab = layoutText( bindings, [ 'AgendaStory', 'Rules' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextPanelA = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'A', FACE_BACK );
	BackTextPanelA.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' A)' );
	BackTextPanelA.editorTabScrolling = true;

	var BackTextPanelB = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'B', FACE_BACK );
	BackTextPanelB.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' B)' );
	BackTextPanelB.editorTabScrolling = true;

	var BackTextPanelC = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'C', FACE_BACK );
	BackTextPanelC.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' C)' );
	BackTextPanelC.editorTabScrolling = true;

	var scaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifier', scaleSpinner, [1] );

	var BackTextTab = new Grid();
	BackTextTab.editorTabScrolling = true;
	BackTextTab.place(BackTextPanelA, 'wrap, pushx, growx', BackTextPanelB, 'wrap, pushx, growx', BackTextPanelC, 'wrap, pushx, growx', @AHLCG-TextScale, 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left' );
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

//	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, [0], FACE_FRONT );
	
	var CollectionTab = new Grid();	
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, false, false, [0, 1], [0], FACE_FRONT );
	
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
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
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
	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));

	BackHeader_box = markupBox(sheet);
	BackHeader_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Header-style'), null);
	BackHeader_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Header-alignment'));
	BackHeader_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Header', '-tightness') + '-tightness') );	

	BackStory_box = markupBox(sheet);
	BackStory_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Story-style'), null);
	BackStory_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Story-alignment'));
	BackStory_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Story', '-tightness') + '-tightness') );	

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	

	initBodyTags( diy, BackStory_box );	
	initBodyTags( diy, BackBody_box );	

	BackIndex_box = markupBox(sheet);
	BackIndex_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'ScenarioIndex-style'), null);
	BackIndex_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'ScenarioIndex-alignment'));
	BackIndex_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'ScenarioIndex', '-tightness') + '-tightness') );	
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, '' );

	drawName( g, diy, sheet, Name_box );

	drawBody( g, diy, sheet, Body_box, new Array( 'AgendaStory', 'Rules' ) );

	drawDoom( g, diy, sheet );

	if ( $Artist.length > 0 ) drawArtist( g, diy, sheet );
	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
	drawCollectionIcon( g, diy, sheet );
	drawCollectionNumber (g, diy, sheet, false );

	drawEncounterIcon( g, diy, sheet );
	drawEncounterInfo( g, diy, sheet );
	
	drawScenarioIndexFront( g, diy, sheet, #AHLCG-Label-Agenda, Index_box );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );
	
	drawTemplate( g, sheet, '' );

	drawRotatedName( g, diy, sheet );

	drawIndentedStoryBody( g, diy, sheet, BackHeader_box, BackStory_box, BackBody_box );

	drawScenarioIndexBack( g, diy, sheet, #AHLCG-Label-Agenda, BackIndex_box );
	drawEncounterIcon( g, diy, sheet );	
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

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );

	if ( diy.version < 2 ) {
		$AccentedStoryABack = $AccentedStoryBack;
		$RulesABack = $RulesBack;
		$HeaderBBack = '';
		$AccentedStoryBBack = '';
		$RulesBBack = '';
		$HeaderCBack = '';
		$AccentedStoryCBack = '';
		$RulesCBack = '';

		$AccentedStoryABackSpacing = $AccentedStoryBackSpacing;
		$HeaderBBackSpacing = '0';
		$AccentedStoryBBackSpacing = '0';
		$HeaderCBackSpacing = '0';
		$AccentedStoryCBackSpacing = '0';
		
		$ScaleModifier = '100';
	}
	if ( diy.version < 4 ) {
		$PerInvestigator = '0';
	}
	if ( diy.version < 6 ) {
		$ScenarioDeckID = 'a';
		$Orientation = 'Standard';
	}
	if ( diy.version < 7 ) {
		$HeaderABack = '';
		$HeaderABackSpacing = '0';
	}
	
	updateCollection();
	updateEncounter();

	diy.version = 7;
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
