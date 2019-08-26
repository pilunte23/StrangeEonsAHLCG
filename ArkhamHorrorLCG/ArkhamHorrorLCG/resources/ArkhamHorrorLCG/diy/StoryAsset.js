useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Story', 'AssetStory' ];
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
	
	diy.version = 10;
}

function setDefaults() {
	// front
	$HeaderA = '';
	$AccentedStoryA = '';
	$RulesA = '';
	$HeaderB = '';
	$AccentedStoryB = '';
	$RulesB = '';
	$HeaderC = '';
	$AccentedStoryC = '';
	$RulesC = '';

	$HeaderASpacing = '0';
	$AccentedStoryASpacing = '0';
	$HeaderBSpacing = '0';
	$AccentedStoryBSpacing = '0';
	$HeaderCSpacing = '0';
	$AccentedStoryCSpacing = '0';

	$ScaleModifier = '100';

	// back
	$UniqueBack = '0';
	$SubtitleBack = '';

	$Skill1Back = 'None';
	$Skill2Back = 'None';
	$Skill3Back = 'None';
	$Skill4Back = 'None';
	$Skill5Back = 'None';
	
	$CardClassBack = 'Neutral';
	$ResourceCostBack = '0';
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
	$Copyright = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitleUnique( diy, bindings, true, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatsPanel = layoutAssetStoryStats( bindings, FACE_BACK );
	BackStatsPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [1], FACE_BACK );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatsPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextPanelA = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'A', FACE_FRONT );
	TextPanelA.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' A)' );
	TextPanelA.editorTabScrolling = true;

	var TextPanelB = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'B', FACE_FRONT );
	TextPanelB.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' B)' );
	TextPanelB.editorTabScrolling = true;

	var TextPanelC = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'C', FACE_FRONT );
	TextPanelC.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' C)' );
	TextPanelC.editorTabScrolling = true;

	var scaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifier', scaleSpinner, [0] );

	var TextTab = new Grid();
	TextTab.editorTabScrolling = true;
	TextTab.place(TextPanelA, 'wrap, pushx, growx', TextPanelB, 'wrap, pushx, growx', TextPanelC, 'wrap, pushx, growx', @AHLCG-TextScale, 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left' );
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
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, false, false, [0, 1], [0, 1], FACE_FRONT );
	
	var EncounterTab = new Grid();
	EncounterTab.editorTabScrolling = true;
	EncounterTab.place( EncounterPanel, 'wrap, pushx, growx', EncounterImagePanel, 'wrap, pushx, growx' );
	EncounterTab.addToEditor(editor, @AHLCG-EncounterSet);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Label_box = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Header_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
//	Header_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Header', '-tightness') + '-tightness') );	

	Story_box = markupBox(sheet);
	Story_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Story-style'), null);
	Story_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Story-alignment'));
//	Story_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Story', '-tightness') + '-tightness') );	

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

	initBodyTags( diy, Story_box );	
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

	Encounter_box = markupBox(sheet);
	Encounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'EncounterNumber-style'), null);
	Encounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'EncounterNumber-alignment'));
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
//	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	

	initBodyTags( diy, BackBody_box );	
	
	BackArtist_box = markupBox(sheet);
	BackArtist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Artist-style'), null);
	BackArtist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Artist-alignment'));

	BackCopyright_box = markupBox(sheet);
	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Copyright-style'), null);
	BackCopyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Copyright-alignment'));
 
	initCopyrightTags( diy, BackCopyright_box );	
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Story );
	drawName( g, diy, sheet, Name_box );

	drawIndentedStoryBody( g, diy, sheet, Header_box, Story_box, Body_box );

	drawEncounterIcon( g, diy, sheet );	
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, $CardClassBack );
	drawLabel( g, diy, sheet, BackLabel_box, #AHLCG-Label-Asset );
	drawName( g, diy, sheet, BackName_box );

	if ( $SubtitleBack.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, 'Neutral', true );
	
	if ($CardClassBack == 'Weakness' ) {	
		drawSubtype( g, diy, sheet, BackSubtype_box, #AHLCG-Label-Weakness );
	}

	drawCost( g, diy, sheet );

	drawSkillIcons( g, diy, sheet, 'Neutral' );
		
	drawSlot( g, diy, sheet );
	drawStamina( g, diy, sheet );
	drawSanity( g, diy, sheet );
	
	drawBody( g, diy, sheet, BackBody_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ) );

//	if ( $ArtistBack.length > 0 ) drawArtist( g, diy, sheet );
//	if ( $Copyright.length > 0 ) drawCopyright( g, diy, sheet );
	
//	drawCollectionIcon( g, diy, sheet );
//	drawCollectionNumber (g, diy, sheet, false );

//	drawEncounterIcon( g, diy, sheet );	
//	drawEncounterInfo( g, diy, sheet );

	drawCollectorInfo( g, diy, sheet, true, false, true, true, true );
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 7 ) {
		$HeaderA = '';
		$HeaderASpacing = '0';
	}
	if ( diy.version < 9 ) {
		$Skill5Back = 'None';
	}
	if ( diy.version < 10 ) {
		$CardClassBack = 'Neutral';
	}
	
	updateCollection();
	updateEncounter();
	
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
