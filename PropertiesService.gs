//------------------------------- MANAGE PROPERTIESSERVICE STORAGE -------------------------------------
/**
 * PROPERTIESSERVICE:
 * PropertiesServices used for long-term storage of user-specific values. 
 * Functions retrieve stored values from PropertiesService.getUserProperties(), check that
 * stored values are valid and then returns stored values
*/


/**
 * Called by Map Link functions to retrieve the stored map link locations stored as a nested array
 * Each location stores: [(string), (string), (string)]
 *      [0] the name of location (will be the hyperlinked text and displayed on test button)
 *      [1] the address of location (words or latitude and longitude, used to create the map with google API)
 *      [2] an optional message ("" if no message is given)
 * Example map object: 
 *    [["UWA", "The University of Western Australia", ""],["Lunch Meeting Spot", "Matilda bay", "Meet at the restaurant"]]
 * @return {Object} The stored map link locations nested array
 */
function getPropertymap(){
  var scriptProperties = PropertiesService.getUserProperties();
  map = JSON.parse(scriptProperties.getProperty("map"));
  if(map===null){
    map = []
    scriptProperties.setProperty("mapselected", JSON.stringify(["","",""]));
  }
  else {
    // check every value is valid
    map.forEach(function(value) {
      if (value[0] == undefined || value[1] == undefined|| value[2] == undefined){
        map = []; 
        scriptProperties.setProperty("mapselected", JSON.stringify(["","",""]));
      }
    })
  }
  scriptProperties.setProperty("map", JSON.stringify(map));
  return map
}

/**
 * Called by Map Link functions to set the default values for maplink inputs
 * Stores: [(string), (string), (string)]
 *      [0] location name input 
 *      [1] location address input
 *      [2] message input
 * Example map selected object: 
 *    ["UWA", "The University of Western Australia", ""]
 * @return {Object} The selected map link array
 */
function getPropertymapselected(){
  var scriptProperties = PropertiesService.getUserProperties();
  mapselected = JSON.parse(scriptProperties.getProperty("mapselected"));
  if(mapselected===null){ mapselected = ["","",""]; }
  else {
    if (mapselected[0] == undefined || mapselected[1] == undefined || mapselected[2] == undefined){
      mapselected = ["","",""];
    }
  }
  scriptProperties.setProperty("mapselected", JSON.stringify(mapselected));
  return mapselected
}

/**
 * Called by Email Snooze functions to get quick custom time buttons stored as a nested array
 * Each time stores: [(string), (string)]
 *      [0] name of time to be displayed on button (usually: time in hours + " Hours")
 *      [1] time in hours used to set the snooze timebased trigger
 * Example quicksnooze object: 
 *    [["30 Minutes","0.5"],["2 Hours","2"],["Tomorrow","24"],["Next Week","168"]]
 * @return {Object} The quicksnooze nested array
 */
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

/**
 * Called by Email Snooze functions to get quick custom recipient groups buttons stored as a nested array
 * Each recipient group stores: [(string), (string)]
 *      [0] name of recipient group to be displayed on button
 *      [1] string of comma separated email addresses 
 * Example recipientgroups object: 
 *    [["Colleagues","example@uwa.edu.au, example1@uwa.edu.au, example2@uwa.edu.au"],["Family","example@gmail.com, example@gmail.com"]]
 * @return {Object} The recipientgroups nested array
 */
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

/**
 * Called by Email Snooze functions to set default additional recipient input 
 * Stores: (string)
 *      of comma separated email addresses 
 * Example selectedrecipients object: 
 *    "example@uwa.edu.au, example1@uwa.edu.au, example2@uwa.edu.au"
 * @return {String} The selectedrecipients string
 */
function getPropertySelectedSnoozeRecipients(){
  var scriptProperties = PropertiesService.getUserProperties();
  selectedrecipients = scriptProperties.getProperty("selectedrecipients")
  if (selectedrecipients===null){ selectedrecipients = " "; }
  else if (typeof(selectedrecipients) != "string") { selectedrecipients = " "; }
  scriptProperties.setProperty("selectedrecipients", selectedrecipients);
  return selectedrecipients
}

/**
 * Called by Meeting Poll functions to store meeting location options in an array
 * Stores: [(string)] 
 *      each string contains a name of location
 * Example dplocations object: 
 *    ["To Be Confirmed","Other","Zoom","Teams"]
 * @return {Object} The dplocations array
 */
function getPropertyDPLocation(){
  console.log("checking dplocations")
  var scriptProperties = PropertiesService.getUserProperties();
  var dplocations = JSON.parse(scriptProperties.getProperty("dplocations"));
  if (dplocations===null){
    dplocations = ["To Be Confirmed","Other","Zoom","Teams"];
  }
  else {
    dplocations.forEach(function(value) {
      if (typeof(value) != "string") dplocations = ["To Be Confirmed","Other","Zoom","Teams"];
    })
  }
  scriptProperties.setProperty("dplocations", JSON.stringify(dplocations));
  return dplocations;
}

/**
 * Called by Meeting Poll functions to store options for text-based polls
 * Stores: [(date)] 
 *      each string is one poll option
 * Example textoptions object: 
 *    ["Tomorrow night","Next week"]
 * @return {Object} The textoptions array
 */
function checkPropertyDPTextOptions(){
  var scriptProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(scriptProperties.getProperty("dptextoptions"));
  if (dptextoptions===null){ textoptions = []; }
  else {
    textoptions.forEach(function(value) {
      if (typeof(value) != "string") textoptions = [];
    })
  }
  scriptProperties.setProperty("dptextoptions", JSON.stringify(textoptions));
  return textoptions;
}

/**
 * Called by Meeting Poll functions to store options for date-based polls
 * Stores: [(date)] 
 *      each value is a date object containing the start meeting time
 * Example dateoptions object: 
 *    [ { hasTime: true, msSinceEpoch: 1633777021106, hasDate: true },
      { hasDate: true, hasTime: true, msSinceEpoch: 1633766400000 },
      { hasTime: true, hasDate: true, msSinceEpoch: 1633914000000 } ]
 * @return {Object} The dateoptions array
 */
function checkPropertyDPDateOptions(){
  var scriptProperties = PropertiesService.getUserProperties();
  dateoptions = JSON.parse(scriptProperties.getProperty("dpdateoptions"))
  if (dateoptions===null){ dateoptions = []; }
  else {
    dateoptions.forEach(function(value) {
      if (typeof(value) != "object" || value.hasDate == 'undefined') dateoptions = [];
    })
  }
  scriptProperties.setProperty("dpdateoptions", JSON.stringify(dateoptions));
  return dateoptions;
}

/**
 * Called by Meeting Poll functions to store the currently open polls
 * Stores: [(string), (string), (Object), (string)] 
 *      [0] google form id used to recieve google form object
 *      [1] length of meeting in minutes
 *      [2] array containing strings of respondents email addresses
 *      [3] meeting location
 * Example dpmanaging object: 
 *    [[ '1YMxGy2jG2HwCLGN8HO6XRGTkYZ2YDkxqNGI839cc5_Q','60', [],'Zoom']]
 * @return {Object} The dpmanaging array
 */
function getPropertyDPManaging(){
  var scriptProperties = PropertiesService.getUserProperties();
  dpmanaging = JSON.parse(scriptProperties.getProperty("dpmanaging"));
  if (dpmanaging===null){ dpmanaging = [];}
  else {
    dpmanaging.forEach(function(value) {
      // need to check that the google form id exists (has not been deleted by user through google forms)
      if (value[0] == undefined || value[1] == undefined ||value[2] == undefined ||value[3] == undefined ){ 
        dateoptions = [];
      }
    })
  }
  scriptProperties.setProperty("dpmanaging", JSON.stringify(dpmanaging));
  return dpmanaging;
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
  var recipientgroups = getPropertyrecipientgroups();

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
  var mapsaved = getPropertymap();
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
  var doodlepolllocations = getPropertyDPLocation();
  var doodlepollButtonSet = CardService.newButtonSet();

  doodlepolllocations.forEach(function(value) {
    if (value != "Other" && value != "To Be Confirmed") {
      var removeaction = CardService.newAction()
      .setFunctionName('removePropertiesServiceItem')
      .setParameters({name:"dplocations", item:JSON.stringify(value)});
      var button = CardService.newTextButton()
        .setText(value)
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
  getPropertyDPLocation();
  addPropertiesServiceItem("dplocations", e.formInput.addQuickLocationInput)
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
