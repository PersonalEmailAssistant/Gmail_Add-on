
//------------------------------- MANAGE PROPERTIESSERVICE STORAGE -------------------------------------

function checkPropertymap(){
  var scriptProperties = PropertiesService.getUserProperties();
  if(scriptProperties.getProperty("map")===null || JSON.parse(scriptProperties.getProperty("map"))[0].length!=3){
    var defaultsavedlocations = [["UWA", "-31.981179,115.819910"," "]]
    // map stores all saved locations
    scriptProperties.setProperty("map", JSON.stringify(defaultsavedlocations));
    // mapselect is used to set the default values of map link
    scriptProperties.setProperty("mapselected", JSON.stringify(["","",""]));
  }
}

function getPropertyquicksnooze(){
  var scriptProperties = PropertiesService.getUserProperties();
  var quicksnooze = JSON.parse(scriptProperties.getProperty("quicksnooze"));
  if (quicksnooze===null){
    quicksnooze = [["30 Minutes","0.5"],["2 Hours","2"],["Tomorrow","24"],["Next Week","168"]]; // time in hours
  }
  else {
    // check every value is valid
    quicksnooze.forEach(function(value) {
      if (value[0] == undefined || value[1] == undefined){
        quicksnooze = [["30 Minutes","0.5"],["2 Hours","2"],["Tomorrow","24"],["Next Week","168"]]; // time in hours
      }
    } )
  }
  scriptProperties.setProperty("quicksnooze", JSON.stringify(quicksnooze));
  return quicksnooze
}

function getPropertyrecipientgroups(){
  var scriptProperties = PropertiesService.getUserProperties();
  recipientgroups = JSON.parse(scriptProperties.getProperty("recipientgroups"))
  if (recipientgroups == null ){ recipientgroups = [] }
  else {
    // check every value is valid
    recipientgroups.forEach(function(value) {
      if (value[0] == undefined || value[1] == undefined){ recipientgroups = []; }
    })
  }
  scriptProperties.setProperty("recipientgroups", JSON.stringify(recipientgroups));
  return recipientgroups
}

function getPropertySelectedSnoozeRecipients(){
  var scriptProperties = PropertiesService.getUserProperties();
  selectedrecipients = scriptProperties.getProperty("selectedrecipients")
  if (selectedrecipients===null){ selectedrecipients = " "; }
  else if (typeof(selectedrecipients) != "string") { selectedrecipients = " "; }
  scriptProperties.setProperty("selectedrecipients", selectedrecipients);
  return selectedrecipients
}

function checkPropertyDPLocation(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("dplocations")===null){
    var defaultdplocations = [["To Be Confirmed","TBC"],["Other", "Other"],["Zoom","Zoom"],["Teams", "Teams"]];
    scriptProperties.setProperty("dplocations", JSON.stringify(defaultdplocations));
  }
}

function checkPropertyDPTextOptions(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("dptextoptions")===null){
    var defaultdptextoptions = [];
    scriptProperties.setProperty("dptextoptions", JSON.stringify(defaultdptextoptions));
  }
}

function checkPropertyDPDateOptions(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("dpdateoptions")===null){
    var defaultdpdateoptions = [];
    scriptProperties.setProperty("dpdateoptions", JSON.stringify(defaultdpdateoptions));
  }
}

function getPropertyDPManaging(){
  var scriptProperties = PropertiesService.getUserProperties();
  dpmanaging = JSON.parse(scriptProperties.getProperty("dpmanaging"));
  if (dpmanaging===null || (dpmanaging[0] === undefined || dpmanaging[0].length!=4)){
    var defaultdpdateoptions = [];
    scriptProperties.setProperty("dpmanaging", JSON.stringify(defaultdpdateoptions));
  }
  return JSON.parse(scriptProperties.getProperty("dpmanaging"));
}

//--------------section for checking whether user is using the sidebar or composing section------------
  function onSideBar() {
    var scriptProperties = PropertiesService.getUserProperties();
    var isOnSideBar = true;
    scriptProperties.setProperty("isOnSideBar", JSON.stringify(isOnSideBar));
  }

  function onComposing() {
    var scriptProperties = PropertiesService.getUserProperties();
    var isOnSideBar = false;
    scriptProperties.setProperty("isOnSideBar", JSON.stringify(isOnSideBar));
  }

  function checkSideBarOrComposing() {
    var scriptProperties = PropertiesService.getUserProperties();
    var isOnSideBar = JSON.parse(scriptProperties.getProperty("isOnSideBar"));
    console.log(isOnSideBar);
    return isOnSideBar;
  }
//--------------------------------------------------------------------------------------------------------

function manageCustomButtonsCard(){
  var scriptProperties = PropertiesService.getUserProperties();

  //// snooze email buttons
  var quicksnoozetimes = getPropertyquicksnooze();
  var snoozeButtonSet = CardService.newButtonSet();

  quicksnoozetimes.forEach(function(value) {
    var removeaction = CardService.newAction()
    .setFunctionName('removePropertiesServiceItem')
    .setParameters({name:"quicksnooze", item:JSON.stringify(value)});
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(removeaction);
    snoozeButtonSet.addButton(button);
  });
  var info1 = CardService.newTextParagraph().setText("Click to remove saved buttons.");

  var addaction = CardService.newAction()
  .setFunctionName('addNewQuickButton');
  //.setParameters({name:"quicksnooze", itemname: " Hours"});
  var snoozetimeinput = CardService.newTextInput()
    .setFieldName("addquickbuttoninput")
    .setTitle("Enter new Snooze time in hours");
  var snoozetimesubmit = CardService.newTextButton()
    .setText("Add Snooze Quick Button")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(addaction);

  var snoozeSection = CardService.newCardSection()
    .setHeader("Snooze Email Quick Buttons")
    .addWidget(info1)
    .addWidget(snoozeButtonSet)
    .addWidget(snoozetimeinput)
    .addWidget(snoozetimesubmit)
    .setCollapsible(true);


  /// recipient groups buttons
  var recipientgroups = JSON.parse(scriptProperties.getProperty("recipientgroups"));

  var recipientgroupsButtonSet = CardService.newButtonSet();
  recipientgroups.forEach(function(value) {
    var removeaction = CardService.newAction()
    .setFunctionName('removePropertiesServiceItem')
    .setParameters({name:"recipientgroups", item:JSON.stringify(value)});
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(removeaction);
    recipientgroupsButtonSet.addButton(button);
  });

  var addaction = CardService.newAction().setFunctionName('addNewRecipientGroup');
  var recipientgroupinput1 = CardService.newTextInput()
    .setFieldName("recipientgroupnameinput")
    .setTitle("Recipient Group Name");
  var recipientgroupinput2 = CardService.newTextInput()
    .setFieldName("recipientgroupaddressesinput")
    .setTitle("Recipient's Email Adresses (comma separated)");
  var recipientgroupsubmit = CardService.newTextButton()
    .setText("Add Recipient Group Button")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(addaction);

  var recipientSection = CardService.newCardSection()
    .setHeader("Recipient Groups Quick Buttons")
    .addWidget(info1)
    .addWidget(recipientgroupsButtonSet)
    .addWidget(recipientgroupinput1)
    .addWidget(recipientgroupinput2)
    .addWidget(recipientgroupsubmit)
    .setCollapsible(true);


  // map link buttons
  checkPropertymap();
  var mapsaved = JSON.parse(scriptProperties.getProperty("map"));
  var mapButtonSet = CardService.newButtonSet();

  mapsaved.forEach(function(value) {
    var removeaction = CardService.newAction()
    .setFunctionName('removePropertiesServiceItem')
    .setParameters({name:"map", item:JSON.stringify(value)});
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(removeaction);
    mapButtonSet.addButton(button);
  });
  var mapSection = CardService.newCardSection()
    .setHeader("Map Link Quick Buttons")
    .addWidget(info1)
    .addWidget(mapButtonSet)
    .setCollapsible(true);


//// doodle poll buttons
  checkPropertyDPLocation();
  var doodlepolllocations = JSON.parse(scriptProperties.getProperty("dplocations"));
  var doodlepollButtonSet = CardService.newButtonSet();

  doodlepolllocations.forEach(function(value) {
    if (value[0] != "Other" && value[0] != "To Be Confirmed") {
      var removeaction = CardService.newAction()
      .setFunctionName('removePropertiesServiceItem')
      .setParameters({name:"dplocations", item:JSON.stringify(value)});
      var button = CardService.newTextButton()
        .setText(value[0])
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(removeaction);
      doodlepollButtonSet.addButton(button);
    }
  });
  var info1 = CardService.newTextParagraph().setText("Click to remove saved locations.");

  var action = CardService.newAction()
    .setFunctionName("addQuickLocationButton");
  var doodlepollinput = CardService.newTextInput()
    .setFieldName("addQuickLocationInput")
    .setTitle("Enter new quick location");
  var doodlepollsubmit = CardService.newTextButton()
    .setText("Add")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);

  var doodlepollSection = CardService.newCardSection()
    .setHeader("Doodle Poll Quick Locations")
    .addWidget(info1)
    .addWidget(doodlepollButtonSet)
    .addWidget(doodlepollinput)
    .addWidget(doodlepollsubmit)
    .setCollapsible(true);

  var footer = buildPreviousAndRootButtonSet();

  var card = CardService.newCardBuilder()
      .addSection(snoozeSection)
      .addSection(recipientSection)
      .addSection(mapSection)
      .addSection(doodlepollSection)
      .setFixedFooter(footer);
  return card.build();
}

function getManangeCustomButtons(){
  var action = CardService.newAction().setFunctionName('manageCustomButtonsCard');
  var managecustombuttons = CardService.newTextButton()
    .setText('Manage Custom Buttons')
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    .setOnClickAction(action);
  return managecustombuttons;
}

function addNewRecipientGroup(e){
  var name = e.formInput.recipientgroupnameinput;
  var addresses = e.formInput.recipientgroupaddressesinput;
  if (name == undefined || addresses == undefined) return;
  getPropertyrecipientgroups();
  addPropertiesServiceItem("recipientgroups", [name, addresses])
  return snoozeEmailCard(e);
}

function addNewQuickButton(e){
  console.log(e.formInput.addquickbuttoninput);
  if (e.formInput.addquickbuttoninput > 0){ 
    getPropertyquicksnooze();
    addPropertiesServiceItem("quicksnooze", [e.formInput.addquickbuttoninput + " Hours", ""+e.formInput.addquickbuttoninput])
    return snoozeEmailCard(e);
  }
  return;
}

function addQuickLocationButton(e){
  console.log(e.formInput.addQuickLocationInput);
  if (e.formInput.addQuickLocationInput == undefined) return;
  checkPropertyDPLocation();
  addPropertiesServiceItem("dplocations", [e.formInput.addQuickLocationInput, ""+e.formInput.addQuickLocationInput])
  return manageCustomButtonsCard(e);
}

function addNewDoodlePoll(formid, meetinglength, location){addPropertiesServiceItem("dpmanaging", [formid, meetinglength, [], location])}

function addPropertiesServiceItem(name, item){
  var scriptProperties = PropertiesService.getUserProperties();
  var array = JSON.parse(scriptProperties.getProperty(name));
  array.push(item);
  scriptProperties.setProperty(name, JSON.stringify(array));
}

function removePropertiesServiceItem(e){
  var item = JSON.parse(e.parameters.item);
  var scriptProperties = PropertiesService.getUserProperties();

  var newarray = new Array;
  JSON.parse(scriptProperties.getProperty(e.parameters.name)).forEach(function(value) {
    if (JSON.stringify(value)!=JSON.stringify(item)) newarray.push(value);});

  scriptProperties.setProperty(e.parameters.name, JSON.stringify(newarray));
  return manageCustomButtonsCard(e);
}

