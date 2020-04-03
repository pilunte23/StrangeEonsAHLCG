/*
 * ArkhamHorrorLCG.js
 */

useLibrary( 'extension' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

useLibrary( 'diy' );
useLibrary( 'ui' );

importClass( arkham.diy.ListItem );
importClass( resources.StrangeImage );
importClass( java.io.File );

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

	Eons.namedObjects.AHLCGObject = new gameObject( ahlcgGame.masterSettings );

	addPreferences();
	
	ClassMap.add( 'ArkhamHorrorLCG/ArkhamHorrorLCG.classmap' );
}

function gameObject( masterSettings ) {
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
	this.bodyFlavorSpacing = 0.92;
	this.bodyStorySize = 7.8;
	this.bodyStorySpacing = 0.92;
	this.collectionSize = 4.0;
	this.subtitleSize = 6.0;
	this.smallLabelSize = 4.7;
	this.largeLabelSize = 6.2;
	this.subtypeSize = 5.5;
	this.subtitleFontSpacing = 1.0;
	this.scenarioIndexSize = 6.5;
	this.scenarioIndexBackSize = 4.4;
	this.difficultySize = 5.8;
	
	if (fontFamily == 'Arno Pro') {
		this.bodyFamily = 'Arno Pro';

		this.bodyFontTightness = 0.57;
		this.bodyFontSize = this.bodyFontSize * 1.08;
		this.bodyTraitSize = this.bodyTraitSize * 1.12;
		this.bodyFlavorSize = this.bodyFlavorSize * 1.12;
		this.bodyStorySize = this.bodyStorySize * 1.12;
		this.subtitleSize = this.subtitleSize * 1.08;
		this.smallLabelSize = this.smallLabelSize * 1.08;
		this.largeLabelSize = this.largeLabelSize * 1.08;
		this.subtypeSize = this.subtypeSize * 1.08;
		this.collectionSize = this.collectionSize * 1.12;
		this.bodyFlavorSpacing = 0.96;
		this.subtitleFontSpacing = 0.97;
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
	this.headerFont = ResourceKit.getFont('ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf', 11.2);

	// updated arrays for language support
	this.comboClasses = new Array( 
		ListItem( 'Guardian', @AHLCG-Class-Guardian ),
		ListItem( 'Seeker', @AHLCG-Class-Seeker ),
		ListItem( 'Rogue', @AHLCG-Class-Rogue ),
		ListItem( 'Mystic', @AHLCG-Class-Mystic ),
		ListItem( 'Survivor', @AHLCG-Class-Survivor ),
		ListItem( 'Neutral', @AHLCG-Class-Neutral ) );
		
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
		ListItem( '2 Arcane' , @AHLCG-Slot-2Arcane ) );

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
	for( let index = 0; index <= 9; index++ ){
		this.comboEnemyStat[this.comboEnemyStat.length] = ListItem( index, String(index) );
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

	// Highest = 76
	// NameKey, CollectionID, Tag, Index into select keys
	this.standardEncounterList = new Array(
		[ 'APhantomOfTruth', 4, 'phntm', 50 ],
		[ 'AgentsOfCthulhu', 0, 'agtcth', 0 ],
		[ 'AgentsOfHastur', 0, 'agthas', 1 ],
		[ 'AgentsOfShubNiggurath', 0, 'agtshb', 2 ],
		[ 'AgentsOfYig', 5, 'agtyig', 56 ],
		[ 'AgentsOfYogSothoth', 0, 'agtyog', 3 ],
		[ 'AncientEvils', 0, 'ancevl', 4 ],
		[ 'ArmitagesFate', 1, 'armfat', 5 ],
		[ 'BadLuck', 1, 'badlck', 6 ],
		[ 'BeastThralls', 1, 'bstthrl', 33 ],
		[ 'BishopsThralls', 1, 'bpthrl', 7 ],
		[ 'BlackStarsRise', 4, 'bsr', 52 ],
		[ 'BloodOnTheAltar', 1, 'bldalt', 31 ],
		[ 'Byakhee', 4, 'byak', 48 ],
		[ 'CarnevaleOfHorrorsE', 3, 'carhor', 8 ],
		[ 'ChillingCold', 0, 'chlcld', 9 ],
		[ 'CultOfTheYellowSign', 4, 'cltyel', 37 ],
		[ 'CultOfUmordhoth', 0, 'cltumh', 10 ],
		[ 'CurseOfTheRougarouE', 2, 'currou', 11 ],
		[ 'CurtainCall', 4, 'curtncl', 38 ],
		[ 'DarkCult', 0, 'dkcult', 12 ],
		[ 'DeadlyTraps', 5, 'deadtrp', 57 ],
		[ 'DecayFilth', 4, 'decay', 39 ],
		[ 'DimCarcosa', 4, 'dimcar', 55 ],
		[ 'Dunwich', 1, 'dunwch', 32 ],
		[ 'Delusions', 4, 'delusn', 40 ],
		[ 'EchoesOfThePast', 4, 'echoes', 46 ],
		[ 'EvilPortents', 4, 'evilpor', 41 ],
		[ 'Expedition', 5, 'exped', 58 ],
		[ 'ExtracurricularActivity', 1, 'extact', 13 ],
		[ 'ForgottenRuins', 5, 'fruins', 59 ],
		[ 'Ghouls', 0, 'ghouls', 14 ],
		[ 'GuardiansOfTime', 5, 'guatim', 60 ],
		[ 'HastursGift', 4, 'hasgft', 42 ],
		[ 'Hauntings', 4, 'haunt', 43 ],
		[ 'HeartOfTheElders', 5, 'hrteld', 71 ],
		[ 'HideousAbominations', 1, 'hidabo', 15 ],
		[ 'InhabitantsOfCarcosa', 4, 'inhcar', 49 ],
		[ 'KnYan', 5, 'knyan', 73 ],
		[ 'LockedDoors', 0, 'lckdrs', 16 ],
		[ 'LostInTimeAndSpace', 1, 'litas', 36 ],
		[ 'NaomisCrew', 1, 'naocrw', 17 ],
		[ 'Nightgaunts', 0, 'ntgnts', 18 ],
		[ 'PillarsOfJudgment', 5, 'piljdg', 72 ],
		[ 'PnakoticBrotherhood', 5, 'pnabro', 61 ],
		[ 'Poison', 5, 'poison', 62 ],
		[ 'Rainforest', 5, 'rainfst', 63 ],
		[ 'Rats', 0, 'rats', 19 ],
		[ 'Serpents', 5, 'serpent', 64 ],
		[ 'ShatteredAeons', 5, 'shaaon', 76 ],
		[ 'Sorcery', 1, 'sorcry', 20 ],
		[ 'StrikingFear', 0, 'strfr', 21 ],
		[ 'TemporalFlux', 5, 'temflx', 65 ],
		[ 'TheBayou', 2, 'bayou', 22 ],
		[ 'TheBeyond', 1, 'beyond', 23 ],
		[ 'TheBoundaryBeyond', 5, 'bndry', 70 ],
		[ 'TheCityOfArchives', 5, 'ctyarc', 75 ],	// this is out of order, cuz I'm dumb
		[ 'TheDepthsOfYoth', 5, 'tdoy', 74 ],
		[ 'TheDevourerBelow', 0, 'devbel', 24 ],
		[ 'TheDoomOfEztli', 5, 'dmeztli', 66 ],
		[ 'TheEssexCountyExpress', 1, 'esxexp', 25 ],
		[ 'TheFloodBelow', 4, 'flood', 53 ],
		[ 'TheGathering', 0, 'gather', 26 ],
		[ 'TheHouseAlwaysWins', 1, 'hsewin', 27 ],
		[ 'TheLastKing', 4, 'lstkng', 44 ],
		[ 'TheMidnightMasks', 0, 'midmsk', 28 ],
		[ 'TheMiskatonicMuseum', 1, 'mskmus', 29 ],
		[ 'ThePallidMask', 4, 'palmsk', 51 ],		
		[ 'TheStranger', 4, 'strngr', 45 ],
		[ 'TheUnspeakableOath', 4, 'unspk', 47 ],
		[ 'TheUntamedWilds', 5, 'untmdwld', 67 ],
		[ 'TheVortexAbove', 4, 'vortex', 54 ],
		[ 'ThreadsOfFate', 5, 'tof', 69 ],
		[ 'UndimensionedAndUnseen', 1, 'undim', 34 ],
		[ 'WhereDoomAwaits', 1, 'wda', 35 ],
		[ 'Whippoorwills', 1, 'whip', 30 ],
		[ 'YigsVenom', 5, 'yigvnm', 68 ]
	);

	this.basicCollectionList = new Array(
		'CustomCollection',
		'StrangeEons'
	);

	this.standardCollectionList = new Array(
		[ 'CoreSet', 'core' ],
		[ 'TheDunwichLegacy', 'dunleg' ],
		[ 'CurseOfTheRougarou', 'ccurrou' ],
		[ 'CarnevaleOfHorrors', 'ccarhor' ],
		[ 'ThePathToCarcosa', 'carcosa' ],
		[ 'TheForgottenAge', 'forage' ]
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
		'Skull', 'Cultist', 'Artifact', 'Monster', 'ElderSign', 'Tentacle',
		'Unique', 'PerInvestigator', 'Prey', 'Spawn', 'Revelation', 'Forced',
		'Objective', 'Bullet', 'Resolution', 'EndResolution', 'GuideBullet'
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

	this.locationIcons = [ 'Circle', 'Square', 'Triangle', 'Cross', 'Diamond', 
		'Slash', 'T', 'Hourglass', 'Moon', 'DoubleSlash', 'Heart', 'Star', 'Quote' , 'CircleAlt', 'SquareAlt', 'TriangleAlt', 'CrossAlt', 'DiamondAlt',
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
}