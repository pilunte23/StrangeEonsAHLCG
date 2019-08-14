useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Asset', 'AssetBack' ];
const BindingSuffixes = [ '' ];

const PortraitTypeList = [ 'Portrait-Front', 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.PLAIN_BACK;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultCollection();

	diy.version = 9;
}

function setDefaults() {
	$Unique = '0';
	$Subtitle = '';
	
	$CardClass = 'Guardian';
	$ResourceCost = '0';
	$Level = '0';
	$Skill1 = 'None';
	$Skill2 = 'None';
	$Skill3 = 'None';
	$Skill4 = 'None';
	$Skill5 = 'None';
	
	$Slot = 'None';
	$Stamina = 'None';
	$Sanity = 'None';
	
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

	var TitlePanel = layoutTitleUnique( diy, bindings, true, [0], FACE_FRONT );
	var StatsPanel = layoutAssetStats( bindings, FACE_FRONT );
	var CopyrightPanel = layoutCopyright( bindings, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatsPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );
	
	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [0], FACE_FRONT );
	
	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	

	Subtitle_box = markupBox(sheet);
	Subtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Subtitle-style'), null);
	Subtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Subtitle-alignment'));

	Subtype_box = markupBox(sheet);
	Subtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtype-style'), null);
	Subtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtype-alignment'));

	Cost_box = markupBox(sheet);
	Cost_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Cost-style'), null);
	Cost_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Cost-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * Eons.namedObjects.AHLCGObject.baseFontTightness );	
	
	initBodyTags( diy, Body_box );	
	
	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Artist-alignment'));

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Copyright-alignment'));
 
	initCopyrightTags( diy, Copyright_box );	

	Collection_box = markupBox(sheet);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'CollectionNumber-style'), null);
	Collection_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'CollectionNumber-alignment'));
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
	drawTemplate( g, sheet, $CardClass );
//	drawTemplate( g, sheet, 'Test' );

	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Asset );
	drawName( g, diy, sheet, Name_box );

	if ( $Subtitle.length > 0 ) drawSubtitle( g, diy, sheet, Subtitle_box, $CardClass, true );

	if ($CardClass == 'Weakness' ) {	
//		Subtype_box.markupText = #AHLCG-Label-Weakness.toUpperCase();
//		Subtype_box.draw( g, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Subtype-region' ) ) );
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-Weakness );
	}
	else if ($CardClass == 'BasicWeakness' ) {	
//		Subtype_box.markupText = #AHLCG-Label-BasicWeakness.toUpperCase();
//		Subtype_box.draw( g, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Subtype-region' ) ) );
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-BasicWeakness );
	}
//	if ( $CardClass != 'Weakness' ) {
	else {
		drawLevel( g, diy, sheet, $CardClass );
	}
		
	drawCost( g, diy, sheet );

	drawSkillIcons( g, diy, sheet, $CardClass );
	drawSlot( g, diy, sheet );
	drawStamina( g, diy, sheet );
	drawSanity( g, diy, sheet );
	
	drawBody( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ) );

//	if ( $Artist.length > 0 ) drawArtist( g, diy, sheet );
//	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, false );

	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
}

function paintBack( g, diy, sheet ) {
	// like createBackPainter(), this won't be called because of
	// the type of card we created
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );

	if ( diy.version < 9 ) {
		$Skill5 = 'None';
	}

	updateCollection();

	diy.version = 9;
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
