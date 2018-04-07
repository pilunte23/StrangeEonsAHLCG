useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Scenario', 'Scenario' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait', 'BackPortrait' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	
	diy.version = 5;
}

function setDefaults() {
	$PageType = 'Title';
	$PageTypeBack = 'Title';

	$Artist = '';
	$ArtistBack = '';

	$Page = '1';
	$PageBack = '2';
	
	$Rules = '';
	$RulesBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );
	
	var TitlePanel = layoutTitleScenario( diy, bindings, [0, 1], FACE_FRONT );
	var StatPanel = layoutScenarioStats( bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackTitlePanel = layoutTitleScenario( diy, bindings, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatPanel = layoutScenarioStats( bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, false, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var TextTab = layoutText( bindings, [ 'Rules' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Rules' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {	
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));
	initBodyTags( diy, Name_box );	

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Header_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
	
	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	Body_box.setLineTightness( 0 );	
	initBodyTags( diy, Body_box );	

	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Artist-alignment'));

	Page_box = markupBox(sheet);
	Page_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Page-style'), null);
	Page_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Page-alignment'));
}

function createBackPainter( diy, sheet ) {
	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));
	initBodyTags( diy, BackName_box );	

	BackHeader_box = markupBox(sheet);
	BackHeader_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	BackHeader_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
	
	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	initBodyTags( diy, BackBody_box );	

	BackArtist_box = markupBox(sheet);
	BackArtist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Artist-style'), null);
	BackArtist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Artist-alignment'));

	BackPage_box = markupBox(sheet);
	BackPage_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Page-style'), null);
	BackPage_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Page-alignment'));
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	if ( $PageType == 'Portrait' ) {
		PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );
	}
	else {
		drawTemplate( g, sheet, '' );

		drawPageNumber( g, diy, sheet, Page_box );
	}
	
	if ( $PageType == 'Title' ) drawName( g, diy, sheet, Name_box );
	else if ( $PageType == 'Resolution' ) drawScenarioResolutionHeader( g, diy, sheet, Header_box );
	
	drawScenarioBody( g, diy, sheet, Body_box, new Array( 'Rules' ) );	
	
	if ( $Artist != '' ) drawArtist( g, diy, sheet );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	if ( $PageTypeBack == 'Portrait' ) {
		PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );
	}
	else {
		drawTemplate( g, sheet, '' );

		drawPageNumber( g, diy, sheet, BackPage_box );
	}

	if ($PageTypeBack == 'Title' ) drawName( g, diy, sheet, BackName_box );
	else if ( $PageTypeBack == 'Resolution' ) drawScenarioResolutionHeader( g, diy, sheet, BackHeader_box );
	
	drawScenarioBody( g, diy, sheet, BackBody_box, new Array( 'Rules' ) );	

	if ( $ArtistBack != '' ) drawArtist( g, diy, sheet );
} 

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	if ( diy.version < 2 ) {
		$PageType = 'Title';
		$PageTypeBack = 'Title';

		$Artist = '';
		$ArtistBack = '';
	}
	
	if ( $PageType == 'Portrait' ) PortraitList[0] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[0] );
	
	if ( $PageTypeBack == 'Portrait' ) PortraitList[1] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[1] );
	
	diy.version = 5;
}

function onWrite( diy, oos ) {
	if ( $PageType == 'Portrait' ) oos.writeObject( getPortrait(0) );
	if ( $PageTypeBack == 'Portrait' ) oos.writeObject( getPortrait(1) );
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
