// Begin by building the root card with 1st section 'General Info'.
function doodlePoll(e) {
  items = getPropertyDPManaging();
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
    rows = form.getItems()[1].asGridItem().getRows();
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
  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("dpdateoptions", JSON.stringify([]));
  scriptProperties.setProperty("dptextoptions", JSON.stringify([]));

  var card = CardService.newCardBuilder()
    .addSection(generalInfoSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());
  return card.build();
}

function manageDoodlePollCard(e){
  
}

// -----------------------------------------------------------------------------------
// -------------------------- DOODLE POLL GLOBAL VARIABLES ---------------------------
// -----------------------------------------------------------------------------------

// Section 1
var titleDPvar;
var meetingLengthDPvar;
var locationDPvar = "TBC"; // Default value of 'To Be Confirmed'
var otherLocationDPvar;
var notesDPvar;

// Section 2
var dateUsedDP;

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
    .addWidget(locationDP())
    .addWidget(getManangeCustomButtons())
    .addWidget(notesDP())
  return generalInfoSection;
}

// 2/3 SCHEDULING
function schedulingSection(e) {
  var schedulingSection = CardService.newCardSection()
    .setHeader("Step 2 of 3: Scheduling Options")
    .addWidget(headerDP2())
    .addWidget(schedulingButtons());

  return schedulingSection;
}

// 3/3 POLL SETTINGS
function pollSettingsSection(e) {
  var pollSettingsSection = CardService.newCardSection()
    .setHeader("Step 3 of 3: Poll Settings")
    .addWidget(headerDP3())
    .addWidget(switchNotIdeal())
    .addWidget(switchLimitVotes())
    .addWidget(switchSingleVote())
    .addWidget(switchHidden())
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
    .setText("Title Required to Continue.");
  return decoratedText;
}

function headerDP2(e) {
  var decoratedText = CardService.newDecoratedText()
    .setText("What are the Options?");
  return decoratedText;
}

function headerDP3(e) {
  var decoratedText = CardService.newDecoratedText()
    .setText("Poll Settings");
  return decoratedText;
}

// ---------------------------------- "NEXT" BUTTONS ------------------------------------

function nextButtonDP1(e) {
  console.log(e);

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

  var titleDP = CardService.newTextInput()
    .setFieldName("titleDPvalue")
    .setTitle("Title of Meeting Poll")
    .setHint("Required")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  if (titleDPvar != null) {
    titleDP.setValue(titleDPvar)
  }

  return titleDP;
}

function meetingLengthDP(e) {
  var meetingLength = CardService.newTextInput()
    .setFieldName("meetingLengthDPvalue")
    .setTitle("Length of Meeting")
    .setHint("Required. Record in minutes - a 2 hour meeting is '120'.")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));
    
    if (meetingLengthDPvar != null) {
      meetingLength.setValue(meetingLengthDPvar)
    }

  return meetingLength;
}

function locationDP(e) {

 var locationDP = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("locationDPvalue")
    .setTitle("Location")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  checkPropertyDPLocation();
  var scriptProperties = PropertiesService.getUserProperties();
  locations = JSON.parse(scriptProperties.getProperty("dplocations"));
  locations.forEach(function(value) {
    if (locationDPvar == value[0]) locationDP.addItem(value[0], value[1], true)
    else locationDP.addItem(value[0], value[1], false)
  })

  return locationDP;
}

// NON-ROOT NODE WIDGET (ISN'T DISPLAYED WHEN THE CARD FIRST LOADS)
function otherLocationDP(e) {

  var otherLocationDP = CardService.newTextInput()
    .setFieldName("otherLocationDPvalue")
    .setTitle("Other Location")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  if (otherLocationDPvar != null) {
    otherLocationDP.setValue(otherLocationDPvar)
  }

  return otherLocationDP;
}

function notesDP(e) {

  var notesDP = CardService.newTextInput()
    .setFieldName("notesDPvalue")
    .setTitle("Notes")
    .setHint("Optional")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  if (notesDPvar != null) {
    notesDP.setValue(notesDPvar)
  }

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
      .setValueInMsSinceEpoch(new Date().getTime());

  return dateSelector
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
  var scriptProperties = PropertiesService.getUserProperties();
  dateOptions = JSON.parse(scriptProperties.getProperty("dpdateoptions"));

  var formattedDates = [];
  dateOptions.forEach(function(value) {
    formattedDates.push(Utilities.formatDate(new Date(value.msSinceEpoch), userTimeZone, "EEE, MMM dd, hh:mm a")); 
  })
  return formattedDates;
}

function textSelectorDP(e) {
  var textSelector = CardService.newTextInput()
    .setTitle("New Option")
    .setFieldName("textSelectorKey")
    .setValue("");
    //.setOnChangeAction(CardService.newAction()
      //.setFunctionName('changeTextOptions'));

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
  var scriptProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(scriptProperties.getProperty("dpdateoptions"));

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
  var scriptProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(scriptProperties.getProperty("dptextoptions"));
  textoptions.forEach(function(value) {
    formattedText = formattedText + value + '\n';
  })

  var showTextOption = CardService.newDecoratedText()
    .setTopLabel("Selected Options")
    .setText(formattedText)
    .setWrapText(true);
  return showTextOption;
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

function switchLimitVotes() {

  var switchLimitVotes = CardService.newDecoratedText()
    .setTopLabel("Limit the Number of Votes per Option")
    .setText("First come, first served. Once the spots are filled, the option is no longer available.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchLimitVotesKey")
      .setValue("switchNotIdealValue"));
  return switchLimitVotes;
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

// -----------------------------------------------------------------------------------
// ----------------------------- DOODLE POLL CARD UPDATES ----------------------------
// -----------------------------------------------------------------------------------

// Function runs on any updates to the general info section, excluding the optional notesDP value
function GeneralInfoCardUpdateDP(e) {
  // Update global variables
  titleDPvar = e.formInput.titleDPvalue;
  if (!isNaN(e.formInput.meetingLengthDPvalue)) {
    meetingLengthDPvar = e.formInput.meetingLengthDPvalue;
  }
  else meetingLengthDPvar = null;
  notesDPvar = e.formInput.notesDPvalue;
  locationDPvar = e.formInput.locationDPvalue;
  otherLocationDPvar = e.formInput.otherLocationDPvalue;

  var scriptProperties = CacheService.getUserCache();
  scriptProperties.put("dptitle",e.formInput.titleDPvalue);
  scriptProperties.put("dplength",e.formInput.meetingLengthDPvalue);

  var updatedSection = generalInfoSection();

  // If other location has been selected, add an "Other Location" input field
  if(e.formInput.locationDPvalue == "Other") {
    updatedSection.addWidget(otherLocationDP());
  }

  // If a title and meeting length has been entered, add a "Next" button
  if (titleDPvar != null && meetingLengthDPvar != null) {
    updatedSection.addWidget(nextButtonDP1(e))
  }
  // Update with a child card
  var card = CardService.newCardBuilder()
    .addSection(updatedSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}


// Function runs on any updates to the Text Scheduling section
function dateScheduleUpdateDP(e) {
  dateUsedDP = true;

  var dateScheduleSection = CardService.newCardSection()
    .addWidget(dateSelectorDP())
    .addWidget(addDateOptionButtonDP())
    .addWidget(showDateOptionDP());

  if (JSON.parse(scriptProperties.getProperty("dpdateoptions")).length >= 2) {
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
  dateUsedDP = false;

  var textScheduleSection = CardService.newCardSection()
    .addWidget(textSelectorDP())
    .addWidget(addTextOptionButtonDP())
    .addWidget(showTextOptionDP());

  if (JSON.parse(scriptProperties.getProperty("dptextoptions")).length >= 2) {
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
  var scriptProperties = PropertiesService.getUserProperties();
  dateoptions = JSON.parse(scriptProperties.getProperty("dpdateoptions"));
  dateoptions.push(e.formInput.dateSelectorKey);
  scriptProperties.setProperty("dpdateoptions", JSON.stringify(dateoptions));
  return dateScheduleUpdateDP();
}

function addTextOption(e) {
  checkPropertyDPTextOptions();
  var scriptProperties = PropertiesService.getUserProperties();
  textoptions = JSON.parse(scriptProperties.getProperty("dptextoptions"));
  textoptions.push(e.formInput.textSelectorKey);
  scriptProperties.setProperty("dptextoptions", JSON.stringify(textoptions));
  return textScheduleUpdateDP();
}

// -----------------------------------------------------------------------------------
// ------------------------------- SECTION CHANGERS -----------------------------------
// -----------------------------------------------------------------------------------

function ontoSection2 (e) {
  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function ontoSection3 (e) {

  var card = CardService.newCardBuilder()
    .addSection(pollSettingsSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function completePoll (e) {
  // somethings up with global variables because it doesnt have the stored value
  // so i am using UserCache instead
  console.log("Meeting length:");
  console.log(meetingLengthDPvar); 
  ///
  var scriptProperties = CacheService.getUserCache();
  var title = scriptProperties.get("dptitle");
  var meetinglength = scriptProperties.get("dplength");

  // Title / Description
  var form = FormApp.create(title);
  form.addParagraphTextItem().setTitle(title);

  // If only 1 vote allowed, provide radio buttons
  if (e.formInput.switchSingleVoteKey) {
    pollItem = form.addMultipleChoiceItem()
      .setTitle("Which meeting time suits?")
      .setHelpText("Only one choice allowed.")
      .showOtherOption(true);
    if (dateUsedDP) {
      pollItem.setChoiceValues( formatDatesDP(e) )
    } else {
      pollItem.setChoiceValues( textOptions )
    }
  }
  // If multiple votes are allowed
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
  addNewDoodlePoll(form.getId(), meetinglength);

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
  console.log(e)
  //console.log(e.response.getItemResponses()[0].getResponse())
  console.log(e.source.getSummaryUrl())
  emailBody = "There has been a new response \nView poll results at: " + e.source.getSummaryUrl()
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "New form response", emailBody);
}

function bookMeetingCard(e){
  // this will eventually have to change to accommodate meeting duration. for now set to 30 minutes
  // also will need to include additional email addresses
  formid = e.parameters.formid;
  var storedpolls = getPropertyDPManaging();
  var meetinglength = 30; // set to 30 minutes by default
  storedpolls.forEach(function(array) {if (array[0]== formid) meetinglength = array[1]})
  console.log(meetinglength)

  var form = FormApp.openById(formid)
  time = e.parameters.time;
  hoursoffset = parseInt(Utilities.formatDate(now, userTimeZone, "hh"))-parseInt(Utilities.formatDate(now, "GMT", "hh"));
  console.log(hoursoffset)

  starttime = new Date(time + now.getFullYear());
  console.log(starttime);
  starttime = new Date(starttime.getTime()-(hoursoffset * 60 * 60 * 1000)); // stored date includes timezone which is an issue
  endtime = new Date(starttime.getTime()+(meetinglength * 60 * 1000)); // add 30 minutes in milliseconds
  console.log(starttime);
  console.log(endtime);
  CalendarApp.getDefaultCalendar().createEvent(form.getItems()[0].getTitle(),starttime,endtime);
  return closeDoodlePoll(e);
}

function closeDoodlePoll(e){
  console.log(e);
  var form = FormApp.openById(e.parameters.formid)
  form.setAcceptingResponses(false);
  DriveApp.getFileById(e.parameters.formid).setTrashed(true);

  var scriptProperties = PropertiesService.getUserProperties();
  var newarray = new Array;
  dpmanaging = JSON.parse(scriptProperties.getProperty("dpmanaging"))
  dpmanaging.forEach(function(value) {
    if (value[0]!=e.parameters.formid) newarray.push(value);});
  scriptProperties.setProperty("dpmanaging", JSON.stringify(newarray));
  return doodlePoll(e)
}
