useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Asset', 'Asset' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Front', 'BackPortrait-Back', 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultCollection();

	diy.version = 10;
}

function setDefaults() {
	$Unique = '0';
	$Subtitle = '';
	$CardClass = 'Neutral';
	$ResourceCost = '0';
	$Level = 'None';
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
	
	$ShowCollectionNumberFront = '1';
	$ShowCollectionNumberBack = '1';
	
	//Back
	$UniqueBack = '0';
	$SubtitleBack = '';
	$CardClassBack = 'Neutral';
	$ResourceCostBack = '0';
	$LevelBack = 'None';
	$Skill1Back = 'None';
	$Skill2Back = 'None';
	$Skill3Back = 'None';
	$Skill4Back = 'None';
	$Skill5Back = 'None';
	
	$SlotBack = 'None';
	$StaminaBack = 'None';
	$SanityBack = 'None';
	
	$TraitsBack = '';
	$KeywordsBack = '';
	$RulesBack = '';
	$FlavorBack = '';
	$VictoryBack = '';
	
	$TraitsBackSpacing = '0';
	$KeywordsBackSpacing = '0';
	$RulesBackSpacing = '0';
	$FlavorBackSpacing = '0';
	
	$ArtistBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitleUnique( diy, bindings, true, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatsPanel = layoutAssetStats( bindings, FACE_FRONT );
	StatsPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitleUnique( diy, bindings, true, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatsPanel = layoutAssetStats( bindings, FACE_BACK );
	BackStatsPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatsPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatsPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );
	
	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, false, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, true, [0, 1], FACE_FRONT );
		
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
//	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

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
	BackLabel_box  = markupBox(sheet);
	BackLabel_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Label-style'), null);
	BackLabel_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Label-alignment'));

	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Name-alignment'));

	initBodyTags( diy, BackName_box );	

	BackSubtitle_box = markupBox(sheet);
	BackSubtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Subtitle-style'), null);
	BackSubtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Subtitle-alignment'));

	BackSubtype_box = markupBox(sheet);
	BackSubtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Subtype-style'), null);
	BackSubtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Subtype-alignment'));

	BackCost_box = markupBox(sheet);
	BackCost_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Cost-style'), null);
	BackCost_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Cost-alignment'));

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
//	BackBody_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

	initBodyTags( diy, BackBody_box );	
	
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
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );
	drawTemplate( g, sheet, $CardClass );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Asset );
	drawName( g, diy, sheet, Name_box );

	if ( $Subtitle.length > 0 ) drawSubtitle( g, diy, sheet, Subtitle_box, $CardClass, true );

	if ($CardClass == 'Weakness' ) {	
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-Weakness );
	}	
	else if ($CardClass == 'BasicWeakness' ) {	
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
	
	var collectionSuffix = false;
	if ( $ShowCollectionNumberFront == '1' && $ShowCollectionNumberBack == '1' ) collectionSuffix = true;

//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, true );

	drawCollectorInfo( g, diy, sheet, $ShowCollectionNumberFront == '1', collectionSuffix, false, false, true );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );
	drawTemplate( g, sheet, $CardClassBack );
	drawLabel( g, diy, sheet, BackLabel_box, #AHLCG-Label-Asset );
	drawName( g, diy, sheet, BackName_box );

	if ( $SubtitleBack.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, $CardClassBack, true );

	if ($CardClassBack == 'Weakness' ) {	
		drawSubtype( g, diy, sheet, BackSubtype_box, #AHLCG-Label-Weakness );
	}	
	else if ($CardClassBack == 'BasicWeakness' ) {	
		drawSubtype( g, diy, sheet, BackSubtype_box, #AHLCG-Label-BasicWeakness );
	}	
//	if ( $CardClassBack != 'Weakness' ) {
	else {
		drawLevel( g, diy, sheet, $CardClassBack );
	}
		
	drawCost( g, diy, sheet );

	drawSkillIcons( g, diy, sheet, $CardClassBack );
	drawSlot( g, diy, sheet );
	drawStamina( g, diy, sheet );
	drawSanity( g, diy, sheet );
	
	drawBody( g, diy, sheet, BackBody_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ) );

//	if ( $ArtistBack.length > 0 ) drawArtist( g, diy, sheet );
//	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
	var collectionSuffix = false;
	if ( $ShowCollectionNumberFront == '1' && $ShowCollectionNumberBack == '1' ) collectionSuffix = true;

//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, true );

	drawCollectorInfo( g, diy, sheet, $ShowCollectionNumberBack == '1', collectionSuffix, false, false, true );
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
		$Skill5Back = 'None';
	}
	if ( diy.version < 10 ) {
		$ShowCollectionNumberFront = '1';
		$ShowCollectionNumberBack = '1';
	}
	
	updateCollection();

	diy.version = 10;
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
