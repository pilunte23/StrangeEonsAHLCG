useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Treachery', 'BackPortrait' ];
const BindingSuffixes = [ '' ];

const PortraitTypeList = [ 'Portrait-Front', 'BackPortrait-Back', 'Collection-Front', 'Encounter-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();

	diy.version = 8;
}

function setDefaults() {
	$Traits = '';
	$Keywords = '';
	$Rules = '';
	$Flavor = '';
	$Victory = '';
	
	$TraitsSpacing = '0';
	$KeywordsSpacing = '0';
	$RulesSpacing = '0';
	$FlavorSpacing = '0';
	
	$Artist = '';
	$Copyright = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	var CopyrightPanel = layoutCopyright( bindings, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );
	
	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [0], FACE_FRONT );
	
	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, false, [0], [0], FACE_FRONT );
	
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

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

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
}

function createBackPainter( diy, sheet ) {
	// this won't be called because the default face style
	// is a plain (unpainted) card back [FaceStyle.PLAIN_BACK]
	// in fact, we could leave this function out altogether;
	// look out for this when writing your own scripts
	// (a do-nothing function will be created to stand in
	// for any missing DIY functions, so if one of your functions
	// doesn't seem to be getting called, check the spelling
	// carefully)
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, '' );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Treachery );
	drawName( g, diy, sheet, Name_box );

	drawBody( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ) );

//	drawCollectorInfo( g, diy, sheet, true, false, true, true, true );
	drawCollectorInfo( g, diy, sheet, Collection_box, false, Encounter_box, true, Copyright_box, Artist_box );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

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
