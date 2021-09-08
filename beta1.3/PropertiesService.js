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

function checkPropertyquicksnooze(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("quicksnooze")===null){
    var defaultquicksnooze = [["30 Minutes","0.5"],["2 Hours","2"],["Tomorrow","24"],["Next Week","168"]]; // time in hours
    scriptProperties.setProperty("quicksnooze", JSON.stringify(defaultquicksnooze));
  }
}

function checkPropertyrecipientgroups(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("recipientgroups")===null){
    scriptProperties.setProperty("recipientgroups", JSON.stringify([["test","test@example.com, test2@example.com"]]));// temp email addresses
  }
}

function checkPropertySelectedSnoozeRecipients(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("selectedrecipients")===null){
    scriptProperties.setProperty("selectedrecipients", " ");
  }
}




function manageCustomButtonsCard(){
  var scriptProperties = PropertiesService.getUserProperties();


  //// snooze email buttons
  checkPropertyquicksnooze();
  var quicksnoozetimes = JSON.parse(scriptProperties.getProperty("quicksnooze"));
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
  //var info2 = CardService.newTextParagraph().setText("Click to remove saved buttons.");

  var addaction = CardService.newAction()
  .setFunctionName('addNewQuickButton');
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

  var card = CardService.newCardBuilder().addSection(snoozeSection).addSection(recipientSection).addSection(mapSection)
  return card.build();
}

function addNewRecipientGroup(e){
  var name = e.formInput.recipientgroupnameinput;
  var addresses = e.formInput.recipientgroupaddressesinput;
  if (name == undefined || addresses == undefined) return;
  checkPropertyrecipientgroups();
  var scriptProperties = PropertiesService.getUserProperties();
  var array = JSON.parse(scriptProperties.getProperty("recipientgroups"));
  console.log(array);
  array.push([name, addresses]);
  console.log(array);
  scriptProperties.setProperty("recipientgroups", JSON.stringify(array));
  return manageCustomButtonsCard();
}

function addNewQuickButton(e){
  console.log(e.formInput.addquickbuttoninput);
  if (e.formInput.addquickbuttoninput == undefined) return;
  checkPropertyquicksnooze();
  var scriptProperties = PropertiesService.getUserProperties();
  var quicksnoozebuttons = JSON.parse(scriptProperties.getProperty("quicksnooze"));
  var buttonname = e.formInput.addquickbuttoninput + " Hours"
  quicksnoozebuttons.push([buttonname, ""+e.formInput.addquickbuttoninput]);
  scriptProperties.setProperty("quicksnooze", JSON.stringify(quicksnoozebuttons));
  return manageCustomButtonsCard();
}

function removePropertiesServiceItem(e){
  var item = JSON.parse(e.parameters.item);
  var scriptProperties = PropertiesService.getUserProperties();

  var newarray = new Array;
  JSON.parse(scriptProperties.getProperty(e.parameters.name)).forEach(function(value) {
    if (value[0]!=item[0] && value[1]!=item[1]) newarray.push(value);});

  scriptProperties.setProperty(e.parameters.name, JSON.stringify(newarray));
  return manageCustomButtonsCard();
}