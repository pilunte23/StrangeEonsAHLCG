/*
 * ArkhamHorrorLCG.js
 */

useLibrary( 'extension' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );

importClass( arkham.diy.ListItem );
importClass( resources.StrangeImage );
importClass( java.io.File );
importClass( java.lang.System );
importClass( java.util.Locale );

useLibrary( 'res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js' );
useLibrary( 'res://ArkhamHorrorLCG/diy/AHLCG-preferences.js' );

function() initialize {
	var GameLanguage = Language.getGame();
	var InterfaceLanguage = Language.getInterface();
	
	InterfaceLanguage.addStrings( 'ArkhamHorrorLCG/text/AHLCG-Interface' );
	GameLanguage.addStrings( 'ArkhamHorrorLCG/text/AHLCG-Game' );

	const ahlcgGame = Game.register(
		'AHLCG', 'AHLCG-ArkhamHorrorLCG', image( 'AHLCG-Game', 'icons', 'png' )
	);

	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Game.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Asset.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Event.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Skill.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Investigator.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Enemy.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-WeaknessEnemy.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Treachery.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-WeaknessTreachery.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Location.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Agenda.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Act.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Chaos.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-AssetStory.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-AgendaPortrait.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-MiniInvestigator.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Scenario.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-BackPortrait.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Story.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Guide75.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-GuideA4.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-Divider.settings');
	ahlcgGame.masterSettings.addSettingsFrom('ArkhamHorrorLCG/settings/AHLCG-AgendaFrontPortrait.settings');

	Eons.namedObjects.AHLCGObject = new gameObject( ahlcgGame.masterSettings );

	addPreferences();
	
	ClassMap.add( 'ArkhamHorrorLCG/ArkhamHorrorLCG.classmap' );
}

function gameObject( masterSettings ) {
	this.OS = "Windows";	// default
	
	var systemOS = System.getProperty("os.name", "generic").toLowerCase(Locale.ENGLISH);
	
	if ( systemOS.indexOf("mac") >= 0 || systemOS.indexOf("darwin") >= 0) {
		this.OS = "Mac";
	}

	const registerTTFont = function registerTTFont() {
		for( let i=0; i<arguments.length; ++i ) {
			arguments[i] = 'ArkhamHorrorLCG/fonts/' + arguments[i] + '.ttf';
		}
		return FontUtils.registerFontFamilyFromResources.apply( this, arguments );
	};
	const registerOTFont = function registerOTFont() {
		for( let i=0; i<arguments.length; ++i ) {
			arguments[i] = 'ArkhamHorrorLCG/fonts/' + arguments[i] + '.otf';
		}
		return FontUtils.registerFontFamilyFromResources.apply( this, arguments );
	};

	var locale = getLocale();
	var titleFontFamily = 'Teutonic';
	
	if ( locale == 'cs' ) {
		titleFontFamily = ResourceKit.findAvailableFontFamily( 'Adobe Garamond Pro, Times New Roman', 'Teutonic' );
	}	
	else {
		titleFontFamily = 'Teutonic';
	}
	
	if ( titleFontFamily == 'Teutonic' ) this.titleFamily = registerTTFont( 'Teutonic' );
	else this.titleFamily = titleFontFamily;

	var fontFamily = ResourceKit.findAvailableFontFamily( 'Arno Pro, Times New Roman', 'NimbusRomNo9L' );
//	var fontFamily = ResourceKit.findAvailableFontFamily( 'Times New Roman', 'NimbusRomNo9L' );

	this.bodyFontTightness = 0.64;
	this.bodyFontSize = 7.8;
	this.bodyFontSpacing = 0.97;
	this.bodyTraitSize = 7;
	this.bodyTraitSpacing = 0.97;
	this.bodyFlavorSize = 7.0;
	this.bodyFlavorSpacing = 0.97;
	this.bodyStorySize = 7.8;
	this.bodyStorySpacing = 0.97;
	this.collectionSize = 4.0;
	this.subtitleSize = 6.0;
	this.smallLabelSize = 4.7;
	this.largeLabelSize = 6.2;
	this.subtypeSize = 5.5;
	this.subtitleFontSpacing = 1.0;
	this.scenarioIndexSize = 6.5;
	this.scenarioIndexBackSize = 4.4;
	this.difficultySize = 5.8;
	
	this.symbolSize = 7;
//	if ( this.OS == "Mac" ) this.symbolSize = 7;
	
	if (fontFamily == 'Arno Pro') {
		this.bodyFamily = 'Arno Pro';

//		if ( this.OS == "Mac" ) 
		this.bodyFontTightness = 0.58;
//		else this.bodyFontTightness = 0.90;
		this.bodyFontSpacing = 0.9;
		this.bodyFontSize = this.bodyFontSize * 1.12;
		this.bodyTraitSize = this.bodyTraitSize * 1.12;
		this.bodyFlavorSize = this.bodyFlavorSize * 1.12;
		this.bodyStorySize = this.bodyStorySize * 1.12;
		this.subtitleSize = this.subtitleSize * 1.12;
		this.smallLabelSize = this.smallLabelSize * 1.08;
		this.largeLabelSize = this.largeLabelSize * 1.08;
		this.subtypeSize = this.subtypeSize * 1.08;
		this.collectionSize = this.collectionSize * 1.12;
		this.bodyFlavorSpacing = 0.95;
		this.subtitleFontSpacing = 0.95;
		this.scenarioIndexSize = this.scenarioIndexSize * 1.08;
		this.scenarioIndexBackSize = this.scenarioIndexBackSize * 1.08;
		this.difficultySize = this.difficultySize * 1.08;		
	}
	else if (fontFamily == 'Times New Roman') this.bodyFamily = 'Times New Roman';
	else this.bodyFamily = registerOTFont( 'NimbusRomNo9L-Med', 'NimbusRomNo9L-MedIta', 'NimbusRomNo9L-Reg', 'NimbusRomNo9L-RegIta' );

	this.skillFamily = registerTTFont( 'Bolton', 'BoltonBold' );
	this.symbolFamily = registerTTFont( 'AHLCGSymbol');
	
	this.costFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/Teutonic.ttf', 16.0);
	this.enemyFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/Bolton.ttf', 16.0);
	this.symbolFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf', 16.0);
//	this.headerFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf', 11.2);
	this.chaosFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf', 14.0);

	// updated arrays for language support
	this.comboClassesI = new Array( 
		ListItem( 'Guardian', @AHLCG-Class-Guardian ),
		ListItem( 'Seeker', @AHLCG-Class-Seeker ),
		ListItem( 'Rogue', @AHLCG-Class-Rogue ),
		ListItem( 'Mystic', @AHLCG-Class-Mystic ),
		ListItem( 'Survivor', @AHLCG-Class-Survivor ),
		ListItem( 'Neutral', @AHLCG-Class-Neutral ),
		ListItem( 'ParallelGuardian', @AHLCG-Class-ParallelGuardian ),
		ListItem( 'ParallelSeeker', @AHLCG-Class-ParallelSeeker ),
		ListItem( 'ParallelRogue', @AHLCG-Class-ParallelRogue ),
		ListItem( 'ParallelMystic', @AHLCG-Class-ParallelMystic ) );
		
	this.comboClassesBW = new Array( 
		ListItem( 'Guardian', @AHLCG-Class-Guardian ),
		ListItem( 'Seeker', @AHLCG-Class-Seeker ),
		ListItem( 'Rogue', @AHLCG-Class-Rogue ),
		ListItem( 'Mystic', @AHLCG-Class-Mystic ),
		ListItem( 'Survivor', @AHLCG-Class-Survivor ),
		ListItem( 'Neutral' , @AHLCG-Class-Neutral ),
		ListItem( 'Weakness' , @AHLCG-Class-Weakness ),
		ListItem( 'BasicWeakness', @AHLCG-Class-BasicWeakness ) );
	
	this.comboClassesW = new Array( 
		ListItem( 'Guardian', @AHLCG-Class-Guardian ),
		ListItem( 'Seeker', @AHLCG-Class-Seeker ),
		ListItem( 'Rogue', @AHLCG-Class-Rogue ),
		ListItem( 'Mystic', @AHLCG-Class-Mystic ),
		ListItem( 'Survivor', @AHLCG-Class-Survivor ),
		ListItem( 'Neutral' , @AHLCG-Class-Neutral ),
		ListItem( 'Weakness' , @AHLCG-Class-Weakness ) );
		
	this.comboClassesD = new Array( 
		ListItem( 'None', @AHLCG-Class-None ),
		ListItem( 'Guardian', @AHLCG-Class-Guardian ),
		ListItem( 'Seeker', @AHLCG-Class-Seeker ),
		ListItem( 'Rogue', @AHLCG-Class-Rogue ),
		ListItem( 'Mystic', @AHLCG-Class-Mystic ),
		ListItem( 'Survivor', @AHLCG-Class-Survivor ) );

	this.comboStoryAssetClasses = new Array( 
		ListItem( 'Neutral', @AHLCG-Class-Neutral ),
		ListItem( 'Weakness', @AHLCG-Class-Weakness ) );

	this.comboSkills = new Array( 
		ListItem( 'None', @AHLCG-Skill-None ),
		ListItem( 'Willpower', @AHLCG-Skill-Willpower ),
		ListItem( 'Intellect', @AHLCG-Skill-Intellect ),
		ListItem( 'Combat', @AHLCG-Skill-Combat ),
		ListItem( 'Agility', @AHLCG-Skill-Agility ),
		ListItem( 'Wild' , @AHLCG-Skill-Wild ) );
		
	this.comboSlots = new Array( 
		ListItem( 'None', @AHLCG-Slot-None ),
		ListItem( 'Ally', @AHLCG-Slot-Ally ),
		ListItem( 'Accessory', @AHLCG-Slot-Accessory ),
		ListItem( 'Body', @AHLCG-Slot-Body ),
		ListItem( '1 Hand', @AHLCG-Slot-1Hand ),
		ListItem( '2 Hands', @AHLCG-Slot-2Hands ),
		ListItem( '1 Arcane', @AHLCG-Slot-1Arcane ),
		ListItem( '2 Arcane' , @AHLCG-Slot-2Arcane ),
		ListItem( 'Tarot', @AHLCG-Slot-Tarot ) );

	this.comboWeaknessTypes = new Array( 
		ListItem( 'BasicWeakness', @AHLCG-WknType-BasicWeakness ), 
		ListItem( 'Weakness', @AHLCG-WknType-Weakness ),
		ListItem( 'StoryWeakness', @AHLCG-WknType-StoryWeakness ) );

	this.comboWeaknessTypesI = new Array( 
		ListItem( 'BasicWeakness', @AHLCG-WknType-BasicWeakness ), 
		ListItem( 'Weakness', @AHLCG-WknType-Weakness ),
		ListItem( 'InvestigatorWeakness', @AHLCG-WknType-InvestigatorWeakness ),
		ListItem( 'StoryWeakness', @AHLCG-WknType-StoryWeakness ) );

	this.comboScenario = new Array( 
		ListItem( 'Portrait', @AHLCG-Scenario-Portrait ),
		ListItem( 'Title', @AHLCG-Scenario-Title ),
		ListItem( 'Resolution', @AHLCG-Scenario-Resolution ) );
				
	this.comboBacks = new Array( 
		ListItem( 'Player', @AHLCG-Back-Player ),
		ListItem( 'Encounter', @AHLCG-Back-Encounter ) );

	this.comboLocationBacks = new Array( 
		ListItem( 'Standard', @AHLCG-Back-Standard ),
		ListItem( 'Player', @AHLCG-Back-Player ),
		ListItem( 'Encounter', @AHLCG-Back-Encounter ) );

	this.comboGuide = new Array( 
		ListItem( 'Title', @AHLCG-Guide-Title ),
		ListItem( 'Empty', @AHLCG-Guide-Empty ) );

	this.comboTemplateOrientation = new Array( 
		ListItem( 'Standard', @AHLCG-Orientation-Standard ),
		ListItem( 'Reversed', @AHLCG-Orientation-Reversed ) );

	this.comboLevelsN = new Array(
		ListItem( 'None', @AHLCG-Level-None ) );
	for( let index = 0; index <= 5; index++ ){
		this.comboLevelsN[this.comboLevelsN.length] = ListItem( index, String(index) );
	}
								
	this.comboPortraitPosition1 = new Array( 
		ListItem( 'None', @AHLCG-Guide-None ),
		ListItem( 'TopLeftSmall', @AHLCG-Guide-TopLeftSmall ),
		ListItem( 'TopLeftMedium', @AHLCG-Guide-TopLeftMedium ),
		ListItem( 'TopLarge', @AHLCG-Guide-TopLarge ),
		ListItem( 'BottomLeftSmall', @AHLCG-Guide-BottomLeftSmall ),
		ListItem( 'BottomLeftMedium', @AHLCG-Guide-BottomLeftMedium ),
		ListItem( 'BottomLarge', @AHLCG-Guide-BottomLarge ),
		ListItem( 'LeftLarge', @AHLCG-Guide-LeftLarge ),
		ListItem( 'TopLeftCorner', @AHLCG-Guide-TopLeftCorner ),
		ListItem( 'BottomLeftCorner', @AHLCG-Guide-BottomLeftCorner ) );

	this.comboPortraitPosition2 = new Array( 	
		ListItem( 'None', @AHLCG-Guide-None ),
		ListItem( 'TopRightSmall', @AHLCG-Guide-TopRightSmall ),
		ListItem( 'TopRightMedium', @AHLCG-Guide-TopRightMedium ),
		ListItem( 'TopLarge', @AHLCG-Guide-TopLarge ),
		ListItem( 'BottomRightSmall', @AHLCG-Guide-BottomRightSmall ),
		ListItem( 'BottomRightMedium', @AHLCG-Guide-BottomRightMedium ),
		ListItem( 'BottomLarge', @AHLCG-Guide-BottomLarge ),
		ListItem( 'RightLarge', @AHLCG-Guide-RightLarge ),
		ListItem( 'TopRightCorner', @AHLCG-Guide-TopRightCorner ),
		ListItem( 'BottomRightCorner', @AHLCG-Guide-BottomRightCorner ) );

	this.comboStoryTemplate = new Array( 
		ListItem( 'Story', @AHLCG-StoryTemplate-Story ),
		ListItem( 'Token effects', @AHLCG-StoryTemplate-Token ) );

	this.comboStat = new Array();
	for( let index = 0; index <= 6; index++ ){
		this.comboStat[this.comboStat.length] = ListItem( index, String(index) );
	}

	this.comboInvestigatorHealth = new Array();
	for( let index = 1; index <= 15; index++ ){
		this.comboInvestigatorHealth[this.comboInvestigatorHealth.length] = ListItem( index, String(index) );
	}

	this.comboAssetStamina = new Array(
		ListItem( 'None', @AHLCG-Stamina-None ), 
		ListItem( '-', '-' ) );
	for( let index = 1; index <= 15; index++ ){
		this.comboAssetStamina[this.comboAssetStamina.length] = ListItem( index, String(index) );
	}

	this.comboAssetSanity = new Array(
		ListItem( 'None', @AHLCG-Sanity-None ), 
		ListItem( '-', '-' ) );
	for( let index = 1; index <= 15; index++ ){
		this.comboAssetSanity[this.comboAssetSanity.length] = ListItem( index, String(index) );
	}

	this.comboEnemyStat = new Array(
		ListItem( '-', '-' ),
		ListItem( '?', '?' ),
		ListItem( 'X', 'X' ) );
	for( let index = 0; index <= 29; index++ ){
		this.comboEnemyStat[this.comboEnemyStat.length] = ListItem( index, String(index) );
	}

	this.comboEnemyHealth = new Array(
		ListItem( '-', '-' ),
		ListItem( '?', '?' ),
		ListItem( 'X', 'X' ) );
	for( let index = 0; index <= 30; index++ ){
		this.comboEnemyHealth[this.comboEnemyHealth.length] = ListItem( index, String(index) );
	}

	this.comboCost = new Array(
		ListItem( '-', '-' ),
		ListItem( 'X', 'X' ) );
	for( let index = 0; index <= 19; index++ ) {
		this.comboCost[this.comboCost.length] = ListItem( index, String(index) );
	}
	
	this.comboClues = new Array(
	ListItem( '-', '-' ),
	ListItem( '?', '?' ) );
	for( let index = 1; index <= 19; index++ ) {
		this.comboClues[this.comboClues.length] = ListItem( index, String(index) );
	}
	
	this.combo5 = new Array();
	for( let index = 0; index <= 5; index++ ){
		this.combo5[index] = ListItem( index, String(index) );
	}

	this.combo20 = new Array();
	for( let index = 0; index < 20; index++ ){
		this.combo20[index] = ListItem( index+1, String(index+1) );
	}

	this.comboX20 = new Array(
		ListItem( 'X', 'X' )
	);
	for( let index = 0; index <= 20; index++ ){
		this.comboX20[this.comboX20.length] = ListItem( index, String(index) );
	}

	this.basicEncounterList = new Array(
		'CustomEncounterSet',
		'StrangeEons'
	);
								
	// Highest = 209 (RTT)
	// NameKey, CollectionID, Tag, Index into select keys
	this.standardEncounterList = new Array(
		[ 'ALightInTheFog', 22, 'alitf', 199 ],
		[ 'APhantomOfTruth', 4, 'phntm', 50 ],
		[ 'AbyssalGifts', 8, 'abygfts', 87 ],
		[ 'AbyssalTribute', 8, 'abytrib', 88 ],
		[ 'AlienInterference', 13, 'alnint', 161 ],
		[ 'AllOrNothing', 14, 'allornothing', 168 ],
		[ 'AgentsOfAtlachNacha', 12, 'agtan', 141 ],
		[ 'AgentsOfAzathoth', 10, 'agtaz', 107 ],
		[ 'AgentsOfCthulhu', 0, 'agtcth', 0 ],
		[ 'AgentsOfDagon', 22, 'agtdag', 187 ],
		[ 'AgentsOfHastur', 0, 'agthas', 1 ],
		[ 'AgentsOfHydra', 22, 'agyhyd', 188 ],
		[ 'AgentsOfNyarlathotep', 12, 'agtnya', 142 ],
		[ 'AgentsOfShubNiggurath', 0, 'agtshb', 2 ],
		[ 'AgentsOfYig', 5, 'agtyig', 56 ],
		[ 'AgentsOfYogSothoth', 0, 'agtyog', 3 ],
		[ 'AncientEvils', 0, 'ancevl', 4 ],
		[ 'AnettesCoven', 10, 'anette', 108 ],
		[ 'ArmitagesFate', 1, 'armfat', 5 ],
		[ 'AtDeathsDoorstep', 10, 'atdths', 109 ],
		[ 'AThousandShapesOfHorror', 12, 'atsoh', 143 ],
		[ 'BadLuck', 1, 'badlck', 6 ],
		[ 'BeastThralls', 1, 'bstthrl', 33 ],
		[ 'BeforeTheBlackThrone', 10, 'btbt', 110 ],
		[ 'BeyondTheGatesOfSleep', 12, 'btgos', 144 ],
		[ 'BeyondTheThreshold', 9, 'byndthr', 93 ],
		[ 'BishopsThralls', 1, 'bpthrl', 7 ],
		[ 'BlackStarsRise', 4, 'bsr', 52 ],
		[ 'BloodOnTheAltar', 1, 'bldalt', 31 ],
		[ 'BrotherhoodOfTheBeast', 8, 'bhdbst', 89 ],
		[ 'Byakhee', 4, 'byak', 48 ],
		[ 'CarnevaleOfHorrorsE', 3, 'carhor', 8 ],
		[ 'ChildrenOfParadise', 23, 'chpar', 205 ],
		[ 'ChillingCold', 0, 'chlcld', 9 ],
		[ 'CityOfSins', 10, 'ctysins', 111 ],
		[ 'Corsairs', 12, 'cors', 145 ],
		[ 'CreaturesOfTheDeep', 22, 'credeep', 189 ],
		[ 'CreaturesOfTheUnderworld', 12, 'cotu', 146 ],
		[ 'CreepingCold', 9, 'crpcld', 94 ],
		[ 'CultOfPnakotus', 16, 'cltpna', 171 ],
		[ 'CultOfTheYellowSign', 4, 'cltyel', 37 ],
		[ 'CultOfUmordhoth', 0, 'cltumh', 10 ],
		[ 'ReturnToCultOfUmordhoth', 7, 'cltumhr', 81 ],
		[ 'CurseOfTheRougarouE', 2, 'currou', 11 ],
		[ 'CurtainCall', 4, 'curtncl', 38 ],
		[ 'DarkCult', 0, 'dkcult', 12 ],
		[ 'DarkRituals', 13, 'dkrit', 162 ],
		[ 'DarkSideOfTheMoon', 12, 'dsotm', 147 ],
		[ 'DeadlyTraps', 5, 'deadtrp', 57 ],
		[ 'DeathOfStars', 23, 'dthstrs', 206 ],
		[ 'DecayAndFilth', 4, 'decay', 39 ],
		[ 'DecayingReality', 11, 'decrea', 128 ],
		[ 'Delusions', 4, 'delusn', 40 ],
		[ 'DelusoryEvils', 11, 'delevl', 129 ],
		[ 'DescentIntoThePitch', 12, 'ditp', 148 ],
		[ 'DevilReef', 22, 'devreef', 200 ],
		[ 'DimCarcosa', 4, 'dimcar', 55 ],
		[ 'DisappearanceAtTheTwilightEstate', 10, 'datte', 112 ],
		[ 'DoomedExpedition', 16, 'dmdexp', 172 ],
		[ 'DreamersCurse', 12, 'drmcur', 149 ],
		[ 'Dreamlands', 12, 'drmlnds', 150 ],
		[ 'Dunwich', 1, 'dunwch', 32 ],
		[ 'EchoesOfThePast', 4, 'echoes', 46 ],
		[ 'EpicMultiplayer', 6, 'epicmp', 79 ],
		[ 'ErraticFear', 9, 'errfr', 95 ],
		[ 'EvilPortents', 4, 'evilpor', 41 ],
		[ 'ExcelsiorManagement', 13, 'exman', 163 ],
		[ 'Expedition', 5, 'exped', 58 ],
		[ 'ExtracurricularActivity', 1, 'extact', 13 ],
		[ 'FloodedCaverns', 22, 'flocav', 190 ],
		[ 'FogOverInnsmouth', 22, 'foginn', 191 ],
		[ 'ForgottenRuins', 5, 'fruins', 59 ],
		[ 'ForTheGreaterGood', 10, 'ftgg', 113 ],
		[ 'Ghouls', 0, 'ghouls', 14 ],
		[ 'GhoulsOfUmordhoth', 7, 'ghoum', 82 ],
		[ 'GuardiansOfTime', 5, 'guatim', 60 ],
		[ 'HastursEnvoys', 11, 'hasenv', 130 ],
		[ 'HastursGift', 4, 'hasgft', 42 ],
		[ 'Hauntings', 4, 'haunt', 43 ],
		[ 'HeartOfTheElders', 5, 'hrteld', 71 ],
		[ 'HideousAbominations', 1, 'hidabo', 15 ],
		[ 'HorrorInHighGear', 22, 'hihg', 201 ],
		[ 'InTheClutchesOfChaos', 10, 'itcoc', 115 ],
		[ 'InTooDeep', 22, 'indeep', 202 ],
		[ 'InexorableFate', 10, 'inexft', 114 ],
		[ 'InhabitantsOfCarcosa', 4, 'inhcar', 49 ],
		[ 'IntoTheMaelstrom', 22, 'inmael', 203 ],
		[ 'KnYan', 5, 'knyan', 73 ],
		[ 'LockedDoors', 0, 'lckdrs', 16 ],
		[ 'LostInTimeAndSpace', 1, 'litas', 36 ],
		[ 'MaddeningDelusions', 11, 'maddel', 131 ],
		[ 'Malfunction', 22, 'malfctn', 192 ],
		[ 'MergingRealities', 12, 'merreal', 151 ],
		[ 'MiGoIncursion', 15, 'migoinc', 170 ],
		[ 'MurderAtTheExcelsiorHotelE', 13, 'matehe', 164 ],
		[ 'MusicOfTheDamned', 10, 'motd', 116 ],
		[ 'NaomisCrew', 1, 'naocrw', 17 ],
		[ 'NeuroticFear', 11, 'neufr', 132 ],
		[ 'Nightgaunts', 0, 'ntgnts', 18 ],
		[ 'PillarsOfJudgment', 5, 'piljdg', 72 ],
		[ 'PnakoticBrotherhood', 5, 'pnabro', 61 ],
		[ 'PointOfNoReturn', 12, 'ponr', 152 ],
		[ 'Poison', 5, 'poison', 62 ],
		[ 'Rainforest', 5, 'rainfst', 63 ],
		[ 'Rats', 0, 'rats', 19 ],
		[ 'ReadOrDie', 14, 'readordie', 167 ],
		[ 'RealmOfDeath', 10, 'rlmdth', 117 ],
		[ 'RedTideRising', 14, 'redtiri', 209 ],
		[ 'ResurgentEvils', 9, 'resevl', 96 ],
		[ 'ReturnToAPhantomOfTruth', 11, 'rphntm', 133 ],
		[ 'ReturnToBlackStarsRise', 11, 'rbsr', 134 ],
		[ 'ReturnToBloodOnTheAltar', 9, 'rbldalt', 97 ],
		[ 'ReturnToCurtainCall', 11, 'rcurtncl', 135 ],
		[ 'ReturnToDimCarcosa', 11, 'rdimcar', 136 ],
		[ 'ReturnToEchoesOfThePast', 11, 'rechoes', 137 ],
		[ 'ReturnToExtracurricularActivities', 9, 'rextact', 98 ],
		[ 'ReturnToHeartOfTheElders', 16, 'rhrteld', 173 ],
		[ 'ReturnToKnYan', 16, 'rknyan', 174 ],
		[ 'ReturnToLostInTimeAndSpace', 9, 'rtlitas', 99 ],
		[ 'ReturnToPillarsOfJudgment', 16, 'rpiljdg', 175 ],
		[ 'ReturnToShatteredAeons', 16, 'rshaaon', 176 ],
		[ 'ReturnToTheBoundaryBeyond', 16, 'rbndry', 177 ],
		[ 'ReturnToTheCityOfArchives', 16, 'rctyarc', 178 ],
		[ 'ReturnToTheDepthsOfYoth', 16, 'rtdoy', 179 ],
		[ 'ReturnToTheDevourerBelow', 7, 'rdevbel', 83 ],
		[ 'ReturnToTheDoomOfEztli', 16, 'rdmeztli', 180 ],
		[ 'ReturnToTheEssexCountyExpress', 9, 'resxexp', 100 ],
		[ 'ReturnToTheRainforest', 16, 'rrainfst', 181 ],
		[ 'ReturnToTheGathering', 7, 'rgather', 84 ],
		[ 'ReturnToTheHouseAlwaysWins', 9, 'rhsewin', 101 ],
		[ 'ReturnToTheLastKing', 11, 'rlstkng', 138 ],
		[ 'ReturnToTheMidnightMasks', 7, 'rmidmsk', 85 ],
		[ 'ReturnToTheMiskatonicMuseum', 9, 'rmskmus', 102 ],
		[ 'ReturnToThePallidMask', 11, 'rpalmsk', 139 ],
		[ 'ReturnToTheUnspeakableOath', 11, 'runspk', 140 ],	
		[ 'ReturnToTheUntamedWilds', 16, 'runtmdwld', 182 ],
		[ 'ReturnToThreadsOfFate', 16, 'rtof', 183 ],
		[ 'ReturnToTurnBackTime', 16, 'rtbt', 184 ],
		[ 'ReturnToUndimensionedAndUnseen', 9, 'rundim', 103 ],
		[ 'ReturnToWhereDoomAwaits', 9, 'rtwda', 104 ],
		[ 'RisingTide', 22, 'ristide', 193 ],
		[ 'SandsOfEgypt', 8, 'sdsegpt', 90 ],
		[ 'SecretDoors', 9, 'scrtdr', 105 ],
		[ 'SecretsOfTheUniverse', 10, 'sotu', 118 ],
		[ 'Serpents', 5, 'serpent', 64 ],
		[ 'ShatteredAeons', 5, 'shaaon', 76 ],
		[ 'ShatteredMemories', 22, 'shamem', 194 ],
		[ 'SilverTwilightLodge', 10, 'siltwil', 119 ],
		[ 'SingleGroup', 6, 'singrp', 80 ],
		[ 'SinsOfThePast', 13, 'sotp', 165 ],
		[ 'Sorcery', 1, 'sorcry', 20 ],
		[ 'SpectralPredators', 10, 'specpred', 120 ],
		[ 'Spiders', 12, 'spdrs', 153 ],
		[ 'StrikingFear', 0, 'strfr', 21 ],
		[ 'SwarmOfAssimilation', 23, 'swmass', 207 ],
		[ 'Syzygy', 22, 'syzygy', 195 ],
		[ 'TemporalFlux', 5, 'temflx', 65 ],
		[ 'TemporalHunters', 16, 'tmphnt', 185 ],
		[ 'TerrorOfTheVale', 12, 'totv', 154 ],
		[ 'TheBayou', 2, 'bayou', 22 ],
		[ 'TheBeyond', 1, 'beyond', 23 ],
		[ 'TheBlobThatAteEverythingE', 15, 'blob', 169 ],
		[ 'TheBoundaryBeyond', 5, 'bndry', 70 ],
		[ 'TheCityOfArchives', 5, 'ctyarc', 75 ],	// this is out of order, cuz I'm dumb
		[ 'TheDepthsOfYoth', 5, 'tdoy', 74 ],
		[ 'TheDevourerBelow', 0, 'devbel', 24 ],
		[ 'TheDevourersCult', 7, 'devclt', 86 ],
		[ 'TheDoomOfEztli', 5, 'dmeztli', 66 ],
		[ 'TheEssexCountyExpress', 1, 'esxexp', 25 ],
		[ 'TheEternalSlumber', 8, 'eslmbr', 91 ],
		[ 'TheFloodBelow', 4, 'flood', 53 ],
		[ 'TheGathering', 0, 'gather', 26 ],
		[ 'TheHouseAlwaysWins', 1, 'hsewin', 27 ],
		[ 'TheLabyrinthsOfLunacyE', 6, 'lablun', 78 ],
		[ 'TheLairOfDagon', 22, 'tlod', 204 ],
		[ 'TheLastKing', 4, 'lstkng', 44 ],
		[ 'TheLocals', 22, 'locals', 196 ],
		[ 'TheMidnightMasks', 0, 'midmsk', 28 ],
		[ 'TheMiskatonicMuseum', 1, 'mskmus', 29 ],
		[ 'TheNightsUsurper', 8, 'ntusrpr', 92 ],
		[ 'ThePallidMask', 4, 'palmsk', 51 ],		
		[ 'ThePitOfDespair', 22, 'pitdes', 197 ],
		[ 'TheSearchForKadath', 12, 'tsfk', 155 ],
		[ 'TheSecretName', 10, 'secrtnm', 121 ],
		[ 'TheStranger', 4, 'strngr', 45 ],
		[ 'TheUnspeakableOath', 4, 'unspk', 47 ],
		[ 'TheUntamedWilds', 5, 'untmdwld', 67 ],
		[ 'TheVanishingOfElinaHarper', 22, 'vaneh', 198],
		[ 'TheVortexAbove', 4, 'vortex', 54 ],
		[ 'TheWagesOfSin', 10, 'twos', 122 ],
		[ 'TheWatcher', 10, 'watcher', 123 ],
		[ 'TheWitchingHour', 10, 'wtchhr', 124 ],
		[ 'ThreadsOfFate', 5, 'tof', 69 ],
		[ 'TrappedSpirits', 10, 'trpspi', 125 ],
		[ 'TurnBackTime', 5, 'tbt', 77 ],
		[ 'UndimensionedAndUnseen', 1, 'undim', 34 ],
		[ 'UnionAndDisillusion', 10, 'undis', 126 ],
		[ 'VenomousHate', 16, 'vnmhate', 186 ],
		[ 'VileExperiments', 13, 'vileex', 166 ],
		[ 'WakingNightmare', 12, 'wkngnm', 156 ],
		[ 'WarOfTheOuterGodsE', 23, 'wotog', 208 ],
		[ 'WeaverOfTheCosmos', 12, 'wotc', 157 ],
		[ 'WhereDoomAwaits', 1, 'wda', 35 ],
		[ 'WhereTheGodsDwell', 12, 'wtgd', 158 ],
		[ 'Whippoorwills', 1, 'whip', 30 ],
		[ 'WhispersOfHypnos', 12, 'woh', 159 ],
		[ 'Witchcraft', 10, 'witch', 127 ],
		[ 'YigsVenom', 5, 'yigvnm', 68 ],
		[ 'YogSothothsEmissaries', 9, 'yogem', 106],
		[ 'Zoogs', 12, 'zoogs', 160 ]
	);

	this.basicCollectionList = new Array(
		'CustomCollection',
		'StrangeEons'
	);

	this.standardCollectionList = new Array(
		[ 'CoreSet', 'core' ],							//  0
		[ 'TheDunwichLegacy', 'dunleg' ],				//  1
		[ 'CurseOfTheRougarou', 'ccurrou' ],			//  2
		[ 'CarnevaleOfHorrors', 'ccarhor' ],			//  3
		[ 'ThePathToCarcosa', 'carcosa' ],				//  4
		[ 'TheForgottenAge', 'forage' ],				//  5
		[ 'TheLabyrinthsOfLunacy', 'lablun' ],			//  6
		[ 'ReturnToTheNightOfTheZealot', 'rtnotz' ],	//  7
		[ 'GuardiansOfTheAbyss', 'guaaby' ],			//  8
		[ 'ReturnToTheDunwichLegacy', 'rttdl' ],		//  9
		[ 'TheCircleUndone', 'cirund' ],				// 10
		[ 'ReturnToThePathToCarcosa', 'rttptc' ],		// 11
		[ 'TheDreamEaters', 'dreeat' ],					// 12
		[ 'MurderAtTheExcelsiorHotel', 'mateh' ],		// 13
		[ 'ParallelInvestigators', 'parallel' ],		// 14
		[ 'TheBlobThatAteEverything', 'blob' ],			// 15
		[ 'ReturnToTheForgottenAge', 'rttfa' ],			// 16
		[ 'NathanielCho', 'natcho' ],					// 17
		[ 'HarveyWalters', 'harwal' ],					// 18
		[ 'WinifredHabbamock', 'winhab' ],				// 19
		[ 'JacquelineFine', 'jacfin' ],					// 20
		[ 'StellaClark', 'stecla' ],					// 21
		[ 'TheInnsmouthConspiracy', 'tic' ],			// 22
		[ 'WarOfTheOuterGods', 'cwotog' ]	 			// 23
	);
	
	this.encounterTypes = new Array();
	this.collectionTypes = new Array();

	updateUsedEncounterSets( this );
	updateUsedCollections( this );
						
	this.TagList = new Array (
		'Fast', 'Name', 'HorizontalSpacer', 'LargeVerticalSpacer', 'VerticalSpacer', 
		'SmallVerticalSpacer', 'Action', 'Reaction', 'Fast',
		'Guardian', 'Seeker', 'Rogue', 'Mystic', 'Survivor',
		'Willpower', 'Intellect', 'Combat', 'Agility', 'Wild',
		'Skull', 'Cultist', 'Artifact', 'Monster', 'Bless', 'Curse', 'ElderSign', 'Tentacle',
		'Unique', 'PerInvestigator', 'Prey', 'Spawn', 'Revelation', 'Forced',
		'Objective', 'Haunted', 'Patrol', 'Bullet', 'Resolution', 'EndResolution', 'GuideBullet', 'Square'
	);
	
	this.StyleList = new Array (
		'Trait', 'TraitSection', 'FlavorSection', 'InvStorySection', 
		'ActStorySection', 'AgendaStorySection',
		'AHF'
	);

	this.GuideStyleList = new Array (
		'GuideSection', 'GuideHeader', 'GuideBoxBullet'
	);

	this.CopyrightTagList = new Array (
		'Copyright'
	);

	this.locationIcons = [ 'Circle', 'Square', 'Triangle', 'Cross', 'Diamond', 'Slash', 'T', 'Hourglass', 'Moon', 'DoubleSlash', 'Heart', 'Star', 'Quote' , 'Clover', 'CircleAlt', 'SquareAlt', 'TriangleAlt', 'CrossAlt', 'DiamondAlt',
        'SlashAlt', 'TAlt', 'HourglassAlt', 'MoonAlt', 'DoubleSlashAlt', 'HeartAlt', 'StarAlt' ];


	this.comboConnections = new Array (
		ListItem( 'None', @AHLCG-LocIcon-None,
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png') , 12, 12 )
			),
		ListItem( 'Empty', @AHLCG-LocIcon-Empty,
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png') , 12, 12 )
			) 
		);
	
	this.comboConnectionsBack = [ 
		ListItem( 'Copy front', @AHLCG-LocIcon-CopyFront,
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png') , 12, 12 )
			),
		ListItem( 'None', @AHLCG-LocIcon-None,
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png') , 12, 12 )
			),
		ListItem( 'Empty', @AHLCG-LocIcon-Empty,
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png') , 12, 12 )
			)
		];

	this.baseLocationIcon = ImageUtils.get( 'ArkhamHorrorLCG/icons/AHLCG-LocationBase.png' );

	test_tinter = new TintCache( new TintFilter(), this.baseLocationIcon );

	for( let index = 0; index < this.locationIcons.length; index++ ) {
		let item = this.locationIcons[index];
		
		var hsb = masterSettings.getTint( 'AHLCG-' + item + '-tint' );
		test_tinter.setFactors( hsb[0], hsb[1], hsb[2] );

		let iconBaseImage = test_tinter.getTintedImage();
		
		let ig = iconBaseImage.createGraphics();

		ig.drawImage( ImageUtils.get( 'ArkhamHorrorLCG/icons/AHLCG-Loc' + item + '.png' ), 4, 4, null );

		this.comboConnections[index+2] = ListItem(
			item, @('AHLCG-LocIcon-' + item),
			ImageUtils.createIcon(iconBaseImage, 12, 12)		
			);
				
		this.comboConnectionsBack[index+3] = ListItem(
			item, @('AHLCG-LocIcon-' + item),
			ImageUtils.createIcon(iconBaseImage, 12, 12)		
			);

		ig.dispose();
	}	
	
	this.actTextShapes = new Array( null, null );
	this.agendaTextShapes = new Array( null, null );
	this.enemyPageShape = null;
	this.eventTextShape = null;
	this.locationTextShape = null;
	this.locationBackTextShape = null;
	this.skillTextShape = null;
	this.investigatorBackTextShapes = [];
	
	this.getIntBoxTint = function () {
		if ( this.intBoxTint ) return this.intBoxTint;
		
		this.intBoxTint = new TintCache( new TintFilter() );
		this.intBoxTint.setImage( ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxIntRed.png') );
						
		return this.intBoxTint;
	};
	this.getIntMidTint = function () {
		if ( this.intMidTint ) return this.intMidTint;
		
		this.intMidTint = new TintCache( new TintFilter() );
		this.intMidTint.setImage( ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxIntLineRed.png' ) );

		return this.intMidTint;
	};
	this.getBracketTint = function () {
		if ( this.bracketTint ) return this.bracketTint;
		
		this.bracketTint = new TintCache( new TintFilter() );
		this.bracketTint.setImage( ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxResBracketRed.png') );
						
		return this.bracketTint;
	};
	this.getResBoxTint = function () {
		if ( this.resBoxTint ) return this.resBoxTint;
		
		this.resBoxTint = new TintCache( new TintFilter() );
		this.resBoxTint.setImage( ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxResRed.png') );
						
		return this.resBoxTint;
	};
	this.getResMidTint = function () {
		if ( this.resMidTint ) return this.resMidTint;
		
		this.resMidTint = new TintCache( new TintFilter() );
		this.resMidTint.setImage( ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxResLineRed.png' ) );

		return this.resMidTint;
	};
	this.getActTextShape = function ( region, reverse ) {
		let nReverse = Number(reverse);

		if ( this.actTextShapes[nReverse] ) return this.actTextShapes[nReverse];
		
		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;
	
		var path = new java.awt.geom.Path2D.Double();

		var xPathPoints = new Array( 0.000, 0.000, 0.715, 0.830, 0.830, 1.000, 1.000 );
		var yPathPoints = new Array( 0.000, 1.000, 1.000, 0.957, 0.850, 0.850, 0.000 );
	
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
		
		this.actTextShapes[nReverse] = PageShape.GeometricShape( path, region );

		return this.actTextShapes[nReverse];
	};
	this.getAgendaTextShape = function ( region, reverse ) {
		let nReverse = Number(reverse);

		if ( this.agendaTextShapes[nReverse] ) return this.agendaTextShapes[nReverse];

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;

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
		
		this.agendaTextShapes[nReverse] = PageShape.GeometricShape( path, region );

		return this.agendaTextShapes[nReverse];
	};
	this.getEnemyTextShape = function ( region ) {
		if ( this.enemyTextShape ) return this.enemyTextShape;

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;
	
		var path = new java.awt.geom.Path2D.Double();
	
		var xPathPoints = new Array( 0.086, 0.086, 0.000, 0.000, 0.039, 0.078 );
		var yPathPoints = new Array( 0.000, 0.189, 0.189, 0.693, 0.800, 1.000 );

		var numPoints = xPathPoints.length;
	
		path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

		for (let i = 1; i < numPoints; i++) {
			path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
		}

		path.lineTo( x + w * (1 - xPathPoints[numPoints-1]), y + h * yPathPoints[numPoints-1] );

		for (let i = numPoints-2; i >= 0; i--) {
			path.lineTo( x + w * (1 - xPathPoints[i]), y + h * yPathPoints[i] );
		}

		path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
		this.enemyPageShape = PageShape.GeometricShape( path, region );
		
		return this.enemyPageShape;
	};
	this.getEventTextShape = function ( region ) {
		if ( this.eventTextShape ) return this.eventTextShape;

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;
	
		var path = new java.awt.geom.Path2D.Double();
	
//		var xPathPoints = new Array( 0.0, -0.054, -0.009, 0.179 );
//		var xPathPoints = new Array( 0.0, -0.054, -0.004, 0.179 );
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
		
		this.eventTextShape = PageShape.GeometricShape( path, region );
		
		return this.eventTextShape;
	};
	this.getLocationTextShape = function ( region ) {
		if ( this.locationTextShape ) return this.locationTextShape;

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;

		var path = new java.awt.geom.Path2D.Double();

		// asymmetrical	
		var xPathPoints = new Array( 0.074, 0.000, 0.000, 1.000, 1.000, 0.951, 0.926 );
		var yPathPoints = new Array( 0.000, 0.174, 1.000, 1.000, 0.319, 0.125, 0.000 );
	
		var xControlPoints = new Array( 0.037, 0.107, 0.991, 0.962, 0.936, 0.970 );
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
		
		this.locationTextShape = PageShape.GeometricShape( path, region );
		
		return this.locationTextShape;
	};
	this.getLocationBackTextShape = function ( region ) {
		if ( this.locationBackTextShape ) return this.locationBackTextShape;

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;

//		var xPathPoints = new Array( 0.151, 0.000, 0.000, 1.000, 1.000, 0.849 );
		var xPathPoints = new Array( 0.111, 0.000, 0.000, 1.000, 1.000, 0.889 );
		var yPathPoints = new Array( 0.000, 0.204, 1.000, 1.000, 0.204, 0.000 );
	
		var path = new java.awt.geom.Path2D.Double();

		var numPoints = xPathPoints.length;

		path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

		for (let i = 1; i < numPoints; i++) {
			path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
		}

		path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
		this.locationBackTextShape = PageShape.GeometricShape( path, region );
		
		return this.locationBackTextShape;
	};
	this.getSkillTextShape = function ( region ) {
		if ( this.skillTextShape ) return this.skillTextShape;

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;
	
		var path = new java.awt.geom.Path2D.Double();
	
		var xPathPoints = new Array( 0.0, 0.015 );
		var yPathPoints = new Array( 0.0, 1.000 );
	
		var xControlPoints = new Array( 0.053, 0.088 );
		var yControlPoints = new Array( 0.307, 0.600 );
	
		var numPoints = xPathPoints.length;
	
		path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

		for (let i = 1; i < numPoints; i++) {
			path.curveTo( x + w * xControlPoints[i*2 - 2], y + h * yControlPoints[i*2 - 2],
						  x + w * xControlPoints[i*2 - 1], y + h * yControlPoints[i*2 - 1],
						  x + w * xPathPoints[i], y + h * yPathPoints[i]
			);
		}

		path.lineTo( x + w * (1 + xPathPoints[numPoints-1]), y + h * yPathPoints[numPoints-1] );

		for (let i = numPoints-2; i >= 0; i--) {
			path.curveTo( x + w * (1.0 + xControlPoints[i*2 + 1]), y + h * yControlPoints[i*2 + 1],
						  x + w * (1.0 + xControlPoints[i*2]), y + h * yControlPoints[i*2],
						  x + w * (1.0 + xPathPoints[i]), y + h * yPathPoints[i]
			);
		}

		path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
		this.skillTextShape = PageShape.GeometricShape( path, region );
		
		return this.skillTextShape;
	};
	this.getInvestigatorBackTextShape = function ( region, className ) {
		if ( this.investigatorBackTextShapes[className] ) return this.investigatorBackTextShapes[className];

		var x = region.x;
		var y = region.y;
		var w = region.width;
		var h = region.height;

		var pointArrays = getPathPointArrays( className );
	
		var xPathPoints = pointArrays[0];
		var yPathPoints = pointArrays[1];

		var path = new java.awt.geom.Path2D.Double();

		var numPoints = xPathPoints.length;

		path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

		for (let i = 0; i < numPoints; i++) {
			path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
		}

		path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );
		
		this.investigatorBackTextShapes[className] = PageShape.GeometricShape( path, region );
		
		return this.investigatorBackTextShapes[className];
	};
}
