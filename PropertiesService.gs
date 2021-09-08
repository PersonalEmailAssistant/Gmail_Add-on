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
    scriptProperties.setProperty("recipientgroups", JSON.stringify([["test","22721679@student.uwa.edu.au,lilyfel3@gmail.com"]]));// temp email addresses
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
    .setNumUncollapsibleWidgets(1)

  return CardService.newCardBuilder().addSection(snoozeSection).build();
}

function addPropertiesServiceItem(e){}

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

