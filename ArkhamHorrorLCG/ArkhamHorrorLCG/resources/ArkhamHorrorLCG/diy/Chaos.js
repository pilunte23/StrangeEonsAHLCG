useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Chaos', 'Chaos' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();

	diy.version = 6;
}

function setDefaults() {
	$Skull = '';
	$SkullSpacing = '0';
	$Cultist = '';
	$CultistSpacing = '0';
	$Tablet = '';
	$TabletSpacing = '0';
	$ElderThing = '';
	
	$SkullBack = '';
	$SkullBackSpacing = '0';
	$CultistBack = '';
	$CultistBackSpacing = '0';
	$TabletBack = '';
	$TabletBackSpacing = '0';
	$ElderThingBack = '';

	$Copyright = '';
	
	$MergeSkull = 'None';
	$MergeCultist = 'None';
	$MergeTablet = 'None';
	$MergeSkullBack = 'None';
	$MergeCultistBack = 'None';
	$MergeTabletBack = 'None';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0, 1], FACE_FRONT );
	var CopyrightPanel = layoutCopyright( bindings, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextTab = layoutChaosText( bindings, FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutChaosText( bindings, FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, [0, 1], FACE_FRONT );
	
	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, true, false, [0, 1], [0, 1], FACE_FRONT );
	
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

	Difficulty_box  = markupBox(sheet);
	Difficulty_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Difficulty-style'), null);
	Difficulty_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Difficulty-alignment'));

	Body_boxes = [];
	for ( let i = 0; i < 4; i++ ) {
		Body_boxes[i] = markupBox(sheet);
		Body_boxes[i].defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
		Body_boxes[i].alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
		Body_boxes[i].setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

		initBodyTags( diy, Body_boxes[i] );	
	}

	Copyright_box  = markupBox(sheet);
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
	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));
	initBodyTags( diy, BackName_box );	

	BackDifficulty_box  = markupBox(sheet);
	BackDifficulty_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Difficulty-style'), null);
	BackDifficulty_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Difficulty-alignment'));

	BackBody_boxes = [];
	for ( let i = 0; i < 4; i++ ) {
		BackBody_boxes[i] = markupBox(sheet);
		BackBody_boxes[i].defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
		BackBody_boxes[i].alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
		BackBody_boxes[i].setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	

		initBodyTags( diy, BackBody_boxes[i] );	
	}

	BackCopyright_box = markupBox(sheet);
	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Copyright-style'), null);
	BackCopyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Copyright-alignment'));

	initCopyrightTags( diy, BackCopyright_box );	
/*
	BackCollection_box = markupBox(sheet);
	BackCollection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'CollectionNumber-style'), null);
	BackCollection_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'CollectionNumber-alignment'));

	BackEncounter_box = markupBox(sheet);
	BackEncounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'EncounterNumber-style'), null);
	BackEncounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'EncounterNumber-alignment'));
*/
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );

	if ( diy.name != '' ) drawChaosName( g, diy, sheet, Name_box );
	drawDifficulty( g, diy, sheet, Difficulty_box, #AHLCG-Difficulty-Front );

	drawChaosBody( g, diy, sheet, Body_boxes );

	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
	drawCollectionIcon( g, diy, sheet );
	drawCollectionNumber ( g, diy, sheet, true );

	drawEncounterIcon( g, diy, sheet );		
	drawEncounterInfo( g, diy, sheet );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );

	if ( diy.name != '' ) drawChaosName( g, diy, sheet, BackName_box );
	drawDifficulty( g, diy, sheet, BackDifficulty_box, #AHLCG-Difficulty-Back );
	
	drawChaosBody( g, diy, sheet, BackBody_boxes );

	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
	drawCollectionIcon( g, diy, sheet );
	drawCollectionNumber ( g, diy, sheet, true );

	drawEncounterIcon( g, diy, sheet );		
	drawEncounterInfo( g, diy, sheet );
} 

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );

	updateCollection();
	updateEncounter();

	if ( diy.version < 6 ) {
		$MergeSkull = 'None';
		$MergeCultist = 'None';
		$MergeTablet = 'None';
		$MergeSkullBack = 'None';
		$MergeCultistBack = 'None';
		$MergeTabletBack = 'None';
	}

	diy.version = 6;
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
