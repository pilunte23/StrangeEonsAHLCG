importClass( javax.swing.JTextField );

function layoutTitle( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();	
	TitlePanel.setTitle( @AHLCG-Title );

	var titleField = new textField( '', 30 );
	
	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	TitlePanel.place( 
		@AHLCG-Title, 'align right', titleField, 'wrap, pushx, growx'
		);

	if (subtitle) {
		var subtitleField = new textField( '', 30 );
		bindings.add( 'Subtitle' + BindingSuffixes[bindingFaceIndex], subtitleField, updateFaces );

		TitlePanel.place( 
			@AHLCG-Subtitle, 'align right', subtitleField, 'wrap, pushx, growx'
			);
	}
	
	return TitlePanel;
}

// 2 lines
function layoutTitle2( diy, bindings, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();	
	TitlePanel.setTitle( @AHLCG-Title );

	var titleArea = new textArea( '', 2, 30 );
	
	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleArea );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleArea, updateFaces );

	TitlePanel.place( 
		@AHLCG-Title, 'align right', titleArea, 'wrap, pushx, growx'
		);

	return TitlePanel;
}

function layoutTitleUnique( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();
	TitlePanel.setTitle( @AHLCG-Title );

	var titleField = new textField( '', 30 );

	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	var uniqueIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-Unique.png'), 12, 12);
	var uniqueButton = new toggleButton( '', uniqueIcon, false );
	bindings.add( 'Unique' + BindingSuffixes[bindingFaceIndex], uniqueButton, updateFaces );

	TitlePanel.place( 
		@AHLCG-Title, 'align right', uniqueButton, 'split, wmax 35, hmin 25, hmax 25', titleField, 'wrap, pushx, growx'
		);

	if (subtitle) {
		var subtitleField = new textField( '', 30 );
		bindings.add( 'Subtitle' + BindingSuffixes[bindingFaceIndex], subtitleField, updateFaces );
		
		TitlePanel.place( 
			@AHLCG-Subtitle, 'align right', subtitleField, 'wrap, pushx, growx'
			);
	}
	
	return TitlePanel;
}

function layoutTitleScenario( diy, bindings, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();	
	TitlePanel.setTitle( @AHLCG-Title );

	var typeList = new comboBox( Eons.namedObjects.AHLCGObject.comboScenario, null );
	bindings.add( 'PageType' + BindingSuffixes[bindingFaceIndex], typeList, updateFaces );

	TitlePanel.place( 
		@AHLCG-Type, 'align right', typeList, 'wrap'
		);
	
	var titleField = new textField( '', 30 );
	
	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	TitlePanel.place( 
		@AHLCG-Title, 'align right', titleField, 'wrap, pushx, growx'
		);

	return TitlePanel;
}

function layoutTitleGuide( diy, bindings, updateFaces, bindingFaceIndex, portraitPanels ) {
	var TitlePanel = new Grid();	
	TitlePanel.setTitle( @AHLCG-Title );

	var TypeList = new comboBox( Eons.namedObjects.AHLCGObject.comboGuide, null );
	bindings.add( 'PageType' + BindingSuffixes[bindingFaceIndex], TypeList, updateFaces );

	// update portrait pan/scale, stencil
	TypeList.addActionListener( function updatePosition( actionEvent ) {
		try {
			// test is primarily to keep the region from resetting during loading
			if ( (String)(TypeList.getSelectedItem()) != $( 'PageType' + BindingSuffixes[bindingFaceIndex] ) ) {
				// have to do this now or the computes won't work
				diy.settings.set( 'PageType' + BindingSuffixes[bindingFaceIndex], (String)(TypeList.getSelectedItem()) );

				for ( let i = 0; i < portraitPanels.length; i++) {
					let region = getGuidePortraitRegion( diy, (String)($( 'PositionPortrait'+ (i+1) )) );
					let portrait = portraitPanels[i].portrait;
					let image = portrait.getImage();

					if ( region == null ) {
						portrait.pan = Point2D.Float( 0, 0 );
						portrait.scale = 1.0;
					}
					else {
						let image = portrait.image;
			
						let clipDimension = portrait.getClipDimensions();
					
						let coveringScale = ImageUtilities.idealCoveringScaleForImage( region.width, region.height, image.getWidth(), image.getHeight() );

						portrait.pan = Point2D.Float( region.x + (region.width - clipDimension.width) / 2, region.y + (region.height - clipDimension.height) / 2 );
						portrait.scale = ImageUtilities.idealCoveringScaleForImage( region.width, region.height, image.getWidth(), image.getHeight() );
						portrait.scale = coveringScale;

						portraitPanels[i].portrait = portrait;
					}
				
					portraitPanels[i].portrait = portrait;
				}
			}

			createPortraitStencil( diy, PortraitList[0], portraitPanels[0], $PositionPortrait1, (String)(TypeList.getSelectedItem()) );
			createPortraitStencil( diy, PortraitList[1], portraitPanels[1],  $PositionPortrait2, (String)(TypeList.getSelectedItem()) );
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	TitlePanel.place( 
		@AHLCG-Type, 'align right', TypeList, 'wrap, wmin 100'
		);
	
	var titleField = new textField( '', 30 );
	
	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	TitlePanel.place( 
		@AHLCG-Title, 'align right', titleField, 'wrap, pushx, growx'
		);

	return TitlePanel;
}

function layoutActStats( diy, bindings, faceIndex, portraitPanels ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var indexList = new comboBox( Eons.namedObjects.AHLCGObject.combo20, null );
	bindings.add( 'ScenarioIndex' + BindingSuffixes[faceIndex], indexList, [0, 1] );

	var deckList = new comboBox( [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ], null );
	bindings.add( 'ScenarioDeckID' + BindingSuffixes[faceIndex], deckList, [0, 1] );

	var cluesList = new comboBox( Eons.namedObjects.AHLCGObject.comboClues, null );
	bindings.add( 'Clues' + BindingSuffixes[faceIndex], cluesList, [0] );
		
	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [0] );

	var asteriskButton = new toggleButton( '*', null, false );
	bindings.add( 'Asterisk' + BindingSuffixes[faceIndex], asteriskButton, [0] );

	perInvestigatorButton.addActionListener( function updateButtons( actionEvent ) {
		asteriskButton.setSelected(false);
	});
	
	asteriskButton.addActionListener( function updateButtons( actionEvent ) {
		perInvestigatorButton.setSelected(false);		
	});	

	var orientationList = new comboBox( Eons.namedObjects.AHLCGObject.comboTemplateOrientation, null );
	bindings.add( 'Orientation' + BindingSuffixes[faceIndex], orientationList, [0] );

	// update portrait region, text box shape
	orientationList.addActionListener( function updatePosition( actionEvent ) {
		try {
			let orientationSetting = (String)(orientationList.getSelectedItem());
			
			updateReversableTextBoxShape( diy, orientationSetting );			

			let index = getPortraitIndex( 'Portrait' );
			let portrait = portraitPanels[index].portrait;
			
			let region = diy.settings.getRegion( 'AHLCG-Act-DefaultPortrait-portrait-clip-region',
				// default - if no DefaultPortrait defined, use normal Portrait
				diy.settings.getRegion( 'AHLCG-Act-Portrait-portrait-clip-region') );
			if ( orientationSetting == 'Reversed' ) region = reverseRegion( region );
			
			diy.settings.setRegion( 'AHLCG-Act-Portrait-portrait-clip-region', region );

			region = diy.settings.getRegion( 'AHLCG-Act-DefaultEncounter-portrait-clip-region',
				// default - if no DefaultPortrait defined, use normal Portrait
				diy.settings.getRegion( 'AHLCG-Act-Encounter-portrait-clip-region') );
			if ( orientationSetting == 'Reversed' ) region = reverseRegion( region );
			
			diy.settings.setRegion( 'AHLCG-Act-Encounter-portrait-clip-region', region );

			region = diy.settings.getRegion( 'AHLCG-Act-DefaultReturnEncounter-portrait-clip-region',
				// default - if no DefaultReturnPortrait defined, use normal ReturnPortrait
				diy.settings.getRegion( 'AHLCG-Act-ReturnEncounter-portrait-clip-region') );

			if ( orientationSetting == 'Reversed' ) region = reverseRegion( region );

			diy.settings.setRegion( 'AHLCG-Act-ReturnEncounter-portrait-clip-region', region );

			region = diy.settings.getRegion( 'AHLCG-Act-DefaultCollection-portrait-clip-region',
				// default - if no DefaultPortrait defined, use normal Portrait
				diy.settings.getRegion( 'AHLCG-Act-Collection-portrait-clip-region') );
			if ( orientationSetting == 'Reversed' ) region = shiftRegion( region, CardTypes[FACE_FRONT] );
			
			diy.settings.setRegion( 'AHLCG-Act-Collection-portrait-clip-region', region );
		} catch ( ex if ex instanceof ReferenceError ) {
			// means Body_box has not been created yet (during createInterface)
			// we can safely ignore this
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	StatPanel.place(
		@AHLCG-ActNumber, 'align right', indexList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Clues, 'align right, gapx 10', cluesList, 'pushx, growx, sizegroup sp', 
		perInvestigatorButton, 'wmax 35, hmin 25, hmax 25',
		asteriskButton, 'wrap, wmax 35, hmin 25, hmax 25',
		@AHLCG-ScenarioDeckID, 'align right', deckList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Orientation, 'align right, gapx 10', orientationList, 'pushx, growx, span 3'
		);
		
	return StatPanel;
}

function layoutAgendaStats( diy, bindings, faceIndex, portraitPanels ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	StatPanel.editorTabScrolling = true;

	var indexList = new comboBox( Eons.namedObjects.AHLCGObject.combo20, null );
	bindings.add( 'ScenarioIndex' + BindingSuffixes[faceIndex], indexList, [0, 1] );

	var deckList = new comboBox( [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ], null );
	bindings.add( 'ScenarioDeckID' + BindingSuffixes[faceIndex], deckList, [0, 1] );

	var doomList = new comboBox( Eons.namedObjects.AHLCGObject.comboClues, null );
	bindings.add( 'Doom' + BindingSuffixes[faceIndex], doomList, [0] );

	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [0] );

	var asteriskButton = new toggleButton( '*', null, false );
	bindings.add( 'Asterisk' + BindingSuffixes[faceIndex], asteriskButton, [0] );

	perInvestigatorButton.addActionListener( function updateButtons( actionEvent ) {
		asteriskButton.setSelected(false);
	});
	
	asteriskButton.addActionListener( function updateButtons( actionEvent ) {
		perInvestigatorButton.setSelected(false);		
	});	

	var orientationList = new comboBox( Eons.namedObjects.AHLCGObject.comboTemplateOrientation, null );
	bindings.add( 'Orientation' + BindingSuffixes[faceIndex], orientationList, [0] );

	// update portrait region, text box shape
	orientationList.addActionListener( function updatePosition( actionEvent ) {
		try {
			let orientationSetting = (String)(orientationList.getSelectedItem());
			
			updateReversableTextBoxShape( diy, orientationSetting );			

			let index = getPortraitIndex( 'Portrait' );
			let portrait = portraitPanels[index].portrait;
			
			let region = diy.settings.getRegion( 'AHLCG-Agenda-DefaultPortrait-portrait-clip-region',
				// default - if no PortraitCollection defined, use normal Portrait
				diy.settings.getRegion( 'AHLCG-Agenda-Portrait-portrait-clip-region') );
				
			if ( orientationSetting == 'Reversed' ) region = reverseRegion( region );			
		} catch ( ex if ex instanceof ReferenceError ) {
			// means Body_box has not been created yet (during createInterface)
			// we can safely ignore this
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	StatPanel.place(
		@AHLCG-AgendaNumber, 'align right', indexList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Doom, 'align right, gapx 10', doomList, 'pushx, growx, sizegroup sp',
		perInvestigatorButton, 'wmax 35, hmin 25, hmax 25',
		asteriskButton, 'wrap, wmax 35, hmin 25, hmax 25',
		@AHLCG-ScenarioDeckID, 'align right', deckList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Orientation, 'align right, gapx 10', orientationList, 'pushx, growx, span 3'
		);

	return StatPanel;
}

function layoutAgendaFrontPortraitStats( diy, bindings, faceIndex, portraitPanels ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	StatPanel.editorTabScrolling = true;

	var indexList = new comboBox( Eons.namedObjects.AHLCGObject.combo20, null );
	bindings.add( 'ScenarioIndex' + BindingSuffixes[faceIndex], indexList, [0, 1] );

	var deckList = new comboBox( [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ], null );
	bindings.add( 'ScenarioDeckID' + BindingSuffixes[faceIndex], deckList, [0, 1] );

	var doomList = new comboBox( Eons.namedObjects.AHLCGObject.comboClues, null );
	bindings.add( 'Doom' + BindingSuffixes[faceIndex], doomList, [0] );

	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [0] );

	var asteriskButton = new toggleButton( '*', null, false );
	bindings.add( 'Asterisk' + BindingSuffixes[faceIndex], asteriskButton, [0] );

	perInvestigatorButton.addActionListener( function updateButtons( actionEvent ) {
		asteriskButton.setSelected(false);
	});
	
	asteriskButton.addActionListener( function updateButtons( actionEvent ) {
		perInvestigatorButton.setSelected(false);		
	});	

	StatPanel.place(
		@AHLCG-AgendaNumber, 'align right', indexList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Doom, 'align right, gapx 10', doomList, 'pushx, growx, sizegroup sp',
		perInvestigatorButton, 'wmax 35, hmin 25, hmax 25',
		asteriskButton, 'wrap, wmax 35, hmin 25, hmax 25',
		@AHLCG-ScenarioDeckID, 'align right', deckList, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

function layoutAssetStats( bindings, faceIndex ) {
	var StatsPanel = new Grid();
	StatsPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var ClassList = new comboBox( AHLCGObject.comboClassesBW, null );
	bindings.add( 'CardClass' + BindingSuffixes[faceIndex], ClassList, [faceIndex] );
	
	var SkillList1 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill1' + BindingSuffixes[faceIndex], SkillList1, [faceIndex] );
	
	var SkillList2 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill2' + BindingSuffixes[faceIndex], SkillList2, [faceIndex] );
	
	var SkillList3 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill3' + BindingSuffixes[faceIndex], SkillList3, [faceIndex] );
	
	var SkillList4 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill4' + BindingSuffixes[faceIndex], SkillList4, [faceIndex] );
	
	var SkillList5 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill5' + BindingSuffixes[faceIndex], SkillList5, [faceIndex] );
	
	var SkillList6 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill6' + BindingSuffixes[faceIndex], SkillList6, [faceIndex] );
	
	var ClassList2 = new comboBox( AHLCGObject.comboClassesD, null );
	bindings.add( 'CardClass2' + BindingSuffixes[faceIndex], ClassList2, [faceIndex] );

	var CostList = new comboBox( AHLCGObject.comboCost, null );
	bindings.add( 'ResourceCost' + BindingSuffixes[faceIndex], CostList, [faceIndex] );

	var LevelList = new comboBox( AHLCGObject.comboLevelsN, null );
	bindings.add( 'Level' + BindingSuffixes[faceIndex], LevelList, [faceIndex] );

	var SlotList1 = new comboBox( AHLCGObject.comboSlots, null );
	bindings.add( 'Slot' + BindingSuffixes[faceIndex], SlotList1, [faceIndex] );
	
	var SlotList2 = new comboBox( AHLCGObject.comboSlots, null );
	bindings.add( 'Slot2' + BindingSuffixes[faceIndex], SlotList2, [faceIndex] );
	
	var StaminaList = new comboBox( AHLCGObject.comboAssetStamina, null );
	bindings.add( 'Stamina' + BindingSuffixes[faceIndex], StaminaList, [faceIndex] );
	
	var SanityList = new comboBox( AHLCGObject.comboAssetSanity, null );
	bindings.add( 'Sanity' + BindingSuffixes[faceIndex], SanityList, [faceIndex] );
	
	StatsPanel.place(
		@AHLCG-Class, 'align right', ClassList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Cost, 'align right, gapx 10', CostList, 'wrap, pushx, growx, sizegroup sp',		
		@AHLCG-Class2, 'align right, gapx 10', ClassList2, 'pushx, growx, sizegroup sp', 
		@AHLCG-Level, 'align right, gapx 10', LevelList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 1', 'align right', SkillList1, 'pushx, growx, sizegroup sp',
		@AHLCG-Slot1, 'align right, gapx 10', SlotList1, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 2', 'align right', SkillList2, 'pushx, growx, sizegroup sp',
		@AHLCG-Slot2, 'align right, gapx 10', SlotList2, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 3', 'align right', SkillList3, 'pushx, growx, sizegroup sp',
		@AHLCG-Stamina, 'align right, gapx 10', StaminaList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 4', 'align right', SkillList4, 'pushx, growx, sizegroup sp',
		@AHLCG-Sanity, 'align right, gapx 10', SanityList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 5', 'align right', SkillList5, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 6', 'align right', SkillList6, 'pushx, growx, sizegroup sp'
		);

	return StatsPanel;
}

function layoutAssetStoryStats( bindings, faceIndex ) {
	var StatsPanel = new Grid();
	StatsPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var ClassList = new comboBox( AHLCGObject.comboStoryAssetClasses, null );
	bindings.add( 'CardClass' + BindingSuffixes[faceIndex], ClassList, [faceIndex] );

	var SkillList1 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill1' + BindingSuffixes[faceIndex], SkillList1, [faceIndex] );
	
	var SkillList2 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill2' + BindingSuffixes[faceIndex], SkillList2, [faceIndex] );
	
	var SkillList3 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill3' + BindingSuffixes[faceIndex], SkillList3, [faceIndex] );
	
	var SkillList4 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill4' + BindingSuffixes[faceIndex], SkillList4, [faceIndex] );
	
	var SkillList5 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill5' + BindingSuffixes[faceIndex], SkillList5, [faceIndex] );
	
	var CostList = new comboBox( AHLCGObject.comboCost, null );
	bindings.add( 'ResourceCost' + BindingSuffixes[faceIndex], CostList, [faceIndex] );

	var SlotList1 = new comboBox( AHLCGObject.comboSlots, null );
	bindings.add( 'Slot' + BindingSuffixes[faceIndex], SlotList1, [faceIndex] );
	
	var SlotList2 = new comboBox( AHLCGObject.comboSlots, null );
	bindings.add( 'Slot2' + BindingSuffixes[faceIndex], SlotList2, [faceIndex] );
	
	var StaminaList = new comboBox( AHLCGObject.comboAssetStamina, null );
	bindings.add( 'Stamina' + BindingSuffixes[faceIndex], StaminaList, [faceIndex] );
	
	var SanityList = new comboBox( AHLCGObject.comboAssetSanity, null );
	bindings.add( 'Sanity' + BindingSuffixes[faceIndex], SanityList, [faceIndex] );
	
	StatsPanel.place(
		@AHLCG-Class, 'align right', ClassList, 'pushx, growx, sizegroup sp',
		@AHLCG-Cost, 'align right, gapx 10', CostList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 1', 'align right', SkillList1, 'pushx, growx, sizegroup sp',
		@AHLCG-Slot1, 'align right, gapx 10', SlotList1, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 2', 'align right', SkillList2, 'pushx, growx, sizegroup sp',
		@AHLCG-Slot2, 'align right, gapx 10', SlotList2, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 3', 'align right', SkillList3, 'pushx, growx, sizegroup sp',
		@AHLCG-Stamina, 'align right, gapx 10', StaminaList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 4', 'align right', SkillList4, 'pushx, growx, sizegroup sp',
		@AHLCG-Sanity, 'align right, gapx 10', SanityList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 5', 'align right', SkillList5, 'pushx, growx, sizegroup sp'
		);
		
	return StatsPanel;
}

function layoutEnemyStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var AttackList = new comboBox( AHLCGObject.comboEnemyStat, null );
	bindings.add( 'Attack' + BindingSuffixes[faceIndex], AttackList, [faceIndex] );

	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [faceIndex] );
	
	var HealthList = new comboBox( AHLCGObject.comboEnemyHealth, null );
	bindings.add( 'Health' + BindingSuffixes[faceIndex], HealthList, [faceIndex] );
	
	var EvadeList = new comboBox( AHLCGObject.comboEnemyStat, null );
	bindings.add( 'Evade' + BindingSuffixes[faceIndex], EvadeList, [faceIndex] );
	
	var DamageList = new comboBox( AHLCGObject.combo5, null );
	bindings.add( 'Damage' + BindingSuffixes[faceIndex], DamageList, [faceIndex] );
	
	var HorrorList = new comboBox( AHLCGObject.combo5, null );
	bindings.add( 'Horror' + BindingSuffixes[faceIndex], HorrorList, [faceIndex] );

	StatPanel.place(
		@AHLCG-Attack, 'align right', AttackList, 'pushx, growx, sizegroup sp, span 2',
		@AHLCG-Damage, 'align right, gapx 10', DamageList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Health, 'align right', HealthList, 'pushx, growx', perInvestigatorButton, 'wmax 35, hmin 25, hmax 25',
		@AHLCG-Horror, 'align right', HorrorList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Evade, 'align right', EvadeList, 'wrap, pushx, growx, sizegroup sp, span 2'
		);
		
	return StatPanel;
}

function layoutWeaknessEnemyStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var TypeList = new comboBox( AHLCGObject.comboWeaknessTypesI, null );
	bindings.add( 'Subtype' + BindingSuffixes[faceIndex], TypeList, [faceIndex] );
	
	var AttackList = new comboBox( AHLCGObject.comboEnemyStat, null );
	bindings.add( 'Attack' + BindingSuffixes[faceIndex], AttackList, [faceIndex] );
	
	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [faceIndex] );
	
	var HealthList = new comboBox( AHLCGObject.comboEnemyStat, null );
	bindings.add( 'Health' + BindingSuffixes[faceIndex], HealthList, [faceIndex] );
	
	var EvadeList = new comboBox( AHLCGObject.comboEnemyStat, null );
	bindings.add( 'Evade' + BindingSuffixes[faceIndex], EvadeList, [faceIndex] );
	
	var DamageList = new comboBox( AHLCGObject.combo5, null );
	bindings.add( 'Damage' + BindingSuffixes[faceIndex], DamageList, [faceIndex] );
	
	var HorrorList = new comboBox( AHLCGObject.combo5, null );
	bindings.add( 'Horror' + BindingSuffixes[faceIndex], HorrorList, [faceIndex] );

	StatPanel.place(
		@AHLCG-Type, 'align right', TypeList, 'pushx, growx, sizegroup sp, span 2',
		@AHLCG-Damage, 'align right, gapx 10', DamageList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Attack, 'align right', AttackList, 'pushx, growx, sizegroup sp, span 2',
		@AHLCG-Horror, 'align right, gapx 10', HorrorList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Health, 'align right', HealthList, 'pushx, growx', perInvestigatorButton, 'wrap, wmax 35, hmin 25, hmax 25',
		@AHLCG-Evade, 'align right', EvadeList, 'wrap, pushx, growx, sizegroup sp, span 2'
		);
		
	return StatPanel;
}

function layoutEventStats( diy, bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var ClassList = new comboBox( Eons.namedObjects.AHLCGObject.comboClassesBW, null );
	bindings.add( 'CardClass' + BindingSuffixes[faceIndex], ClassList, [faceIndex] );

	ClassList.addActionListener( function updateShape( actionEvent ) {
		try {
			let className = (String)(ClassList.getSelectedItem());
			if ( className == 'Weakness' || className == 'BasicWeakness' ) {
//				createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'WeaknessBody-region') ) );
				setTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'WeaknessBody-region') ) );
			}
			else {
//				createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );			
				setTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );
			}
		} catch ( ex if ex instanceof ReferenceError ) {
			// means Body_box has not been created yet (during createInterface)
			// we can safely ignore this
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	var SkillList1 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill1' + BindingSuffixes[faceIndex], SkillList1, [faceIndex] );

	var SkillList2 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill2' + BindingSuffixes[faceIndex], SkillList2, [faceIndex] );
	
	var SkillList3 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill3' + BindingSuffixes[faceIndex], SkillList3, [faceIndex] );
	
	var SkillList4 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill4' + BindingSuffixes[faceIndex], SkillList4, [faceIndex] );
	
	var SkillList5 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill5' + BindingSuffixes[faceIndex], SkillList5, [faceIndex] );
	
	var CostList = new comboBox( AHLCGObject.comboCost, null );
	bindings.add( 'ResourceCost' + BindingSuffixes[faceIndex], CostList, [faceIndex] );

	var LevelList = new comboBox( AHLCGObject.comboLevelsN, null );
	bindings.add( 'Level' + BindingSuffixes[faceIndex], LevelList, [faceIndex] );

	StatPanel.place(
		@AHLCG-Class, 'align right', ClassList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Cost, 'align right, gapx 10', CostList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 1', 'align right', SkillList1, 'pushx, growx, sizegroup sp',
		@AHLCG-Level, 'align right, gapx 10', LevelList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 2', 'align right', SkillList2, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 3', 'align right', SkillList3, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 4', 'align right', SkillList4, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 5', 'align right', SkillList5, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

function layoutInvestigatorStats( diy, bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var ClassList = new comboBox( AHLCGObject.comboClassesI, null );
	bindings.add( 'CardClass' + BindingSuffixes[faceIndex], ClassList, [0, 1] );

	ClassList.addActionListener( function updateShape( actionEvent ) {
		try {
//			createBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ), (String)(ClassList.getSelectedItem()) );			
			setBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ), (String)(ClassList.getSelectedItem() ) );
		} catch ( ex if ex instanceof ReferenceError ) {
			// means Body_box has not been created yet (during createInterface)
			// we can safely ignore this
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	var WillpowerList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Willpower' + BindingSuffixes[faceIndex], WillpowerList, [faceIndex] );
	
	var IntellectList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Intellect' + BindingSuffixes[faceIndex], IntellectList, [faceIndex] );
	
	var CombatList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Combat' + BindingSuffixes[faceIndex], CombatList, [faceIndex] );
	
	var AgilityList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Agility' + BindingSuffixes[faceIndex], AgilityList, [faceIndex] );
	
	var StaminaList = new comboBox( AHLCGObject.comboInvestigatorHealth, null );
	bindings.add( 'Stamina' + BindingSuffixes[faceIndex], StaminaList, [faceIndex] );
	
	var SanityList = new comboBox( AHLCGObject.comboInvestigatorHealth, null );
	bindings.add( 'Sanity' + BindingSuffixes[faceIndex], SanityList, [faceIndex] );
	
	StatPanel.place(
		@AHLCG-Class, 'align right', ClassList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Skill-Willpower, 'align right, gapx 10', WillpowerList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Stamina, 'align right', StaminaList, 'pushx, growx, sizegroup sp',
		@AHLCG-Skill-Intellect, 'align right, gapx 10', IntellectList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Sanity, 'align right', SanityList, 'pushx, growx, sizegroup sp',
		@AHLCG-Skill-Combat, 'align right, gapx 10', CombatList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Skill-Agility, 'align right, skip 2', AgilityList, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

function layoutStoryInvestigatorStats( diy, bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var WillpowerList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Willpower' + BindingSuffixes[faceIndex], WillpowerList, [faceIndex] );
	
	var IntellectList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Intellect' + BindingSuffixes[faceIndex], IntellectList, [faceIndex] );
	
	var CombatList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Combat' + BindingSuffixes[faceIndex], CombatList, [faceIndex] );
	
	var AgilityList = new comboBox( AHLCGObject.comboStat, null );
	bindings.add( 'Agility' + BindingSuffixes[faceIndex], AgilityList, [faceIndex] );
	
	var StaminaList = new comboBox( AHLCGObject.comboInvestigatorHealth, null );
	bindings.add( 'Stamina' + BindingSuffixes[faceIndex], StaminaList, [faceIndex] );
	
	var SanityList = new comboBox( AHLCGObject.comboInvestigatorHealth, null );
	bindings.add( 'Sanity' + BindingSuffixes[faceIndex], SanityList, [faceIndex] );
	
	StatPanel.place(
		@AHLCG-Stamina, 'align right', StaminaList, 'pushx, growx, sizegroup sp',
		@AHLCG-Skill-Willpower, 'align right, gapx 10', WillpowerList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Sanity, 'align right', SanityList, 'pushx, growx, sizegroup sp',
		@AHLCG-Skill-Intellect, 'align right, gapx 10', IntellectList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Skill-Combat, 'align right, skip 2', CombatList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Skill-Agility, 'align right, skip 2', AgilityList, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

// no back type
function layoutLocationBackStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var ShroudList = new comboBox( Eons.namedObjects.AHLCGObject.comboX20, null );
	bindings.add( 'Shroud' + BindingSuffixes[faceIndex], ShroudList, [faceIndex] );
	
	var CluesList = new comboBox( Eons.namedObjects.AHLCGObject.comboX20, null );
	bindings.add( 'Clues' + BindingSuffixes[faceIndex], CluesList, [faceIndex] );
	
	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [faceIndex] );

	StatPanel.place(
		@AHLCG-Shroud, 'align right', ShroudList, 'pushx, growx, sizegroup sp',
		@AHLCG-Clues, 'align right', CluesList, 'pushx, growx, sizegroup sp', perInvestigatorButton, 'wmax 35, hmin 25, hmax 25'
		);

	return StatPanel;
}

// includes back type list
function layoutLocationStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var ShroudList = new comboBox( Eons.namedObjects.AHLCGObject.comboX20, null );
	bindings.add( 'Shroud' + BindingSuffixes[faceIndex], ShroudList, [0] );
	
	var CluesList = new comboBox( Eons.namedObjects.AHLCGObject.comboX20, null );
	bindings.add( 'Clues' + BindingSuffixes[faceIndex], CluesList, [0] );
	
	var perInvestigatorIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-PerInvestigator.png'), 12, 12);
	var perInvestigatorButton = new toggleButton( '', perInvestigatorIcon, false );
	bindings.add( 'PerInvestigator' + BindingSuffixes[faceIndex], perInvestigatorButton, [0] );

	var BackList = new comboBox( Eons.namedObjects.AHLCGObject.comboLocationBacks, null);
	bindings.add( 'BackType' + BindingSuffixes[faceIndex], BackList, [1] );
 		
 	BackList.addActionListener( function updateShape( actionEvent ) {
		try {
			if ( (String)(BackList.getSelectedItem()) == 'Player' ) {
				$AHLCG-LocationBack-Default-template = 'ArkhamHorrorLCG/templates/AHLCG-PlayerBack.jp2';				
			}
			else if ( (String)(BackList.getSelectedItem()) == 'Encounter' ) {
				$AHLCG-LocationBack-Default-template = 'ArkhamHorrorLCG/templates/AHLCG-EncounterBack.jp2';
			}
			else {
				$AHLCG-LocationBack-Default-template = 'ArkhamHorrorLCG/templates/AHLCG-LocationBack.jp2';
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	StatPanel.place(
		@AHLCG-Shroud, 'align right', ShroudList, 'pushx, growx, sizegroup sp',
		@AHLCG-Clues, 'align right', CluesList, 'pushx, growx, sizegroup sp', perInvestigatorButton, 'wmax 35, hmin 25, hmax 25, wrap',
		@AHLCG-Back, 'align right', BackList, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

function layoutScenarioStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var pageSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Page' + BindingSuffixes[faceIndex], pageSpinner, [0, 1] );
		
	StatPanel.place(
		@AHLCG-Page, 'align right, gapx 10', pageSpinner, 'wrap'
		);
		
	return StatPanel;
}

function layoutSkillStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var ClassList = new comboBox( AHLCGObject.comboClassesW, null );
	bindings.add( 'CardClass' + BindingSuffixes[faceIndex], ClassList, [faceIndex] );
	
	var SkillList1 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill1' + BindingSuffixes[faceIndex], SkillList1, [faceIndex] );
	
	var SkillList2 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill2' + BindingSuffixes[faceIndex], SkillList2, [faceIndex] );
	
	var SkillList3 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill3' + BindingSuffixes[faceIndex], SkillList3, [faceIndex] );
	
	var SkillList4 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill4' + BindingSuffixes[faceIndex], SkillList4, [faceIndex] );
	
	var SkillList5 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill5' + BindingSuffixes[faceIndex], SkillList5, [faceIndex] );
	
	var SkillList6 = new comboBox( AHLCGObject.comboSkills, null );
	bindings.add( 'Skill6' + BindingSuffixes[faceIndex], SkillList6, [faceIndex] );
	
	var LevelList = new comboBox( AHLCGObject.comboLevelsN, null );
	bindings.add( 'Level' + BindingSuffixes[faceIndex], LevelList, [faceIndex] );

	StatPanel.place(
		@AHLCG-Class, 'align right', ClassList, 'pushx, growx, sizegroup sp', 
		@AHLCG-Level, 'align right, gapx 10', LevelList, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 1', 'align right', SkillList1, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 2', 'align right', SkillList2, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 3', 'align right', SkillList3, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 4', 'align right', SkillList4, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 5', 'align right', SkillList5, 'wrap, pushx, growx, sizegroup sp',
		@AHLCG-Icon + ' 6', 'align right', SkillList6, 'pushx, growx, sizegroup sp'
		);
		
	return StatPanel;
}

function layoutWeaknessStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var TypeList = new comboBox( AHLCGObject.comboWeaknessTypes, null );
	bindings.add( 'Subtype' + BindingSuffixes[faceIndex], TypeList, [faceIndex] );
	
	StatPanel.place(
		@AHLCG-Type, 'align right', TypeList, 'pushx, growx, sizegroup sp'
		);
		
	return StatPanel;
}

function layoutBackTypeStats( diy, bindings, faceIndex ) {
	var StatsPanel = new Grid();
	StatsPanel.setTitle( @AHLCG-BasicData );

	var BackList = new comboBox( Eons.namedObjects.AHLCGObject.comboBacks, null );
	bindings.add( 'BackType' + BindingSuffixes[faceIndex], BackList, [ 1 ] );
	
	BackList.addActionListener( function updateShape( actionEvent ) {
		try {
			if ( (String)(BackList.getSelectedItem()) == 'Player' ) {
				diy.settings.set( 'AHLCG-' + CardTypes[1] + '-Default-template', 'ArkhamHorrorLCG/templates/AHLCG-PlayerBack.jp2' );
			}
			else {
				diy.settings.set( 'AHLCG-' + CardTypes[1] + '-Default-template', 'ArkhamHorrorLCG/templates/AHLCG-EncounterBack.jp2' );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	StatsPanel.place(
		@AHLCG-Back, 'align right ', BackList, 'wrap, width 40%'
		);
		
	return StatsPanel;
}

function layoutGuideStats( bindings, faceIndex ) {
	var StatsPanel = new Grid();
	StatsPanel.setTitle( @AHLCG-BasicData );

	var pageSpinner = new spinner( 0, 100, 1, 1 );
	bindings.add( 'Page' + BindingSuffixes[faceIndex], pageSpinner, [0] );
		
	StatsPanel.place(
		@AHLCG-Page, 'align right, gapx 10', pageSpinner, 'wrap'
		);
		
	return StatsPanel;
}

function layoutChaosStats( bindings, faceIndex ) {
	var StatsPanel = new Grid();	
	StatsPanel.setTitle( @AHLCG-BasicData );

	var trackerField = new textField( '', 30 );
	bindings.add( 'TrackerBox', trackerField, [0,1] );

	StatsPanel.place( 
		@AHLCG-TrackerBox, 'align right', trackerField, 'wrap, pushx, growx'
		);
	
	return StatsPanel;
}

function layoutStoryStats( bindings, faceIndex ) {
	var StatPanel = new Grid();
	StatPanel.setTitle( @AHLCG-BasicData );

	var TemplateList = new comboBox( Eons.namedObjects.AHLCGObject.comboStoryTemplate, null );
	bindings.add( 'Template' + BindingSuffixes[faceIndex], TemplateList, [faceIndex] );
	
	TemplateList.addActionListener( function updateTemplate( actionEvent ) {
		if ( (String)(TemplateList.getSelectedItem()) == 'Story' ) {
 			CardTypes[faceIndex] = 'Story';
 		}
 		else {
 			CardTypes[faceIndex] = 'Chaos';
 		}
	});
	
	StatPanel.place(
		@AHLCG-Template, 'align right', TemplateList, 'pushx, growx, sizegroup sp'
		);

	return StatPanel;
}

function layoutConnections( bindings, updateFaces, faceIndex ) {
	var ConnectionPanel = new Grid();
	ConnectionPanel.setTitle( @AHLCG-Connections );

	var ConnectionArray = Eons.namedObjects.AHLCGObject.comboConnections;
	if ( faceIndex == FACE_BACK ) ConnectionArray = Eons.namedObjects.AHLCGObject.comboConnectionsBack;

	var LocationIconList = new comboBox( ConnectionArray, null );
	bindings.add( 'LocationIcon' + BindingSuffixes[faceIndex], LocationIconList, [0, 1] );

	var ConnectionList1 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection1Icon' + BindingSuffixes[faceIndex], ConnectionList1, updateFaces );

	var ConnectionList2 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection2Icon' + BindingSuffixes[faceIndex], ConnectionList2, updateFaces );

	var ConnectionList3 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection3Icon' + BindingSuffixes[faceIndex], ConnectionList3, updateFaces );

	var ConnectionList4 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection4Icon' + BindingSuffixes[faceIndex], ConnectionList4, updateFaces );

	var ConnectionList5 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection5Icon' + BindingSuffixes[faceIndex], ConnectionList5, updateFaces );

	var ConnectionList6 = new comboBox( ConnectionArray, null );
	bindings.add( 'Connection6Icon' + BindingSuffixes[faceIndex], ConnectionList6, updateFaces );

	ConnectionPanel.place( 
		@AHLCG-Icon, 'align right', LocationIconList, 'wrap, pushx, growx, sizegroup sp',
		'1', 'align right', ConnectionList1, 'pushx, growx, sizegroup sp',
		'4', 'align right, gapx 10', ConnectionList4, 'wrap, pushx, growx, sizegroup sp',
		'2', 'align right', ConnectionList2, 'pushx, growx, sizegroup sp',
		'5', 'align right, gapx 10', ConnectionList5, 'wrap, pushx, growx, sizegroup sp',
		'3', 'align right', ConnectionList3, 'pushx, growx, sizegroup sp',
		'6', 'align right, gapx 10', ConnectionList6, 'wrap, pushx, growx, sizegroup sp'
		);

	return ConnectionPanel;
}

function layoutCopyright( bindings, faces, faceIndex ) {
	var CopyrightPanel = new Grid();
	CopyrightPanel.setTitle( @AHLCG-CopyrightTitle );

	var copyrightField = new textField( '', 30 );
	bindings.add( 'Copyright', copyrightField, faces );

	CopyrightPanel.place( 
		@AHLCG-Copyright, 'align right', copyrightField, 'pushx, growx',
		new tipButton( @( 'AHLCG-CopyrightTip1' ) ), 'wrap, aligny top, gaptop 5'
		);
	
	return CopyrightPanel;
}

function layoutText( bindings, parts, suffix, faceIndex ) {	
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Rules );
	
	var tipCount = 0;

	for ( let index = 0; index < parts.length; index++ ) {
		let base = parts[index];
		let key = base + suffix;
		let tipkey = base;
		let tipAlign = 0;
		
		let field = null;
		let spaceSpinner = null;

		switch ( base ) {
			case 'Traits':
				field = new textField( '', 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
				
				tipCount = 4;
				tipAlign = 1;	// horizontal
				break;
			case 'Keywords':
				field = new textArea( '', 6, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 1;
				break;
			case 'Rules':
				var height = 6;
				if ( CardTypes[faceIndex] == 'Scenario' ) height = 18;
				else if ( CardTypes[faceIndex] == 'Guide75' ) height = 40;
				else if ( CardTypes[faceIndex] == 'GuideA4' ) height = 40;
				
				field = new textArea( '', height, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				if ( CardTypes[faceIndex] == 'Guide75' ) tipCount = 3;
				else if ( CardTypes[faceIndex] == 'GuideA4' )  tipCount = 3;
				else tipCount = 2;
				break;
			case 'Header':
				field = new textArea( '', 2, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 0;
				break;
			case 'Victory':
//				if ( CardTypes[faceIndex] == 'Location' ) {
					field = new textArea( '', 2, 30 );
					bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
//				}
//				else {
//					field = new textField( '', 30 );
//					bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
//				}
				
				tipCount = 1;
				break;
			default:
				field = new textArea( '', 6, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
				
				tipCount = 0;
				break;	
		}

		switch ( tipCount ) {
			case 0:
				TextPanel.place(
					@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'wrap, pushx, growx'
				);
				break;
			case 1:
				TextPanel.place(
					@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'pushx, growx'
				);
				break;
			default:
				if ( tipAlign == 0 ) {
					TextPanel.place(
						@( 'AHLCG-' + base ), 'spany ' + tipCount + ', aligny top, gaptop 5, align right', field, 'spany ' + tipCount + ', pushx, growx'
					);
				}
				else {
					TextPanel.place(
						@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'split' + tipCount + ', pushx, growx'
					);
				}
				break;
		}

		for ( let tipIndex = 1; tipIndex <= tipCount; tipIndex++ ) {
			if ( @( 'AHLCG-' + base + 'Tip' ) != null ) {
				if ( tipAlign == 0 || tipIndex == tipCount ) {
					TextPanel.place(
						new tipButton( @( 'AHLCG-' + base + 'Tip' + tipIndex ) ), 'wrap, aligny top, gaptop 5'
					);
				}
				else
				{
					TextPanel.place(
						new tipButton( @( 'AHLCG-' + base + 'Tip' + tipIndex ) ), 'aligny top, gaptop 5'
					);
				}
			}
		}

		// don't do this for the last one
		if (index + 1 < parts.length ) {
			var spaceSpinner = new spinner( 0, 50, 1, 1 );

			bindings.add( key + BindingSuffixes[faceIndex] + 'Spacing', spaceSpinner, [ faceIndex ] );

			TextPanel.place(
				@AHLCG-Spacing, 'align right', spaceSpinner, 'wrap'
			);
		}
	}

	return TextPanel;
}

function layoutVictoryText( bindings, faceIndex ) {	
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Victory );
	
	var spaceSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Victory' + BindingSuffixes[faceIndex] + 'Spacing', spaceSpinner, [ faceIndex ] );

	var field = new textArea( '', 2, 30 );
	bindings.add( 'Victory' + BindingSuffixes[faceIndex], field, [ faceIndex ] );
				
	var tip = new tipButton( @AHLCG-VictoryTip1 );

	TextPanel.place(
		@AHLCG-Spacing, 'align right', spaceSpinner, 'wrap',
		@AHLCG-Victory, 'aligny top, gaptop 5, align right', field, 'pushx, growx',
		tip, 'wrap, aligny top, gaptop 5'
	);

	return TextPanel;
}

function layoutInvestigatorTextBack( diy, bindings, faceIndex ) {
	var StylePanel = new Grid();
	StylePanel.setTitle( @AHLCG-Sections );
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Rules );
	
	var StandardButton = new button( @AHLCG-Standard );
	var PrologueButton = new button( @AHLCG-TCUPrologue );

	StylePanel.place(
		StandardButton, 'pushx, growx',
		PrologueButton, 'pushx, growx'
		);

	var name1 = new textField( '', 30 );
	bindings.add( 'Text1Name' + BindingSuffixes[faceIndex], name1, [ faceIndex ] );
	var text1 = new textArea( '', 4, 30, true );
	bindings.add( 'Text1' + BindingSuffixes[faceIndex], text1, [faceIndex] );
	var spinner1 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text1' + BindingSuffixes[faceIndex] + 'Spacing', spinner1, [faceIndex] );
		
	var name2 = new textField( '', 30 );
	bindings.add( 'Text2Name' + BindingSuffixes[faceIndex], name2, [ faceIndex ] );
	var text2 = new textArea( '', 4, 30, true );
	bindings.add( 'Text2' + BindingSuffixes[faceIndex], text2, [faceIndex] );
	var spinner2 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text2' + BindingSuffixes[faceIndex] + 'Spacing', spinner2, [faceIndex] );

	var name3 = new textField( '', 30 );
	bindings.add( 'Text3Name' + BindingSuffixes[faceIndex], name3, [ faceIndex ] );
	var text3 = new textArea( '', 4, 30, true );
	bindings.add( 'Text3' + BindingSuffixes[faceIndex], text3, [faceIndex] );
	var spinner3 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text3' + BindingSuffixes[faceIndex] + 'Spacing', spinner3, [faceIndex] );

	var name4 = new textField( '', 30 );
	bindings.add( 'Text4Name' + BindingSuffixes[faceIndex], name4, [ faceIndex ] );
	var text4 = new textArea( '', 4, 30, true );
	bindings.add( 'Text4' + BindingSuffixes[faceIndex], text4, [faceIndex] );
	var spinner4 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text4' + BindingSuffixes[faceIndex] + 'Spacing', spinner4, [faceIndex] );

	var name5 = new textField( '', 30 );
	bindings.add( 'Text5Name' + BindingSuffixes[faceIndex], name5, [ faceIndex ] );
	var text5 = new textArea( '', 4, 30, true );
	bindings.add( 'Text5' + BindingSuffixes[faceIndex], text5, [faceIndex] );
	var spinner5 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text5' + BindingSuffixes[faceIndex] + 'Spacing', spinner5, [faceIndex] );

	var name6 = new textField( '', 30 );
	bindings.add( 'Text6Name' + BindingSuffixes[faceIndex], name6, [ faceIndex ] );
	var text6 = new textArea( '', 4, 30, true );
	bindings.add( 'Text6' + BindingSuffixes[faceIndex], text6, [faceIndex] );
	var spinner6 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text6' + BindingSuffixes[faceIndex] + 'Spacing', spinner6, [faceIndex] );

	var name7 = new textField( '', 30 );
	bindings.add( 'Text7Name' + BindingSuffixes[faceIndex], name7, [ faceIndex ] );
	var text7 = new textArea( '', 4, 30, true );
	bindings.add( 'Text7' + BindingSuffixes[faceIndex], text7, [faceIndex] );
	var spinner7 = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Text7' + BindingSuffixes[faceIndex] + 'Spacing', spinner7, [faceIndex] );

	var name8 = new textField( '', 30 );
	bindings.add( 'Text8Name' + BindingSuffixes[faceIndex], name8, [ faceIndex ] );
	var text8 = new textArea( '', 4, 30, true );
	bindings.add( 'Text8' + BindingSuffixes[faceIndex], text8, [faceIndex] );

	var storyText = new textArea( '', 12, 30, true );
	bindings.add( 'InvStory' + BindingSuffixes[faceIndex], storyText, [faceIndex] );

	TextPanel.place(
		@AHLCG-Section + ' 1', 'align right', name1, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text1, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner1, 'wrap',
		@AHLCG-Section + ' 2', 'align right', name2, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text2, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner2, 'wrap',
		@AHLCG-Section + ' 3', 'align right', name3, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text3, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner3, 'wrap',
		@AHLCG-Section + ' 4', 'align right', name4, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text4, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner4, 'wrap',
		@AHLCG-Section + ' 5', 'align right', name5, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text5, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner5, 'wrap',
		@AHLCG-Section + ' 6', 'align right', name6, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text6, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner6, 'wrap',
		@AHLCG-Section + ' 7', 'align right', name7, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text7, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', spinner7, 'wrap',
		@AHLCG-Section + ' 8', 'align right', name8, 'wrap, pushx, growx', 
		@AHLCG-Text, 'align right', text8, 'wrap, pushx, growx',
		@AHLCG-Story, 'align right', storyText, 'pushx, growx'
		);

	StandardButton.addActionListener( function updateHeaders( actionEvent ) {
//		name1.setText('Testing');
		name1.setText( 'Deck Size' );
		name2.setText( 'Secondary Class Choice' );
		name3.setText( 'Deckbuilding Options' );
		name4.setText( 'Deckbuilding Requirements</b> (do not count toward deck size)' );
		name5.setText( 'Deckbuilding Restrictions' );
		name6.setText( 'Additional Requirements' );
		name7.setText( 'Additional Restrictions' );
		name8.setText( '' );

		text1.viewport.getView().setText('30.');
		text2.viewport.getView().setText('');
		text3.viewport.getView().setText('');
		text4.viewport.getView().setText('');
		text5.viewport.getView().setText('');
		text6.viewport.getView().setText('');
		text7.viewport.getView().setText('');
		text8.viewport.getView().setText('');
	});
		
	PrologueButton.addActionListener( function updateHeaders( actionEvent ) {
		name1.setText( 'Setup' );
		name2.setText( 'Starting Play Area' );
		name3.setText( 'Opening Hand' );
		name4.setText( '' );
		name5.setText( '' );
		name6.setText( '' );
		name7.setText( '' );
		name8.setText( '' );

		text1.viewport.getView().setText('');
		text2.viewport.getView().setText('');
		text3.viewport.getView().setText('');
		text4.viewport.getView().setText('');
		text5.viewport.getView().setText('');
		text6.viewport.getView().setText('');
		text7.viewport.getView().setText('');
		text8.viewport.getView().setText('');
	});

	return [ StylePanel, TextPanel ];
}
/*
function layoutInvestigatorTextBack( bindings, faceIndex ) {
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Rules );
	
	var deckSizeText = new textArea( '', 2, 30, true );
	bindings.add( 'DeckSize' + BindingSuffixes[faceIndex], deckSizeText, [faceIndex] );

	var sizeSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'DeckSize' + BindingSuffixes[faceIndex] + 'Spacing', sizeSpinner, [faceIndex] );

	var secondaryClassText = new textArea( '', 4, 30, true );
	bindings.add( 'SecondaryClass' + BindingSuffixes[faceIndex], secondaryClassText, [faceIndex] );

	var secondarySpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'SecondaryClass' + BindingSuffixes[faceIndex] + 'Spacing', secondarySpinner, [faceIndex] );

	var deckOptionsText = new textArea( '', 4, 30, true );
	bindings.add( 'DeckOptions' + BindingSuffixes[faceIndex], deckOptionsText, [faceIndex] );
	
	var optionsSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'DeckOptions' + BindingSuffixes[faceIndex] + 'Spacing', optionsSpinner, [faceIndex] );

	var deckRequirementsText = new textArea( '', 4, 30, true );
	bindings.add( 'DeckRequirements' + BindingSuffixes[faceIndex], deckRequirementsText, [faceIndex] );

	var requirementsSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'DeckRequirements' + BindingSuffixes[faceIndex] + 'Spacing', requirementsSpinner, [faceIndex] );

	var deckRestrictionsText = new textArea( '', 4, 30, true );
	bindings.add( 'DeckRestrictions' + BindingSuffixes[faceIndex], deckRestrictionsText, [faceIndex] );

	var restrictionsSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'DeckRestrictions' + BindingSuffixes[faceIndex] + 'Spacing', restrictionsSpinner, [faceIndex] );

	var additionalRequirementsText = new textArea( '', 4, 30, true );
	bindings.add( 'AdditionalRequirements' + BindingSuffixes[faceIndex], additionalRequirementsText, [faceIndex] );

	var additionalRequirementsSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'AdditionalRequirements' + BindingSuffixes[faceIndex] + 'Spacing', additionalRequirementsSpinner, [faceIndex] );
/-*
	var setupText = new textArea( '', 4, 30, true );
	bindings.add( 'Setup' + BindingSuffixes[faceIndex], setupText, [faceIndex] );

	var setupSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'Setup' + BindingSuffixes[faceIndex] + 'Spacing', setupSpinner, [faceIndex] );

	var playAreaText = new textArea( '', 4, 30, true );
	bindings.add( 'StartingPlayArea' + BindingSuffixes[faceIndex], playAreaText, [faceIndex] );

	var playAreaSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'StartingPlayArea' + BindingSuffixes[faceIndex] + 'Spacing', playAreaSpinner, [faceIndex] );

	var handText = new textArea( '', 4, 30, true );
	bindings.add( 'OpeningHand' + BindingSuffixes[faceIndex], handText, [faceIndex] );

	var handSpinner = new spinner( 0, 50, 1, 1 );
	bindings.add( 'OpeningHand' + BindingSuffixes[faceIndex] + 'Spacing', handSpinner, [faceIndex] );
*-/
	var storyText = new textArea( '', 12, 30, true );
	bindings.add( 'InvStory' + BindingSuffixes[faceIndex], storyText, [faceIndex] );

	TextPanel.place(
		@AHLCG-DeckSize, 'align right', deckSizeText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', sizeSpinner, 'wrap',
		@AHLCG-SecondaryClass, 'align right', secondaryClassText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', secondarySpinner, 'wrap',
		@AHLCG-DeckOptions, 'align right', deckOptionsText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', optionsSpinner, 'wrap',
		@AHLCG-DeckRequirements, 'align right', deckRequirementsText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', requirementsSpinner, 'wrap',
		@AHLCG-DeckRestrictions, 'align right', deckRestrictionsText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', restrictionsSpinner, 'wrap',
		@AHLCG-AdditionalRequirements, 'align right', additionalRequirementsText, 'wrap, pushx, growx',
		@AHLCG-Spacing, 'align right', additionalRequirementsSpinner, 'wrap',
//		@AHLCG-Setup, 'align right', setupText, 'wrap, pushx, growx',
//		@AHLCG-Spacing, 'align right', setupSpinner, 'wrap',
//		@AHLCG-StartingPlayArea, 'align right', playAreaText, 'wrap, pushx, growx',
//		@AHLCG-Spacing, 'align right', playAreaSpinner, 'wrap',
//		@AHLCG-OpeningHand, 'align right', handText, 'wrap, pushx, growx',
//		@AHLCG-Spacing, 'align right', handSpinner, 'wrap',
		@AHLCG-Story, 'align right', storyText, 'pushx, growx'
		);

	return TextPanel;
}
*/
// header = story/chaos
function layoutChaosText( bindings, faceIndex, header ) {
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Rules );
	
	var headerText = null;
	
	if (header) {
		headerText = new textArea( '', 2, 30, true );
		bindings.add( 'Header' + BindingSuffixes[faceIndex], headerText, [faceIndex]);
	}
	
	var skullText = new textArea( '', 6, 30, true );
	bindings.add( 'Skull' + BindingSuffixes[faceIndex], skullText, [faceIndex]);

	var skullSpinner = new spinner( 0, 50, 0, 1 );
	bindings.add( 'Skull' + BindingSuffixes[faceIndex] + 'Spacing', skullSpinner, [faceIndex] );
			
	var skullMergeList = new comboBox( new Array (
		ListItem( 'None', @AHLCG-Chaos-None ),
		ListItem( 'Cultist', @AHLCG-Chaos-Cultist ),
		ListItem( 'Tablet', @AHLCG-Chaos-Tablet ),
		ListItem( 'ElderThing', @AHLCG-Chaos-ElderThing )
		), null );
	bindings.add( 'MergeSkull' + BindingSuffixes[faceIndex], skullMergeList, [faceIndex] );
			
	var cultistText = new textArea( '', 6, 30, true );
	bindings.add( 'Cultist' + BindingSuffixes[faceIndex], cultistText, [faceIndex] );

	var cultistSpinner = new spinner( 0, 50, 0, 1 );
	bindings.add( 'Cultist' + BindingSuffixes[faceIndex] + 'Spacing', cultistSpinner, [faceIndex] );
			
	var cultistMergeList = new comboBox( new Array (
		ListItem( 'None', @AHLCG-Chaos-None ),
		ListItem( 'Tablet', @AHLCG-Chaos-Tablet ),
		ListItem( 'ElderThing', @AHLCG-Chaos-ElderThing )
		), null );
	bindings.add( 'MergeCultist' + BindingSuffixes[faceIndex], cultistMergeList, [faceIndex] );
		
	var tabletText = new textArea( '', 6, 30, true );
	bindings.add( 'Tablet' + BindingSuffixes[faceIndex], tabletText, [faceIndex] );

	var tabletSpinner = new spinner( 0, 50, 0, 1 );
	bindings.add( 'Tablet' + BindingSuffixes[faceIndex] + 'Spacing', tabletSpinner, [faceIndex] );
			
	var tabletMergeList = new comboBox( new Array (
		ListItem( 'None', @AHLCG-Chaos-None ),
		ListItem( 'ElderThing', @AHLCG-Chaos-ElderThing )
		), null );
	bindings.add( 'MergeTablet' + BindingSuffixes[faceIndex], tabletMergeList, [faceIndex] );
		
	var elderThingText = new textArea( '', 6, 30, true );
	bindings.add( 'ElderThing' + BindingSuffixes[faceIndex], elderThingText, [faceIndex] );
	
	if ( headerText ) 
		TextPanel.place( @AHLCG-Header, 'align right', headerText, 'wrap, pushx, growx' );
		
	TextPanel.place(
		@AHLCG-Skull, 'align right', skullText, 'wrap, pushx, growx',
		@AHLCG-CombineWith, '', skullMergeList, 'wrap',
		@AHLCG-Spacing, 'align right', skullSpinner, 'wrap', 
		@AHLCG-Cultist, 'align right', cultistText, 'wrap, pushx, growx',
		@AHLCG-CombineWith, '', cultistMergeList, 'wrap',
		@AHLCG-Spacing, 'align right', cultistSpinner, 'wrap', 
		@AHLCG-Tablet, 'align right', tabletText, 'wrap, pushx, growx',
		@AHLCG-CombineWith, '', tabletMergeList, 'wrap',
		@AHLCG-Spacing, 'align right', tabletSpinner, 'wrap', 
		@AHLCG-ElderThing, 'align right', elderThingText, 'wrap, pushx, growx'
		);
		
	return TextPanel;
}
/*
function layoutArtist( bindings, faces, bindingFaceIndex ) {
	var ArtistPanel = new Grid();
	ArtistPanel.setTitle( @AHLCG-Options );

	var artistField = new textField( '', 30 );
	bindings.add( 'Artist' + BindingSuffixes[bindingFaceIndex], artistField, faces );

	ArtistPanel.place( 
		@AHLCG-Artist, 'align right', artistField, 'pushx, growx, sizegroup sp'
		);
						
	return ArtistPanel;
}
*/
function layoutPortraitOptions( bindings, faces, bindingFaceIndex, artist, mirror, share ) {
	var OptionPanel = new Grid();
	OptionPanel.setTitle( @AHLCG-Options );

	if ( share ) {
		var shareBox = new checkBox( @AHLCG-SharePortrait, true, null );
		bindings.add( 'PortraitShare', shareBox, faces );
		
		OptionPanel.place(
			shareBox, 'wrap, span 2'
			);
	}
	if ( artist ) {
		var artistField = new textField( '', 30 );
		bindings.add( 'Artist' + BindingSuffixes[bindingFaceIndex], artistField, faces );
		
		OptionPanel.place( 
			@AHLCG-Artist, 'align right', artistField, 'pushx, growx, sizegroup sp'
			);
	}
	if ( mirror != null) {
		OptionPanel.place( 
			mirror, 'align right'
			);
	}
					
	return OptionPanel;
}

function layoutGuidePortraitOptions( diy, bindings, faces, bindingFaceIndex, portraitName, panel, list, mirror ) {
	var OptionPanel = new Grid();
	OptionPanel.setTitle( @AHLCG-Options );

	var PositionList = new comboBox( list, null );
	bindings.add( 'Position' + portraitName + BindingSuffixes[bindingFaceIndex], PositionList, faces );

	var portraitIndex = getPortraitIndex( portraitName );
	var portrait = PortraitList[portraitIndex];

	// update portrait pan/scale, stencil
	PositionList.addActionListener( function updatePosition( actionEvent ) {
		try {
			// assume pan is 0 before this has run -> run this once when component is created
			if ( ( portrait.getPanX() == 0.0 && portrait.getPanY() == 0.0 ) || (String)(PositionList.getSelectedItem()) != $( 'PositionPortrait'+ (portraitIndex+1) )  ) {
				// update portrait positioning
				let region = getGuidePortraitRegion( diy, (String)(PositionList.getSelectedItem()) );

				if ( region == null ) {
					portrait.pan = Point2D.Float( 0, 0 );
					portrait.scale = 1.0;
				}
				else {
					let image = portrait.image;
			
					let clipDimension = portrait.getClipDimensions();
					
					let coveringScale = ImageUtilities.idealCoveringScaleForImage( region.width, region.height, image.getWidth(), image.getHeight() );

					portrait.pan = Point2D.Float( region.x + (region.width - clipDimension.width) / 2, region.y + (region.height - clipDimension.height) / 2);
					portrait.scale = ImageUtilities.idealCoveringScaleForImage( region.width, region.height, image.getWidth(), image.getHeight() );
					portrait.scale = coveringScale;

					panel.portrait = portrait;
				}
			}

			createPortraitStencil( diy, portrait, panel, (String)(PositionList.getSelectedItem()), $PageType );
		} catch ( ex ) {
			Error.handleUncaught( ex );
		}
	});

	OptionPanel.place(
		@AHLCG-Position, 'align right', PositionList, 'pushx, growx, sizegroup sp'
		);

	if ( mirror != null) {
		OptionPanel.place( 
			mirror, 'align right'
			);
	}
	
	return OptionPanel;
}

function layoutPortraits( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	var PortraitTabArray = layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist );

	return PortraitTabArray[0];
}

function layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	var PortraitTab = new Grid();
	PortraitTab.editorTabScrolling = true;

	var resultArray = [ PortraitTab ];

	var frontNeeded = ( frontPortrait != null && frontPortrait.length > 0 );
	var backNeeded = ( backPortrait != null && backPortrait.length > 0 );

	if ( frontNeeded ) {
		let frontPortraitImagePanel = null;
		if ( backNeeded ) frontPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( frontPortrait ), @AHLCG-Portrait + ' : '+ @AHLCG-Front );
		else frontPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( frontPortrait ), @AHLCG-Portrait );
			
		let frontMirrorButton = null;
		if (mirror) frontMirrorButton = createPortraitMirrorButton( frontPortrait, frontPortraitImagePanel );

		let frontOptionPanel = layoutPortraitOptions( bindings, [0], FACE_FRONT, true, frontMirrorButton, false );
		if ( backNeeded ) frontOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-Front );

		PortraitTab.place( frontPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( frontOptionPanel, 'wrap, pushx, growx' );
		
		resultArray.push( frontPortraitImagePanel );
	}
	if ( backNeeded ) {
		let backPortraitImagePanel = null;
		if ( frontNeeded ) backPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( backPortrait ), @AHLCG-Portrait + ' : ' + @AHLCG-Back );
		else backPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( backPortrait ), @AHLCG-Portrait );

		let backMirrorButton = null;
		if (mirror) backMirrorButton = createPortraitMirrorButton( backPortrait, backPortraitImagePanel );

		let backOptionPanel = layoutPortraitOptions( bindings, [1], FACE_BACK, backArtist, backMirrorButton, share );
		if ( frontNeeded ) backOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-Back );

		PortraitTab.place( backPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( backOptionPanel, 'wrap, pushx, growx' );

		resultArray.push( backPortraitImagePanel );
	}

	return resultArray;
}

function layoutGuidePortraits( diy, bindings, leftPortrait, rightPortrait, mirror ) {
	var PortraitTab = new Grid();
	PortraitTab.editorTabScrolling = true;

	var leftNeeded = ( leftPortrait != null && leftPortrait.length > 0 );
	var rightNeeded = ( rightPortrait != null && rightPortrait.length > 0 );

	var leftPortraitImagePanel = null;
	var rightPortraitImagePanel = null;

	if ( leftNeeded ) {
		if ( rightNeeded ) leftPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( leftPortrait ), @AHLCG-Portrait + ' : '+ @AHLCG-LeftTop );
		else leftPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( leftPortrait ), @AHLCG-Portrait );		

		let leftMirrorButton = null;
		if (mirror) leftMirrorButton = createPortraitMirrorButton( leftPortrait, leftPortraitImagePanel );
		
		let leftOptionPanel = layoutGuidePortraitOptions( diy, bindings, [0], FACE_FRONT, leftPortrait, leftPortraitImagePanel, Eons.namedObjects.AHLCGObject.comboPortraitPosition1, leftMirrorButton );
		if ( rightNeeded ) leftOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-LeftTop );

		PortraitTab.place( leftPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( leftOptionPanel, 'wrap, pushx, growx' );
	}
	if ( rightPortrait != null && rightPortrait.length > 0 ) {
		if ( leftNeeded ) rightPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( rightPortrait ), @AHLCG-Portrait + " : " + @AHLCG-RightBottom );
		rightPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( rightPortrait ), @AHLCG-Portrait );

		let rightMirrorButton = null;
		if (mirror) rightMirrorButton = createPortraitMirrorButton( rightPortrait, rightPortraitImagePanel );

		let rightOptionPanel = layoutGuidePortraitOptions( diy, bindings, [0], FACE_FRONT, rightPortrait, rightPortraitImagePanel ,Eons.namedObjects.AHLCGObject.comboPortraitPosition2, rightMirrorButton );
		if ( leftNeeded ) rightOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-RightBottom );

		PortraitTab.place( rightPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( rightOptionPanel, 'wrap, pushx, growx' );
	}

	return [ PortraitTab, leftPortraitImagePanel, rightPortraitImagePanel ];
}

function layoutCollection( bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex ) {
	var CollectionPanel = new Grid();
	CollectionPanel.setTitle( @AHLCG-Collection );

	var CollectionList = new comboBox( Eons.namedObjects.AHLCGObject.comboCollection, null );
	bindings.add( 'Collection' + BindingSuffixes[bindingFaceIndex], CollectionList, faces );

	// if we select a user set, load the portrait accordingly
	CollectionList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.collectionTypes[CollectionList.getSelectedIndex()];
			$CollectionType = type.toString();
			if ( type > 0 ) {
				var icon = $( 'AHLCG-UserCollectionIcon' + type, '' );

				PortraitList[ getPortraitIndex( 'Collection' ) ].setSource( icon );
//				image = createInvertedImage( PortraitList[getPortraitIndex( 'Collection' )].getImage() );
				
				if ( CardTypes[1] == 'Story') image = ImageUtils.read( icon );	// story/story
				else image = createInvertedImage( ImageUtils.read( icon ) );
				
				PortraitList[ getPortraitIndex( 'Collection' ) ].setImage( icon, image );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );				
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	var collectionNumber;
	if ( useSpinner ) {
		collectionNumber = new spinner(1, 999, 1, 1);
	}
	else {
		collectionNumber = new textField( '', 8 );
		collectionNumber.setHorizontalAlignment(JTextField.RIGHT);
	}
	bindings.add( 'CollectionNumber' + BindingSuffixes[bindingFaceIndex], collectionNumber, faces );

	CollectionPanel.place(
		@AHLCG-Collection, 'align right', CollectionList, 'wrap, pushx, growx, span 3'
	);

	if (selectFaces) {
		var frontBox = new checkBox( @AHLCG-Front, true, null );
		var backBox = new checkBox( @AHLCG-Back, true, null );

		bindings.add( 'ShowCollectionNumberFront' + BindingSuffixes[bindingFaceIndex], frontBox, [0, 1] );
		bindings.add( 'ShowCollectionNumberBack' + BindingSuffixes[bindingFaceIndex], backBox, [0, 1] );
								
		CollectionPanel.place(
			@AHLCG-CollectionNumber, 'align right', collectionNumber, 'align left',
			frontBox, 'align right', backBox, 'align right, gapx 10'
		);
	}
	else {
		CollectionPanel.place(
			@AHLCG-CollectionNumber, 'align right', collectionNumber, 'wrap'
		);
	}

	return CollectionPanel;
}

function layoutEncounter( bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex ) {
	var EncounterPanel = new Grid();
	EncounterPanel.setTitle( @AHLCG-EncounterSet );

	var EncounterList = new comboBox( Eons.namedObjects.AHLCGObject.comboEncounter, null );
	bindings.add( 'Encounter' + BindingSuffixes[bindingFaceIndex], EncounterList, iconFaces );

	// if we select a user set, load the portrait accordingly
	EncounterList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.encounterTypes[EncounterList.getSelectedIndex()];
			$EncounterType = type.toString();
			
			if ( type > 0 ) {
				var icon = $( 'AHLCG-UserEncounterIcon' + type, '' );

				PortraitList[ getPortraitIndex( 'Encounter' ) ].setSource( icon );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );				
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	var encounterNumber = new textField( '', 8 );
	encounterNumber.setHorizontalAlignment(JTextField.RIGHT);
	
	bindings.add( 'EncounterNumber' + BindingSuffixes[bindingFaceIndex], encounterNumber, numberFaces );
		
	var totalNumber = new textField( "", 4);
	bindings.add( 'EncounterTotal' + BindingSuffixes[bindingFaceIndex], totalNumber, numberFaces );

	EncounterPanel.place(
		@AHLCG-Set, 'align right', EncounterList, 'wrap, pushx, growx, span 3'
	);

	if (selectFaces) {
		var frontBox = new checkBox( @AHLCG-Front, true, null );
		var backBox = new checkBox( @AHLCG-Back, true, null );

		bindings.add( 'ShowEncounterNumberFront' + BindingSuffixes[bindingFaceIndex], frontBox, [0, 1] );
		bindings.add( 'ShowEncounterNumberBack' + BindingSuffixes[bindingFaceIndex], backBox, [0, 1] );
								
		EncounterPanel.place(
			@AHLCG-SetNumber, 'align right', encounterNumber, 'align left, split 3',
			' / ', 'align left', totalNumber, 'align left',
			frontBox, 'align right', backBox, 'align right, gapx 10'
		);
	}
	else {
		EncounterPanel.place(
			@AHLCG-SetNumber, 'align right', encounterNumber, 'split',
			' / ', 'split', totalNumber, 'split, wrap'
		);
	}

	return EncounterPanel;
}

function layoutSimpleEncounter( bindings, portraitPanel, iconFaces, bindingFaceIndex ) {
	var EncounterPanel = new Grid();
	EncounterPanel.setTitle( @AHLCG-EncounterSet );

	var EncounterList = new comboBox( Eons.namedObjects.AHLCGObject.comboEncounter, null );
	bindings.add( 'Encounter' + BindingSuffixes[bindingFaceIndex], EncounterList, iconFaces );

	// if we select a user set, load the portrait accordingly
	EncounterList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.encounterTypes[EncounterList.getSelectedIndex()];
			$EncounterType = type.toString();
			
			if ( type > 0 ) {
				var icon = $( 'AHLCG-UserEncounterIcon' + type, '' );

				PortraitList[ getPortraitIndex( 'Encounter' ) ].setSource( icon );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );				
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	EncounterPanel.place(
		@AHLCG-Set, 'align right', EncounterList, 'wrap, pushx, growx'
	);

	return EncounterPanel;
}