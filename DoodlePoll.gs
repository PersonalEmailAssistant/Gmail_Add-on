// Begin by building the root card with 1st section 'General Info'.
function doodlePoll(e) {
  PropertiesService.getUserProperties().deleteAllProperties();
  items = getPropertyDPManaging();

  // Reset UserCache
  var userCache = CacheService.getUserCache();
  userCache.put("dptitle",null);
  userCache.put("dplength",null);
  userCache.put("dplocation",null);
  userCache.put("dpotherlocation",null);
  userCache.put("dpnotes",null);
  userCache.put("dpdateused", true)

  if (items.length == 0){return createDoodlePoll(e);}
  var button1 = CardService.newTextButton()
      .setText('Create new doodle poll')
      .setOnClickAction(CardService.newAction()
      .setFunctionName('createDoodlePoll'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var section = CardService.newCardSection()
    .addWidget(button1)
    .addWidget(CardService.newDivider());

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Doodle Polls"))
    .addSection(section);

  items.forEach(function(formarray) {
    formid = formarray[0]
    section = CardService.newCardSection();
    form = FormApp.openById(formid);
    rows = form.getItems()[0].asGridItem().getRows();
    buttonSet = CardService.newButtonSet();
    rows.forEach(function(value){
      var button = CardService.newTextButton().setText("- "+value)
        .setOnClickAction(CardService.newAction()
        .setFunctionName('bookMeetingCard').setParameters({time: value, formid: formid}));
      buttonSet.addButton(button);})

    var text1 = CardService.newTextParagraph().setText("View poll results: <a href="+form.getSummaryUrl()+">"+form.getSummaryUrl()+"</a> \n\nClick time to close poll and book meeting:");
    var text2 = CardService.newTextParagraph().setText("Or close poll without booking meeting: ")
    var button2 = CardService.newTextButton().setText("Close poll")
        .setOnClickAction(CardService.newAction()
        .setFunctionName('closeDoodlePoll').setParameters({formid: formid}));

    section.setHeader("Meeting Poll: "+form.getItems()[0].getTitle());
    section.addWidget(text1).addWidget(buttonSet).addWidget(text2).addWidget(button2);
    card.addSection(section);
  })

  card.setFixedFooter(buildPreviousAndRootButtonSet());
  return card.build();
}

function createDoodlePoll(e){
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("dpdateoptions", JSON.stringify([]));
  userProperties.setProperty("dptextoptions", JSON.stringify([]));

  var card = CardService.newCardBuilder()
    .addSection(generalInfoSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());
  return card.build();
}


// -----------------------------------------------------------------------------------
// ---------------------------- BASE DOODLE POLL SECTIONS ----------------------------
// -----------------------------------------------------------------------------------

// Layout/sections are made to directly mirror Doodle Poll. Changes to be made after feedback received from clients

// 1/3 GENERAL INFO
function generalInfoSection(e) {

  var generalInfoSection = CardService.newCardSection()
    .setHeader("Step 1 of 3: General Information")
    .addWidget(headerDP1())
    .addWidget(titleDP())
    .addWidget(meetingLengthDP())
    .addWidget(notesDP())
    .addWidget(locationDP())
    .addWidget(getManangeCustomButtons())
    .addWidget(nextButtonDP1());


  return generalInfoSection;
}

// 2/3 SCHEDULING
function schedulingSection(e) {


  var schedulingSection = CardService.newCardSection()
    .setHeader("Step 2 of 3: Scheduling Options")
    .addWidget(headerDP2())
    .addWidget(schedulingButtons())

  var userCache = CacheService.getUserCache();
  if (userCache.get("dpdateused")) {
    schedulingSection.addWidget(dateSelectorDP())
      .addWidget(addDateOptionButtonDP());
  }


  return schedulingSection;
}

// 3/3 POLL SETTINGS
function pollSettingsSection(e) {
  var pollSettingsSection = CardService.newCardSection()
    .setHeader("Step 3 of 3: Poll Settings")
    .addWidget(headerDP3())
    .addWidget(switchNotIdeal())
    .addWidget(switchSingleVote())
    .addWidget(switchHidden())
    .addWidget(switchResponses())
    .addWidget(nextButtonDP3());

    /**
     * 4 more "premium" switches that can extend the component:
     * Set Deadline
     * Set Auto-Reminders
     * Ask for Contact Information (email/phone/address)
     * Every Invitee's move (send back info on who has opened the poll etc.)
     */

  return pollSettingsSection;
}


// -----------------------------------------------------------------------------------
// ------------------------------- DOODLE POLL WIDGETS -------------------------------
// -----------------------------------------------------------------------------------

// ------------------------------------ HEADERS --------------------------------------

function headerDP1(e) {
  var decoratedText = CardService.newDecoratedText()
    .setText("What's the Occasion?")
    .setText("These details cover the general info of the poll. Title and Meeting Length are required.")
    .setWrapText(true);
  return decoratedText;
}

function headerDP2(e) {
  var decoratedText = CardService.newDecoratedText()
    .setText("What are the Options? Please Select at least 2 options to continue.\n\nDuplicate options will be discarded.")
    .setWrapText(true);;
  return decoratedText;
}

function headerDP3(e) {
  var decoratedText = CardService.newDecoratedText()
    .setText("Poll Settings");
  return decoratedText;
}

// ---------------------------------- "NEXT" BUTTONS ------------------------------------

function nextButtonDP1(e) {

    var nextButton = CardService.newTextButton()
      .setText('Next')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('ontoSection2'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

    var nextButtonSet = CardService.newButtonSet()
      .addButton(nextButton);

    return nextButtonSet;
}

function nextButtonDP2(e) {

    var nextButton = CardService.newTextButton()
      .setText('Next')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('ontoSection3'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

    var nextButtonSet = CardService.newButtonSet()
      .addButton(nextButton);

    return nextButtonSet;
}

function nextButtonDP3(e) {

    var nextButton = CardService.newTextButton()
      .setText('Complete Poll')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('completePoll'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

    var nextButtonSet = CardService.newButtonSet()
      .addButton(nextButton);

    return nextButtonSet;
}

// ------------------------- SECTION 1 - generalInfoSection --------------------------

function titleDP(e) {

  var userCache = CacheService.getUserCache();
  var title = userCache.get("dptitle");

  var titleDP = CardService.newTextInput()
    .setFieldName("titleDPvalue")
    .setTitle("Title of Meeting Poll")
    .setHint("Required")

  if (title != null) titleDP.setValue(title);

  return titleDP;
}

function meetingLengthDP(e) {

  var userCache = CacheService.getUserCache();
  var meetinglength = userCache.get("dplength");

  var meetingLength = CardService.newTextInput()
    .setFieldName("meetingLengthDPvalue")
    .setTitle("Length of Meeting")
    .setHint("Required. Set in minutes. A 1 hour meeting is '60'.")

  if (meetinglength != null) meetingLength.setValue(meetinglength);

  return meetingLength;
}

function locationDP(e) {

  var userCache = CacheService.getUserCache();
  var location = userCache.get("dplocation");

  var locationDP = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("locationDPvalue")
    .setTitle("Location")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('updateLocationDP'));

  locations = getPropertyDPLocation();
  locations.forEach(function(value) {
    if (locationDPvar == value) locationDP.addItem(value, value, true)
    else locationDP.addItem(value, value, false)
  })

  return locationDP;
}

// NON-ROOT NODE WIDGET (ISN'T DISPLAYED WHEN THE CARD FIRST LOADS)
function otherLocationDP(e) {

  var userCache = CacheService.getUserCache();
  var otherlocation = userCache.get("dpotherlocation");

  var otherLocationDP = CardService.newTextInput()
    .setFieldName("otherLocationDPvalue")
    .setTitle("Other Location")

  if (otherlocation != null) otherLocationDP.setValue(otherlocation)

  return otherLocationDP;
}

function notesDP(e) {

  var userCache = CacheService.getUserCache();
  var notes = userCache.get("dpnotes");

  var notesDP = CardService.newTextInput()
    .setFieldName("notesDPvalue")
    .setTitle("Notes")
    .setHint("Optional. Provides a description for the poll.")

  if (notes != null) notesDP.setValue(notes)

  return notesDP;
}


// -------------------------- SECTION 2 - schedulingSection ------------------------


function schedulingButtons(e) {

  // Create the buttons
  var schedulingDatesButton = CardService.newTextButton()
      .setText('Date Options')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('dateScheduleUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var schedulingTextButton = CardService.newTextButton()
      .setText('Text Options')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('textScheduleUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  `// Create the button set`
  var schedulingButtonSet = CardService.newButtonSet()
    .addButton(schedulingDatesButton)
    .addButton(schedulingTextButton);

  return schedulingButtonSet;
}

function dateSelectorDP(e) {

  var dateSelector = CardService.newDateTimePicker()
      .setTitle("Option")
      .setFieldName("dateSelectorKey")

  checkPropertyDPDateOptions();
  var userProperties = PropertiesService.getUserProperties();
  dateOptions = JSON.parse(userProperties.getProperty("dpdateoptions"));

  if (dateOptions.length == 0) dateSelector.setValueInMsSinceEpoch(new Date().getTime());
  else dateSelector.setValueInMsSinceEpoch(dateOptions[dateOptions.length-1].msSinceEpoch);

  return dateSelector;
}

function addDateOptionButtonDP(e) {

  var addDateOptionButton = CardService.newTextButton()
      .setText('Add Option to Poll')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('addDateOption'))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  return CardService.newButtonSet().addButton(addDateOptionButton);
}

function formatDatesDP(e) {
  checkPropertyDPDateOptions();
  var userProperties = PropertiesService.getUserProperties();
  dateOptions = JSON.parse(userProperties.getProperty("dpdateoptions"));

  var userProperties = CacheService.getUserCache();
  var meetinglength = userProperties.get("dplength");

  var formattedDates = [];
  dateOptions.forEach(function(value) {
    var startTime = Utilities.formatDate(new Date(value.msSinceEpoch), userTimeZone, "EEE, MMM dd YYYY, hh:mm a");
    var endTime = Utilities.formatDate(new Date(value.msSinceEpoch  + meetinglength * 60000),
        userTimeZone, "EEE, MMM dd YYYY, hh:mm a");
    console.log("Start Time: " + startTime);
    console.log("End Time: " + endTime);
    console.log("OG Number: " + value.msSinceEpoch);
    console.log("Plus Meeting Length: " + meetinglength);
    formattedDates.push(startTime + " - \n" + endTime);
  })

  return formattedDates;
}

function textSelectorDP(e) {
  var textSelector = CardService.newTextInput()
    .setTitle("New Option")
    .setFieldName("textSelectorKey")
    .setValue("");

  return textSelector;
}

function addTextOptionButtonDP(e) {

  var addTextOptionButton = CardService.newTextButton()
      .setText('Add Option to Poll')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('addTextOption'))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  return CardService.newButtonSet().addButton(addTextOptionButton);
}

function showDateOptionDP(e) {

  var formattedText = ''

  checkPropertyDPDateOptions();
  var userProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(userProperties.getProperty("dpdateoptions"));

  textoptions.forEach(function(value) {
    time = new Date(value.msSinceEpoch);
    //https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    timevalue = Utilities.formatDate(time, userTimeZone, "EEE, MMM dd, hh:mm a");
    formattedText = formattedText + timevalue + '\n';
  })

  var showDateOption = CardService.newDecoratedText()
    .setTopLabel("Selected Options")
    .setText(formattedText)
    .setWrapText(true);

  return showDateOption;
}


function showTextOptionDP(e) {

  var formattedText = ''
  checkPropertyDPTextOptions();
  var userProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(userProperties.getProperty("dptextoptions"));
  textoptions.forEach(function(value) {
    formattedText = formattedText + value + '\n';
  })

  var showTextOption = CardService.newDecoratedText()
    .setTopLabel("Selected Options")
    .setText(formattedText)
    .setWrapText(true);
  return showTextOption;
}

function removeOptionDP(e) {

  var removeOption = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("removeOptionDPvalue")
    .setTitle("Remove an Option")

  removeOption.addItem("","",true)
  var userProperties = PropertiesService.getUserProperties();
  var userCache = CacheService.getUserCache();
  if (userCache.get("dpdateused")) {
    removeOption.setOnChangeAction(CardService.newAction()
      .setFunctionName('removeDateOption'));
    checkPropertyDPDateOptions();
    options = JSON.parse(userProperties.getProperty("dpdateoptions"));
    options.forEach(function(value) {
      time = new Date(value.msSinceEpoch);
      //https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
      timevalue = Utilities.formatDate(time, userTimeZone, "EEE, MMM dd, hh:mm a");
      removeOption.addItem(timevalue, timevalue, false)
    })
  }
  else {
    removeOption.setOnChangeAction(CardService.newAction()
      .setFunctionName('removeTextOption'));
    checkPropertyDPTextOptions();
    options = JSON.parse(userProperties.getProperty("dptextoptions"));
    options.forEach(function(value) {
      removeOption.addItem(value, value, false)
    })
  }

  return removeOption;
}

// -------------------------- SECTION 3 - pollSettingSection -------------------------
// https://developers.google.com/apps-script/reference/card-service/switch

function switchNotIdeal() {

  var switchNotIdeal = CardService.newDecoratedText()
    .setTopLabel("Yes, no, if need be")
    .setText("Participants can indicate if an option is not ideal for them.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchNotIdealkey")
      .setValue("switchNotIdealvalue"));

  return switchNotIdeal;
}

function switchSingleVote() {

  var switchSingleVote = CardService.newDecoratedText()
    .setTopLabel("Limit Participants to a Single Vote")
    .setText("Participants can only select one option.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchSingleVoteKey")
      .setValue("switchSingleVoteValue"));

  return switchSingleVote;
}

function switchHidden() {

  var switchHidden = CardService.newDecoratedText()
    .setTopLabel("Hidden Poll")
    .setText("Participants’ names, comments and votes are confidential.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchHiddenKey")
      .setValue("switchHiddenValue"));

  return switchHidden;
}

function switchResponses() {

  var switchResponses = CardService.newDecoratedText()
    .setTopLabel("Response Updates")
    .setText("Participants’ responses are sent back to the poll setter as updates.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchResponsesKey")
      .setValue("switchResponsesValue"));

  return switchResponses;
}

// -----------------------------------------------------------------------------------
// ----------------------------- DOODLE POLL CARD UPDATES ----------------------------
// -----------------------------------------------------------------------------------

function updateLocationDP(e) {

  // PUT VALUES INTO UserCache
  var userCache = CacheService.getUserCache();
  userCache.put("dptitle",e.formInput.titleDPvalue);
  userCache.put("dplength",e.formInput.meetingLengthDPvalue);
  userCache.put("dplocation",e.formInput.locationDPvalue);
  userCache.put("dpotherlocation",e.formInput.otherLocationDPvalue);
  userCache.put("dpnotes", e.formInput.notesDPvalue);

  /*
  // UPDATE WIDGET VALUES
  titleDPvar = e.formInput.titleDPvalue;
  meetingLengthDPvar = e.formInput.meetingLengthDPvalue;
  notesDPvar = e.formInput.notesDPvalue;
  locationDPvar = e.formInput.locationDPvalue;
  otherLocationDPvar = e.formInput.otherLocationDPvalue;
  */

  // UPDATE SECTION ACCORDING TO IF 'OTHER' LOCATION IS SELECTED OR
  var updatedSection = CardService.newCardSection()
      .setHeader("Step 1 of 3: General Information")
      .addWidget(headerDP1())
      .addWidget(titleDP())
      .addWidget(meetingLengthDP())
      .addWidget(notesDP())
      .addWidget(locationDP())

  if(e.formInput.locationDPvalue == "Other") {
    updatedSection.addWidget(otherLocationDP())
      .addWidget(getManangeCustomButtons())
      .addWidget(nextButtonDP1());
  }
  else {
    updatedSection.addWidget(getManangeCustomButtons())
      .addWidget(nextButtonDP1());
  }

  var card = CardService.newCardBuilder()
    .addSection(updatedSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

// Function runs on any updates to the Text Scheduling section
function dateScheduleUpdateDP(e) {
  var userCache = CacheService.getUserCache();
  userCache.put("dpdateused", true)

  var dateScheduleSection = CardService.newCardSection()
    .addWidget(showDateOptionDP())

  var userProperties = PropertiesService.getUserProperties();
  if (JSON.parse(userProperties.getProperty("dpdateoptions")).length >= 1) {
    dateScheduleSection.addWidget(removeOptionDP());
  }
  if (JSON.parse(userProperties.getProperty("dpdateoptions")).length >= 2) {
    dateScheduleSection.addWidget(nextButtonDP2());
  }

  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .addSection(dateScheduleSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}


// Function runs on any updates to the Text Scheduling section
function textScheduleUpdateDP(e) {
  var userCache = CacheService.getUserCache();
  var userProperties = PropertiesService.getUserProperties();
  userCache.put("dpdateused",false)

  var textScheduleSection = CardService.newCardSection()
    .addWidget(textSelectorDP())
    .addWidget(addTextOptionButtonDP())
    .addWidget(showTextOptionDP());


  if (JSON.parse(userProperties.getProperty("dptextoptions")).length >= 1) {
    textScheduleSection.addWidget(removeOptionDP());
  }
  if (JSON.parse(userProperties.getProperty("dptextoptions")).length >= 2) {
    textScheduleSection.addWidget(nextButtonDP2());
  }

  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .addSection(textScheduleSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function addDateOption(e) {
  checkPropertyDPDateOptions();
  var userProperties = PropertiesService.getUserProperties();
  var dateoptions = JSON.parse(userProperties.getProperty("dpdateoptions"));
  var inlist = false;
  dateoptions.forEach(function(value) {
    if (value.msSinceEpoch == e.formInput.dateSelectorKey.msSinceEpoch) {
      inlist = true;
    }
  })
  if(!inlist){
    dateoptions.push(e.formInput.dateSelectorKey);
    userProperties.setProperty("dpdateoptions", JSON.stringify(dateoptions));
  }
  return dateScheduleUpdateDP();
}

function addTextOption(e) {
  checkPropertyDPTextOptions();
  var userProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(userProperties.getProperty("dptextoptions"));
  var inlist = false;
  textoptions.forEach(function(value) {
    if (value == e.formInput.textSelectorKey) {
      inlist = true;
    }
  })

  if(!inlist){
    textoptions.push(e.formInput.textSelectorKey);
    userProperties.setProperty("dptextoptions", JSON.stringify(textoptions));
  }

  return textScheduleUpdateDP();
}

function removeDateOption(e) {
  var userProperties = PropertiesService.getUserProperties();
  checkPropertyDPDateOptions();
  dateoptions = JSON.parse(userProperties.getProperty("dpdateoptions"));
  newerlist = [];
  dateoptions.forEach(function(value) {
    formattedValue = Utilities.formatDate(new Date(value.msSinceEpoch), userTimeZone, "EEE, MMM dd, hh:mm a");
    if (formattedValue != e.formInput.removeOptionDPvalue) {
      newerlist.push(value)
    }
  })
  userProperties.setProperty("dpdateoptions", JSON.stringify(newerlist));
  return dateScheduleUpdateDP();
}

function removeTextOption(e) {
  var userProperties = PropertiesService.getUserProperties();
  checkPropertyDPTextOptions();
  textoptions = JSON.parse(userProperties.getProperty("dptextoptions"));
  textoptions.pop(e.formInput.removeOptionDPvalue);
  userProperties.setProperty("dptextoptions", JSON.stringify(textoptions));

  return textScheduleUpdateDP();
}

// -----------------------------------------------------------------------------------
// ------------------------------- SECTION CHANGERS -----------------------------------
// -----------------------------------------------------------------------------------

function ontoSection2 (e) {

  if (e.formInput.titleDPvalue != null && e.formInput.meetingLengthDPvalue != null &&
      !isNaN(e.formInput.meetingLengthDPvalue) &&
      (e.formInput.locationDPvalue != 'Other' || e.formInput.otherLocationDPvalue != null)) {

    // PUT VALUES INTO UserCache
    var userCache = CacheService.getUserCache();
    userCache.put("dptitle",e.formInput.titleDPvalue);
    userCache.put("dplength",e.formInput.meetingLengthDPvalue);
    userCache.put("dplocation",e.formInput.locationDPvalue);
    userCache.put("dpotherlocation",e.formInput.otherLocationDPvalue);
    userCache.put("dpnotes", e.formInput.notesDPvalue);

    var card = CardService.newCardBuilder()
      .addSection(schedulingSection())
      .setFixedFooter(buildPreviousAndRootButtonSet());

    return CardService.newNavigation().updateCard(card.build());
  }
}

function ontoSection3 (e) {

  var card = CardService.newCardBuilder()
    .addSection(pollSettingsSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function completePoll (e) {

  // RETRIEVE UserCache VALUES
  var userCache = CacheService.getUserCache();
  var title = userCache.get("dptitle");
  var meetinglength = userCache.get("dplength");
  var location = userCache.get("dplocation");
  var otherlocation = userCache.get("dpotherlocation");
  var notes = userCache.get("dpnotes");
  var dateused = userCache.get("dpdateused")
  // Title / Description
  var form = FormApp.create(title)
    .setTitle(title)
    .setDescription(notes)
  if (location != 'Other') {
    form.addSectionHeaderItem()
      .setTitle('Meeting Location: ' + location);
  } else {
    form.addSectionHeaderItem()
      .setTitle('Meeting Location: ' + otherlocation);
  }

  // If only 1 vote allowed, provide radio buttons
  if (e.formInput.switchSingleVoteKey) {
    pollItem = form.addMultipleChoiceItem()
      .setTitle("Which meeting time suits?")
      .setHelpText("Only one choice allowed.")
      .showOtherOption(true);
    if (dateused) {
      pollItem.setChoiceValues( formatDatesDP(e) )
    } else {
      pollItem.setChoiceValues( textOptions )
    }
  }
  // If multiple votes are allowed, provide checkboxes
  else {
    var pollItem = form.addGridItem()
      .setTitle("Which meeting time suits?")
      .setRows( formatDatesDP(e) )
    // If 'Not Ideal' switch active
    if (e.formInput.switchNotIdealkey) {
      pollItem.setColumns([
        "Available",
        "Not Ideal",
        "Unavailable"
      ])
    // If 'Not Ideal' switch inactive
    } else {
      pollItem.setColumns([
        "Available",
        "Unavailable"
      ])
    }
  }

  //Form Settings
  if (e.formInput.switchHiddenKey) {
    form.setCollectEmail(false);
  }
  else {
    form.setCollectEmail(true);
  }
  console.log(form.getPublishedUrl())
  ScriptApp.newTrigger("onFormResponse").forForm(form).onFormSubmit().create();
  getPropertyDPManaging();
  if (location != 'Other') addNewDoodlePoll(form.getId(), meetinglength, location);
  else addNewDoodlePoll(form.getId(), meetinglength, otherlocation);

  var text = CardService.newTextParagraph().setText("Doodle poll link: <a href="+form.getPublishedUrl()+">"+form.getPublishedUrl()+"</a>");
  var section = CardService.newCardSection()
    .setHeader("Meeting poll has been created successfully.")
    .addWidget(text);

  var card = CardService.newCardBuilder()
    .addSection(section)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build()); //this line causes an error for me
}

function onFormResponse(e){
  if (switchResponsesKey) {
  console.log(e.response.getRespondentEmail())
  meetingAddEmail(e.source.getId(), e.response.getRespondentEmail())
  //console.log(e.response.getItemResponses()[1].getResponse())
  emailBody = "There has been a new response \nView poll results at: " + e.source.getSummaryUrl()
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "New form response", emailBody);
  }
}

function bookMeetingCard(e){
  formid = e.parameters.formid;
  var storedpolls = getPropertyDPManaging();
  var emails = [];
  var location = ""
  storedpolls.forEach(function(array) {if (array[0]== formid) emails = array[2]; location=array[3]})
  console.log(emails)
  var form = FormApp.openById(formid)
  time = e.parameters.time;

  var action = CardService.newAction()
    .setFunctionName('bookMeeting')
    .setParameters({time: e.parameters.time, formid: e.parameters.formid});
  var bookButton = CardService.newTextButton()
    .setText('Confirm Meeting and Close Poll')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);

  emailstring = "";
  emails.forEach(function(address) {emailstring +=address+" "})

  var invitetext = CardService.newTextParagraph().setText(form.getItems()[0].getTitle()+" for "+time+"\n\nEmail Invitation:");
  var emailtext = CardService.newTextParagraph().setText("Invited: "+emailstring);
  var emailField = CardService.newTextInput().setFieldName("addemails").setTitle("Add emails");
  var addemailsubmit = CardService.newTextButton().setText('Add Email')
    .setOnClickAction(CardService.newAction().setFunctionName("bookMeetingAddEmail")
    .setParameters({time: e.parameters.time, formid: e.parameters.formid}));
  var titlefield = CardService.newTextInput().setFieldName("titlefield").setTitle("Title").setValue(form.getItems()[0].getTitle());
  var locationfield = CardService.newTextInput().setFieldName("locationfield").setTitle("Location").setValue(location);
  //var locationfield = CardService.newTextInput().setFieldName("locationfield").setTitle("Location");

  // Card Section for Snooze components, each add widget calls a function that creates the widget
  var section = CardService.newCardSection()
    .setHeader("Book Meeting")
    .addWidget(invitetext)
    .addWidget(titlefield)
    .addWidget(emailtext)
    .addWidget(emailField)
    .addWidget(addemailsubmit)
    .addWidget(locationfield)
    .addWidget(bookButton);

  var footer = buildPreviousAndRootButtonSet();

  // Card which includes the Snooze components only
  var card = CardService.newCardBuilder()
    .addSection(section)
    .setFixedFooter(footer);
  return card.build();
}

function bookMeetingAddEmail(e){
  meetingAddEmail(e.parameters.formid, e.formInput.addemails)
  return bookMeetingCard(e)
}

function meetingAddEmail(formid, email){
  if (email != null){
    var userProperties = PropertiesService.getUserProperties();
    var storedpolls = getPropertyDPManaging();
    storedpolls.forEach(function(array) {if (array[0]== formid) array[2].push(email)});
    userProperties.setProperty("dpmanaging", JSON.stringify(storedpolls));
  }
}

function bookMeeting(e){
  formid = e.parameters.formid;
  var storedpolls = getPropertyDPManaging();
  var meetinglength = 30; // set to 30 minutes by default
  var emails = [];
  storedlocation = e.formInput.locationfield

  storedpolls.forEach(function(array) {if (array[0]== formid)
  {meetinglength = array[1]; emails = array[2];}})
  console.log(meetinglength)
  emailstring = "";
  emails.forEach(function(email){emailstring +=email+","})
  console.log(emailstring)

  time = e.parameters.time;
  hoursoffset = parseInt(Utilities.formatDate(now, userTimeZone, "hh"))-parseInt(Utilities.formatDate(now, "GMT", "hh"));

  starttime = new Date(time + now.getFullYear());
  console.log(starttime);
  starttime = new Date(starttime.getTime()-(hoursoffset * 60 * 60 * 1000)); // stored date includes timezone which is an issue
  endtime = new Date(starttime.getTime()+(meetinglength * 60 * 1000)); // add 30 minutes in milliseconds
  console.log(starttime);
  console.log(endtime);
  CalendarApp.getDefaultCalendar().createEvent(e.formInput.titlefield,starttime,endtime,
    {location:storedlocation, guests:emailstring, sendInvites:true}); // location for now is always set to zoom
  return closeDoodlePoll(e)
}

function closeDoodlePoll(e){
  console.log(e);
  var form = FormApp.openById(e.parameters.formid)
  form.setAcceptingResponses(false);
  DriveApp.getFileById(e.parameters.formid).setTrashed(true);

  var userProperties = PropertiesService.getUserProperties();
  var newarray = new Array;
  dpmanaging = JSON.parse(userProperties.getProperty("dpmanaging"))
  dpmanaging.forEach(function(value) {
    if (value[0]!=e.parameters.formid) newarray.push(value);});
  userProperties.setProperty("dpmanaging", JSON.stringify(newarray));
  return doodlePoll(e)
}
