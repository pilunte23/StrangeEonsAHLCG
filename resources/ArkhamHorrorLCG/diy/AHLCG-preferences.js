importPackage( arkham.dialog.prefs );
importPackage( ca.cgjennings.ui.table );
importPackage( java.io );
importPackage( javax.swing.event );
importClass( arkham.diy.ListItem );
importClass( javax.swing.JPanel );
importClass( javax.swing.JTextField );
importClass( javax.swing.JLabel );
importClass( java.awt.Dimension );
importClass( java.util.Vector );
importClass( javax.swing.JComboBox );
importClass( javax.swing.BoxLayout );
importClass( javax.swing.Box );
importClass( javax.swing.JButton );
importClass( javax.swing.BorderFactory );
importClass( javax.swing.JComponent );
importClass( javax.swing.JScrollPane );
importClass( javax.swing.table.DefaultTableModel );
importClass( ca.cgjennings.apps.arkham.diy.SBDropDown );

useLibrary( 'res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js' );

function createSetData() {
	var data = {
		seTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				try {
					var encounterList = Eons.namedObjects.AHLCGObject.standardEncounterList;
				
					for ( let index = 0; index < encounterList.length && index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let entry = encounterList[ index ];
							
							box.addItem( new ListItem( entry[0], @('AHLCG-' + entry[0]) ) );
						}
					}	
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}			
			}
		}),
		ueTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				try {
					for ( let index = 0; index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let name = this.getValueAt( index, 1 ); 

							box.addItem( new ListItem( createUserSettingValue( name), name ) );
						}
					}				
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}
			}
		}),
		scTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 3;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				var collectionList = Eons.namedObjects.AHLCGObject.standardCollectionList;
				
				for ( let index = 0; index < collectionList.length && index < this.getRowCount(); index++) {
					let value = this.getValueAt( index, 0 );

					if ( value == java.lang.Boolean(true) ) {
						let entry = collectionList[ index ];

						box.addItem( new ListItem( entry[0], @('AHLCG-' + entry[0]) ) );
					}
				}	
			}
		}),
		ucTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				return true;
			},
			addToComboBox: function( box ) {
				try {
					for ( let index = 0; index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let name = this.getValueAt( index, 1 ); 

							box.addItem( new ListItem( createUserSettingValue( name), name ) );
						}
					}				
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}
			}

		}),
		initialize: function() {
			try {
//				this.seTableModel.setColumnIdentifiers( [ '', 'Name', 'Cycle', 'Tag' ] );
//				this.ueTableModel.setColumnIdentifiers( [ '', 'Name', 'Icon', 'Tag' ] );
//				this.scTableModel.setColumnIdentifiers( [ '', 'Name', 'Tag' ] );
//				this.ucTableModel.setColumnIdentifiers( [ '', 'Name', 'Icon', 'Tag' ] );
				this.seTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Cycle, @AHLCG-Pref-Tag ] );
				this.ueTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Icon, @AHLCG-Pref-Tag ] );
				this.scTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Tag ] );
				this.ucTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Icon, @AHLCG-Pref-Tag ] );
			
				var itemArray = new Array( );

				for ( let index = 0; index < Eons.namedObjects.AHLCGObject.basicEncounterList.length; index++ ) {
					let value = Eons.namedObjects.AHLCGObject.basicEncounterList[ index ];

					itemArray[index] = ListItem( value, @( 'AHLCG-'+value ) );
				}
			
				this.deComboBox = comboBox( itemArray );
				var boxSize = this.deComboBox.getPreferredSize();
				boxSize.width = 200;
				this.deComboBox.setPreferredSize( boxSize );

				itemArray.length = 0;

				for ( let index = 0; index < Eons.namedObjects.AHLCGObject.basicCollectionList.length; index++ ) {
					let value = Eons.namedObjects.AHLCGObject.basicCollectionList[ index ];

					itemArray[index] = ListItem( value, @( 'AHLCG-'+value ) );
				}

				this.dcComboBox = comboBox( itemArray );
				this.dcComboBox.setPreferredSize( boxSize );
			} catch ( ex ) {
				Error.handleUncaught( ex );
			} 
		}
	};
		
	return data;
}

function addPreferences() {
try {
	var data = createSetData();
	data.initialize();

	var seTable = new JResizableTable( data.seTableModel );
	seTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	seTable.getColumnModel().getColumn(1).setPreferredWidth(250);
	seTable.getColumnModel().getColumn(2).setPreferredWidth(200);
	seTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	seTable.setAutoCreateRowSorter( true );
	
	var seScrollPane = new JScrollPane( seTable );
	seScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	seScrollPane.getViewport().setBackground( Color.white );

	var ueTable = new JResizableTable( data.ueTableModel );
	ueTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	ueTable.getColumnModel().getColumn(1).setPreferredWidth(150);
	ueTable.getColumnModel().getColumn(2).setPreferredWidth(300);
	ueTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	ueTable.setAutoCreateRowSorter( true );

	var ueScrollPane = new JScrollPane( ueTable );
	ueScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	ueScrollPane.getViewport().setBackground( Color.white );

	var scTable = new JResizableTable( data.scTableModel );
	scTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	scTable.getColumnModel().getColumn(1).setPreferredWidth(450);
	scTable.getColumnModel().getColumn(2).setPreferredWidth(70);
	scTable.setAutoCreateRowSorter( true );
	
	var scScrollPane = new JScrollPane( scTable );
	scScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	scScrollPane.getViewport().setBackground( Color.white );

	var ucTable = new JResizableTable( data.ucTableModel );
	ucTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	ucTable.getColumnModel().getColumn(1).setPreferredWidth(150);
	ucTable.getColumnModel().getColumn(2).setPreferredWidth(300);
	ucTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	ucTable.setAutoCreateRowSorter( true );

	var ucScrollPane = new JScrollPane( ucTable );
	ucScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	ucScrollPane.getViewport().setBackground( Color.white );

	var eTableListener = new JavaAdapter( TableModelListener, {
		tableChanged: function ( event ) {
			updateDefaultEncounterSet( data ); 
		}
	} );

	var cTableListener = new JavaAdapter( TableModelListener, {
		tableChanged: function ( event ) {
			updateDefaultCollection( data ); 
		}
	} );

	var pc = new JavaAdapter( ca. cgjennings.apps.arkham.dialog.prefs.FillInPreferenceCategory, {
		loadSettings: function() {			
			loadAHLCGPreferences( data );
		},
		storeSettings: function() {
			storeAHLCGPreferences( data );
		}
	}, @AHLCG, 'ArkhamHorrorLCG/icons/AHLCG-Game.png' );	

	pc.heading( @AHLCG ); 
	pc.subheading( @AHLCG-Pref-DefaultValues );
	
	pc.label( @AHLCG-Pref-DefaultSet );
	pc.join();
	pc.addUnmanagedControl( data.deComboBox );

	pc.label( @AHLCG-Pref-DefaultCollection );
	pc.join();
	pc.addUnmanagedControl( data.dcComboBox );
	
	data.seTableModel.addTableModelListener( eTableListener );
	data.ueTableModel.addTableModelListener( eTableListener );

	data.scTableModel.addTableModelListener( cTableListener );
	data.ucTableModel.addTableModelListener( cTableListener );

	pc.subheading( @AHLCG-Pref-EncounterSets );
	pc.join();
	pc.addTip( @AHLCG-PrefEncounterTip );
	pc.indent();
	
	pc.label( @AHLCG-Pref-StandardSets );
	
	pc.addUnmanagedControl( seScrollPane );

	pc.addButton( @AHLCG-Pref-CheckSets, function () {
		checkSets( seTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckSets, function () {
		uncheckSets( seTable );
	});

	pc.label( @AHLCG-Pref-UserSets );
	pc.addUnmanagedControl( ueScrollPane );

	pc.addButton( @AHLCG-Pref-CheckSets, function () {
		checkSets( ueTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckSets, function () {
		uncheckSets( ueTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-DeleteSets, function addToList( actionEvent ) {
		deleteSets( ueTable, @AHLCG-Pref-PermanentlyRemoveSets, @AHLCG-Pref-RemoveSets );
	});

	var ueNameLabel = new JLabel( @AHLCG-Pref-Name );
	ueNameLabel.setAlignmentX( JComponent.LEFT_ALIGNMENT );
	var ueName = new JTextField( 20 );
	var ueTagLabel = new JLabel( @AHLCG-Pref-Tag );
	var ueTag = new JTextField( 5 );
	var ueIconLabel = new JLabel( @AHLCG-Pref-Image );
	var ueIcon = new JTextField( 30 );
	
	var ueSelectButton = new JButton( @AHLCG-Pref-Select );
	ueSelectButton.addActionListener( function addToList( actionEvent ) {
		filename = ResourceKit.showImageFileDialog( null );
		if (filename != null) ueIcon.setText( filename );
	} );	

	var ueAddButton = new JButton( @AHLCG-Pref-AddSet );
	ueAddButton.addActionListener( function addToList( actionEvent ) {
		let nameStr = ueName.getText();
		let iconStr = ueIcon.getText();
		let tagStr = ueTag.getText();
		
		if ( verifyUserEncounter( nameStr, iconStr, tagStr, data ) ) {
			data.ueTableModel.addRow( [ true, nameStr, iconStr, tagStr ] );
			data.ueTableModel.fireTableDataChanged();
			
			ueName.setText( '' );
			ueIcon.setText( '' );
			ueTag.setText( '' );
		}
	} );	

	var ueOuterPanel = new JPanel();
	ueOuterPanel.setBorder( BorderFactory.createEmptyBorder( 5, 5, 5, 5 ) );
	ueOuterPanel.setLayout( new BoxLayout( ueOuterPanel, BoxLayout.PAGE_AXIS ) );
		
	var ueWhitePanel = new JPanel();
	ueWhitePanel.setLayout( new BoxLayout( ueWhitePanel, BoxLayout.PAGE_AXIS ) );
	ueWhitePanel.setBackground( Color.white );
		
	var ueNamePanel = new JPanel();
	ueNamePanel.setLayout( new BoxLayout( ueNamePanel, BoxLayout.LINE_AXIS ) );
	ueNamePanel.setBackground( Color.white );
	ueNamePanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 0, 10 ) );
	ueNamePanel.add(ueNameLabel);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueNamePanel.add(ueName);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 10, 0 ) ) );
	ueNamePanel.add(ueTagLabel);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueNamePanel.add(ueTag);
	
	var ueIconPanel = new JPanel();
	ueIconPanel.setLayout( new BoxLayout( ueIconPanel, BoxLayout.LINE_AXIS ) );
	ueIconPanel.setBackground( Color.white );
	ueIconPanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 10, 10 ) );
	ueIconPanel.add(ueIconLabel);
	ueIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueIconPanel.add(ueIcon);
	ueIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueIconPanel.add(ueSelectButton);
	
	var ueButtonPanel = new JPanel();
	ueButtonPanel.setLayout( new BoxLayout( ueButtonPanel, BoxLayout.LINE_AXIS ) );
	ueButtonPanel.setBackground( Color.white );
	ueButtonPanel.setBorder( BorderFactory.createEmptyBorder( 0, 10, 10, 10 ) );
	ueButtonPanel.add( ueAddButton );

	ueWhitePanel.add( ueNamePanel );
	ueWhitePanel.add( ueIconPanel );
	ueWhitePanel.add( ueButtonPanel );
	
	ueOuterPanel.add( ueWhitePanel );

	pc.label( @AHLCG-Pref-AddCustomSet );
	pc.addUnmanagedControl( ueOuterPanel );

	pc.subheading( @AHLCG-Pref-Collections );
	pc.join();
	pc.addTip( @AHLCG-PrefCollectionTip );
	pc.indent();

	pc.label( @AHLCG-Pref-StandardCollections );
	pc.addUnmanagedControl( scScrollPane );

	pc.addButton( @AHLCG-Pref-CheckCollections, function () {
		checkSets( scTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckCollections, function () {
		uncheckSets( scTable );
	});

	pc.label( @AHLCG-Pref-UserCollections );

	pc.addUnmanagedControl( ucScrollPane );

	pc.addButton( @AHLCG-Pref-CheckCollections, function () {
		checkSets( ucTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckCollections, function () {
		uncheckSets( ucTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-DeleteCollections, function addToList( actionEvent ) {
		deleteSets( ucTable, @AHLCG-Pref-PermanentlyRemoveCollections, @AHLCG-Pref-RemoveCollections );
	});

	var ucNameLabel = new JLabel( @AHLCG-Pref-Name );
	ucNameLabel.setAlignmentX( JComponent.LEFT_ALIGNMENT );
	var ucName = new JTextField( 20 );
	var ucTagLabel = new JLabel( @AHLCG-Pref-Tag );
	var ucTag = new JTextField( 5 );
	var ucIconLabel = new JLabel( @AHLCG-Pref-Image );
	var ucIcon = new JTextField( 30 );
	
	var ucSelectButton = new JButton( @AHLCG-Pref-Select );
	ucSelectButton.addActionListener( function addToList( actionEvent ) {
		filename = ResourceKit.showImageFileDialog( null );
		if (filename != null) ucIcon.setText( filename );
	} );	

	var ucAddButton = new JButton( @AHLCG-Pref-AddCollection );
	ucAddButton.addActionListener( function addToList( actionEvent ) {
		let nameStr = ucName.getText();
		let iconStr = ucIcon.getText();
		let tagStr = ucTag.getText();
		
		if ( verifyUserCollection( nameStr, iconStr, tagStr, data ) ) {
			data.ucTableModel.addRow( [ true, nameStr, iconStr, tagStr ] );
			data.ucTableModel.fireTableDataChanged();

			ucName.setText( '' );
			ucIcon.setText( '' );
			ucTag.setText( '' );
		}
	} );	

	var ucOuterPanel = new JPanel();
	ucOuterPanel.setBorder( BorderFactory.createEmptyBorder( 5, 5, 5, 5 ) );
	ucOuterPanel.setLayout( new BoxLayout( ucOuterPanel, BoxLayout.PAGE_AXIS ) );
		
	var ucWhitePanel = new JPanel();
	ucWhitePanel.setLayout( new BoxLayout( ucWhitePanel, BoxLayout.PAGE_AXIS ) );
	ucWhitePanel.setBackground( Color.white );
		
	var ucNamePanel = new JPanel();
	ucNamePanel.setLayout( new BoxLayout( ucNamePanel, BoxLayout.LINE_AXIS ) );
	ucNamePanel.setBackground( Color.white );
	ucNamePanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 0, 10 ) );
	ucNamePanel.add(ucNameLabel);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucNamePanel.add(ucName);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 10, 0 ) ) );
	ucNamePanel.add(ucTagLabel);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucNamePanel.add(ucTag);
	
	var ucIconPanel = new JPanel();
	ucIconPanel.setLayout( new BoxLayout( ucIconPanel, BoxLayout.LINE_AXIS ) );
	ucIconPanel.setBackground( Color.white );
	ucIconPanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 10, 10 ) );
	ucIconPanel.add(ucIconLabel);
	ucIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucIconPanel.add(ucIcon);
	ucIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucIconPanel.add(ucSelectButton);
	
	var ucButtonPanel = new JPanel();
	ucButtonPanel.setLayout( new BoxLayout( ucButtonPanel, BoxLayout.LINE_AXIS ) );
	ucButtonPanel.setBackground( Color.white );
	ucButtonPanel.setBorder( BorderFactory.createEmptyBorder( 0, 10, 10, 10 ) );
	ucButtonPanel.add( ucAddButton );

	ucWhitePanel.add( ucNamePanel );
	ucWhitePanel.add( ucIconPanel );
	ucWhitePanel.add( ucButtonPanel );
	
	ucOuterPanel.add( ucWhitePanel );

	pc.label( @AHLCG-Pref-AddCustomCollection );
	pc.addUnmanagedControl( ucOuterPanel );

	Preferences.registerCategory( pc );
} catch ( ex ) {
	Error.handleUncaught (ex);
}
}

function loadAHLCGPreferences( data ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var settings = Settings.getUser();

	// defaults
	var defaultEncounter = settings.get( 'AHLCG-DefaultEncounterSet' );
	var defaultCollection = settings.get( 'AHLCG-DefaultCollection' );

	// user sets
	data.seTableModel.setRowCount( 0 );
	data.ueTableModel.setRowCount( 0 );
	data.scTableModel.setRowCount( 0 );
	data.ucTableModel.setRowCount( 0 );

	var usedIndex = 1;

	var index;
	var name;
	var icon;
	var tag;
	
	for( index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		let entry = AHLCGObject.standardEncounterList[index];
		let collection = AHLCGObject.standardCollectionList[ entry[1] ];
		let used = loadUsedValue( 'Encounter', entry[3] );

		data.seTableModel.addRow( [ used, @( 'AHLCG-' + entry[0] ), @( 'AHLCG-' + collection[0] ), entry[2] ] );	
	}	

	var userCount = settings.getInt( 'AHLCG-UserEncounterCount', 0 );

	for ( index = 0; index < userCount; index++) {
		name = settings.get( 'AHLCG-UserEncounterName' + (index+1), '' );
		icon = settings.get( 'AHLCG-UserEncounterIcon' + (index+1), '' );
		tag = settings.get( 'AHLCG-UserEncounterTag' + (index+1), '' );

		if (name != null && icon != null && tag != null) {
			data.ueTableModel.addRow( [ settings.getBoolean( 'AHLCG-UseUserEncounter' + (index+1), true ), name, icon, tag ] );
		}
	}

	usedIndex = 1;
	
	for( index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {
		let entry = AHLCGObject.standardCollectionList[index];
		let used = loadUsedValue( 'Collection', index );
		
		data.scTableModel.addRow( [ used, @( 'AHLCG-' + entry[0] ), entry[1] ] );						
	}	

	userCount = settings.getInt( 'AHLCG-UserCollectionCount', 0 );

	for ( index = 0; index < userCount; index++) {
		name = settings.get( 'AHLCG-UserCollectionName' + (index+1), '' );
		icon = settings.get( 'AHLCG-UserCollectionIcon' + (index+1), '' );
		tag = settings.get( 'AHLCG-UserCollectionTag' + (index+1), '' );
		
		if (name != null && icon != null && tag != null) {
			data.ucTableModel.addRow( [ settings.getBoolean( 'AHLCG-UseUserCollection' + (index+1), true ), name, icon, tag ] );
		}
	}	

	selectDefaultEncounter( data, defaultEncounter );
	selectDefaultCollection( data, defaultCollection );
}

function storeAHLCGPreferences( data ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var settings = Settings.getUser();

	var index;
	var name;

	// defaults
	settings.set( 'AHLCG-DefaultEncounterSet', data.deComboBox.getSelectedItem().toString() );
	settings.set( 'AHLCG-DefaultCollection', data.dcComboBox.getSelectedItem().toString() );

	// user sets
	var usedString = '';
	var settingsIndex = 1;
	
	for( index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		// we need to convert this index into the used setting string index		
		let usedIndex = -1;
		
		for ( i = 0; i < AHLCGObject.standardEncounterList.length; i++) {
			let entry = AHLCGObject.standardEncounterList[i];
			
			if ( entry[3] == index ) {
				usedIndex = i;		
				break;
			}
		}

		let value = data.seTableModel.getValueAt( usedIndex, 0 );

		if ( value == java.lang.Boolean(false) ) usedString = usedString + '0';
		else usedString = usedString + '1';

		if (usedString.length >= 40) {
			settings.set( 'AHLCG-UseEncounter' + settingsIndex, usedString );
			settingsIndex++;
			usedString = '';
		}
	}

	if (usedString.length > 0) {
		settings.set( 'AHLCG-UseEncounter' + settingsIndex, usedString );		
	}
	
	var userCount = data.ueTableModel.getRowCount();
	settings.setInt( 'AHLCG-UserEncounterCount', userCount);

	for ( index = 0; index < userCount; index++) {
		settings.set( 'AHLCG-UserEncounterName' + (index+1), data.ueTableModel.getValueAt( index, 1 ) );
		settings.set( 'AHLCG-UserEncounterIcon' + (index+1), data.ueTableModel.getValueAt( index, 2 ) );
		settings.set( 'AHLCG-UserEncounterTag' + (index+1), data.ueTableModel.getValueAt( index, 3 ) );		

		let value = data.ueTableModel.getValueAt( index, 0 );

		let parameter = true;
		if ( value == java.lang.Boolean(false) ) parameter = false;

		settings.setBoolean( 'AHLCG-UseUserEncounter' + (index+1), parameter );
	}

	do {
		name = settings.get( 'AHLCG-UserEncounterName' + (index+1) );

		if (name != null) {
			settings.reset( 'AHLCG-UserEncounterName' + (index+1) );
			settings.reset( 'AHLCG-UserEncounterIcon' + (index+1) );
			settings.reset( 'AHLCG-UserEncounterTag' + (index+1) );
			settings.reset( 'AHLCG-UseUserEncounter' + (index+1) );
		}	
		
		index++;
	} while ( name != null );

	usedString = '';
	settingsIndex = 1;
	for( index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {		
		let value = data.scTableModel.getValueAt( index, 0 );

		if ( value == java.lang.Boolean(false) ) usedString = usedString + '0';
		else usedString = usedString + '1';

		if (usedString.length >= 40) {
			settings.set( 'AHLCG-UseCollection' + settingsIndex, usedString );
			settingsIndex++;
			usedString = '';
		}
	}		

	if (usedString.length > 0) {
		settings.set( 'AHLCG-UseCollection' + settingsIndex, usedString );		
	}

	userCount = data.ucTableModel.getRowCount();
	settings.setInt( 'AHLCG-UserCollectionCount', userCount);

	for ( index = 0; index < userCount; index++) {
		settings.set( 'AHLCG-UserCollectionName' + (index+1), data.ucTableModel.getValueAt( index, 1 ) );
		settings.set( 'AHLCG-UserCollectionIcon' + (index+1), data.ucTableModel.getValueAt( index, 2 ) );
		settings.set( 'AHLCG-UserCollectionTag' + (index+1), data.ucTableModel.getValueAt( index, 3 ) );		

		let value = data.ucTableModel.getValueAt( index, 0 );

		let parameter = true;
		if ( value == java.lang.Boolean(false) ) parameter = false;

		settings.setBoolean( 'AHLCG-UseUserCollection' + (index+1), parameter );
	}

	do {
		name = settings.get( 'AHLCG-UserCollectionName' + (index+1) );
		
		if (name != null) {
			settings.reset( 'AHLCG-UserCollectionName' + (index+1) );
			settings.reset( 'AHLCG-UserCollectionIcon' + (index+1) );
			settings.reset( 'AHLCG-UserCollectionTag' + (index+1) );
			settings.reset( 'AHLCG-UseUserCollection' + (index+1) );
		}	
		
		index++;
	} while ( name != null );

	updateUsedEncounterSets( AHLCGObject );
	updateUsedCollections( AHLCGObject );
}

function verifyUserEncounter( name, icon, tag, data ) {
	if ( name.length() == 0) {
		alert( 'Please enter an encounter set name' );
		return false;
	}
	if ( icon.length() == 0) {
		alert( 'Please enter an encounter set icon filename' );
		return false;
	}
	if ( tag.length() == 0) {
		alert( 'Please enter an encounter set tag' );
		return false;
	}
	
	var f = new File( icon );
	if (!f.exists() || f.isDirectory()) { 
    	alert( 'Could not open icon image' );
    	return false;
	}
	
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var nameUsed = false;
	var tagUsed = false;

	var standardCount = data.seTableModel.getRowCount();
	
	for ( let index = 0; index < standardCount; index++) {
		if ( name == data.seTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.seTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.seTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	var userCount = data.ueTableModel.getRowCount();
	
	for ( let index = 0; index < userCount; index++) {
		if ( name == data.ueTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.ueTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.ueTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	if (nameUsed) {
		alert( 'Encounter set name is already being used.' );
		return false;
	}
	
	if (tagUsed) {
		alert( 'Encounter set tag is already being used.' );
		return false;
	}
	
	return true;
}

function verifyUserCollection( name, icon, tag, data ) {
	if ( name.length() == 0) {
		alert( 'Please enter a collection name' );
		return false;
	}
	if ( icon.length() == 0) {
		alert( 'Please enter a collection icon filename' );
		return false;
	}
	if ( tag.length() == 0) {
		alert( 'Please enter a collection tag' );
		return false;
	}
	
	var f = new File( icon );
	if (!f.exists() || f.isDirectory()) { 
    	alert( 'Could not open icon image' );
    	return false;
	}
	
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var nameUsed = false;
	var tagUsed = false;

	var standardCount = data.scTableModel.getRowCount();
	
	for ( let index = 0; index < standardCount; index++) {
		if ( name == data.scTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.scTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.scTableModel.getValueAt( index, 2 ) ) tagUsed = true;
	}

	var userCount = data.ucTableModel.getRowCount();
	
	for ( let index = 0; index < userCount; index++) {
		if ( name == data.ucTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.ucTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.ucTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	if (nameUsed) {
		alert( 'Collection name is already being used.' );
		return false;
	}
	
	if (tagUsed) {
		alert( 'Collection tag is already being used.' );
		return false;
	}
	
	return true;
}

function checkSets( table ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
	
	if (selectedRows.length > 0)
	{
		for ( let i = 0; i < selectedRows.length; i++)
		{
			selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			model.setValueAt( true, selectedRows[i], 0 );
		}

		model.fireTableDataChanged();
	}
}

function uncheckSets( table ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
		
	if (selectedRows.length > 0)
	{
		for ( let i = 0; i < selectedRows.length; i++)
		{
			selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			model.setValueAt( false, selectedRows[i], 0 );
		}

		model.fireTableDataChanged();
	}
}

function deleteSets( table, prompt, title ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
	
	if (selectedRows.length > 0)
	{
		if ( confirm( prompt, title ) )
		{
			for ( let i = 0; i < selectedRows.length; i++)
			{
				selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			}

			selectedRows.sort();
	
			for ( let i = selectedRows.length - 1; i >= 0; i--)
			{
				model.removeRow( selectedRows[i] );
			}
		
			model.fireTableDataChanged();
		}
	}
}

function updateDefaultEncounterSet( data ) {
	var selectedItem = data.deComboBox.getSelectedItem();
	
	var basicCount = Eons.namedObjects.AHLCGObject.basicEncounterList.length;

	// remove everything other than the basic sets, we're going to refill with only the selected sets
	while ( data.deComboBox.getItemCount() > basicCount ) data.deComboBox.removeItemAt( basicCount );
	
	data.seTableModel.addToComboBox( data.deComboBox );
	data.ueTableModel.addToComboBox( data.deComboBox );
	
	selectDefaultEncounter( data, selectedItem.toString() );
}

function updateDefaultCollection( data ) {
	var selectedItem = data.dcComboBox.getSelectedItem();

	var basicCount = Eons.namedObjects.AHLCGObject.basicCollectionList.length;

	// remove everything other than the basic sets, we're going to refill with only the selected sets
	while ( data.dcComboBox.getItemCount() > basicCount ) data.dcComboBox.removeItemAt( basicCount );
	
	data.scTableModel.addToComboBox( data.dcComboBox );
	data.ucTableModel.addToComboBox( data.dcComboBox );
	
	selectDefaultCollection( data, selectedItem.toString() );
}

function selectDefaultEncounter( data, value ) {
	var selectedIndex = 1;	// Strange Eons
	
	for ( let i = 0; i < data.deComboBox.getItemCount(); i++) {
		let item = data.deComboBox.getItemAt(i).toString();

		if ( item == value ) {
			selectedIndex = i;
			break;
		}
	}
	
	data.deComboBox.setSelectedIndex(selectedIndex);
}

function selectDefaultCollection( data, value ) {
	var selectedIndex = 1;	// Strange Eons
	
	for ( let i = 0; i < data.dcComboBox.getItemCount(); i++) {
		let item = data.dcComboBox.getItemAt(i).toString();

		if ( item == value ) {
			selectedIndex = i;
			break;
		}
	}
		
	data.dcComboBox.setSelectedIndex(selectedIndex);
}