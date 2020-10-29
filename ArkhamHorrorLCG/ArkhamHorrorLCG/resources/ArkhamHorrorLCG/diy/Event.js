useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Event', 'EventBack' ];
const BindingSuffixes = [ '' ];

const PortraitTypeList = [ 'Portrait-Front', 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size	
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultCollection();

	diy.version = 12;
}

function setDefaults() {
	$Unique = '0';
	$CardClass = 'Guardian';
	$ResourceCost = '0';
	$Level = '0';
	$Skill1 = 'None';
	$Skill2 = 'None';
	$Skill3 = 'None';
	$Skill4 = 'None';
	$Skill5 = 'None';
	
	$BackTypeBack = 'Player';
	
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
	var StatPanel = layoutEventStats( diy, bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackStatPanel = layoutBackTypeStats( diy, bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
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
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	

	Subtype_box = markupBox(sheet);
	Subtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtype-style'), null);
	Subtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtype-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );

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
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, $CardClass );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Event );
	drawName( g, diy, sheet, Name_box );

	var subtypeRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Subtype-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) subtypeRegion.y -= 2;
	
	if ($CardClass == 'Weakness' ) {	
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-Weakness );
	}
	else if ($CardClass == 'BasicWeakness' ) {	
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-BasicWeakness );
		
		drawOverlay( g, diy, sheet, 'BasicWeaknessEvent' );
		drawBasicWeaknessIcon( g, diy, sheet );
	}
	else {
		drawLevel( g, diy, sheet, $CardClass );
	}

	drawCost( g, diy, sheet );
	
	drawSkillIcons( g, diy, sheet, $CardClass );
	
	var regionName = 'Body';
	if ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness') regionName = 'WeaknessBody';
	drawBodyWithRegionName( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ), regionName );

	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	drawBackTemplate( g, sheet );
}

function onClear() {
	setDefaults();
}

function createTextShape( textBox, textRegion, className  ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;
	
	var path = new java.awt.geom.Path2D.Double();
	
//	var xPathPoints = new Array( 0.0, -0.054, -0.009, 0.179 );
//	var xPathPoints = new Array( 0.0, -0.054, -0.004, 0.179 );
	var xPathPoints = new Array( 0.0, -0.054, -0.004, 0.179 );
	var yPathPoints = new Array( 0.0, 0.333, 0.892, 1.0 );
	
	var xControlPoints = new Array( 0.004, -0.060, -0.083, 0.006, 0.088, 0.047 );
	var yControlPoints = new Array( 0.047, 0.193, 0.513, 0.674, 0.873, 0.993 );
	
	var numPoints = xPathPoints.length;
	
	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 1; i < numPoints; i++) {
		path.curveTo( x + w * xControlPoints[i*2 - 2], y + h * yControlPoints[i*2 - 2],
					  x + w * xControlPoints[i*2 - 1], y + h * yControlPoints[i*2 - 1],
					  x + w * xPathPoints[i], y + h * yPathPoints[i]
		);
	}

	path.lineTo( x + w * (1 - xPathPoints[numPoints-1]), y + h * yPathPoints[numPoints-1] );

	for (let i = numPoints-2; i >= 0; i--) {
		path.curveTo( x + w * (1.0 - xControlPoints[i*2 + 1]), y + h * yControlPoints[i*2 + 1],
					  x + w * (1.0 - xControlPoints[i*2]), y + h * yControlPoints[i*2],
					  x + w * (1.0 - xPathPoints[i]), y + h * yPathPoints[i]
		);
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 9 ) {
		$Skill5 = 'None';
	}
	if ( diy.version < 12 ) {
		$BackTypeBack = 'Player';
	}
	
	updateCollection();
	
	diy.version = 12;
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
