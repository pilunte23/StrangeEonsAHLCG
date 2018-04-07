useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'MiniInvestigator', 'MiniInvestigator' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Both' ];

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
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {	
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );

	var imageTinted = PortraitList[getPortraitIndex( 'Portrait' )].getImage();
	var imagePanX = PortraitList[getPortraitIndex( 'Portrait' )].getPanX();
	var imagePanY = PortraitList[getPortraitIndex( 'Portrait' )].getPanY();
	var imageRotation = PortraitList[getPortraitIndex( 'Portrait' )].getRotation();
	var imageScale = PortraitList[getPortraitIndex( 'Portrait' )].getScale();
	
	imageTinted = createGreyscaleImage( imageTinted );

	var region = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Portrait-portrait-clip-region') );

	var AT = java.awt.geom.AffineTransform;	
	var transform =	AT.getTranslateInstance(
		region.x + region.width/2 + imagePanX - ( ( imageTinted.width * imageScale ) / 2 ),
		region.y + region.height/2 + imagePanY - ( ( imageTinted.height * imageScale ) / 2 )
	);
	transform.concatenate( AT.getScaleInstance( imageScale, imageScale ) );
	transform.concatenate( AT.getRotateInstance( -imageRotation * Math.PI/180, imageTinted.width/2, imageTinted.height/2 ) );

	g.drawImage(imageTinted, transform, null);
} 

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList );
	
	diy.version = 5;
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
