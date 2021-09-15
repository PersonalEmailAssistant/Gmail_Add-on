// Begin by building the root card with 1st section 'General Info'.
function doodlePoll(e) {
  var card = CardService.newCardBuilder()
    .addSection(generalInfoSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

// -----------------------------------------------------------------------------------
// -------------------------- DOODLE POLL GLOBAL VARIABLES ---------------------------
// -----------------------------------------------------------------------------------

// Section 1
var titleDPvar;
var notesDPvar;
var locationDPvar = "TBC"; // Default value of To Be Confirmed
var otherLocationDPvar;

// Section 2
//var numTextOptions = 2;

// Section 3
//var switchNotIdealvar;
//var switchLimitVotesvar;
//var switchSingleVote;
//var switchHidden;

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
    .addWidget(notesDP())
    .addWidget(locationDP());

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
    .addWidget(nextButtonDP3()); //https://developers.google.com/apps-script/reference/card-service/switch

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
    .setText("What's the Occasion?");

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
    .setTitle("Title of Doodle Poll")
    .setHint("Required")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  if (titleDPvar != null) {
    titleDP.setValue(titleDPvar)
  }

  return titleDP;
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

function locationDP(e) {

 var locationDP = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("locationDPvalue")
    .setTitle("Location")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('GeneralInfoCardUpdateDP'));

  checkPropertyDoodlePoll();
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


// -------------------------- SECTION 2 - schedulingSection ------------------------


function schedulingButtons(e) {

  // Create the buttons
  var schedulingMonthButton = CardService.newTextButton()
      .setText('Month')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('monthScheduleUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var schedulingWeekButton = CardService.newTextButton()
      .setText('Week')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('weekScheduleUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var schedulingTextButton = CardService.newTextButton()
      .setText('Text')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('textScheduleUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  `// Create the button set`
  var schedulingButtonSet = CardService.newButtonSet()
    .addButton(schedulingMonthButton)
    .addButton(schedulingWeekButton)
    .addButton(schedulingTextButton);

  return schedulingButtonSet;
}

// TEXT OPTIONS

function textOptionDP(e) {
  var textOption = CardService.newTextInput()
    .setFieldName("textOption1DPvalue")
    .setTitle("Option")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('addTextOption'));

  return textOption;
}
/*
function textOption2DP(e) {
  var textOption1DP = CardService.newTextInput()
    .setFieldName("textOption2DPvalue")
    .setTitle("2")
    .setHint("Add Option")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('checkTextOptions'));

  return textOption1DP;
}
*/

function addTextOptionButtonDP(e) {

  var addTextOptionButton = CardService.newTextButton()
      .setText('Add Option')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('addTextOptionUpdateDP'))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  return CardService.newButtonSet().addButton(addTextOptionButton);
}

// -------------------------- SECTION 3 - pollSettingSection -------------------------


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
    .setText("Participants’ names, comments and votes are confidential. Only you can see the results.")
    .setWrapText(true)
    .setSwitchControl(CardService.newSwitch()
      .setFieldName("switchHiddenKey")
      .setValue("switchHiddenValue"));

  return switchHidden;
}



// -----------------------------------------------------------------------------------
// ------------------------------ DOODLE POLL FUNCTIONS ------------------------------
// -----------------------------------------------------------------------------------

// Function runs on any updates to the general info section, excluding the optional notesDP value
function GeneralInfoCardUpdateDP(e) {

  // Update global variables
  titleDPvar = e.formInput.titleDPvalue;
  notesDPvar = e.formInput.notesDPvalue;
  locationDPvar = e.formInput.locationDPvalue;
  otherLocationDPvar = e.formInput.otherLocationDPvalue;

  var updatedSection = generalInfoSection();

  // If other location has been selected, add an "Other Location" input field
  if(e.formInput.locationDPvalue == "Other") {
    updatedSection.addWidget(otherLocationDP());
  }

  // If a title has been entered, add a "Next" button
  if (e.formInput.titleDPvalue != null) {
    updatedSection.addWidget(nextButtonDP1());
  }

  // Update with a child card
  var card = CardService.newCardBuilder()
    .addSection(updatedSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}


// Function runs on any updates to the Text Scheduling section
function monthScheduleUpdateDP(e) {
  // TO FILL IN
}


// Function runs on any updates to the Text Scheduling section
function weekScheduleUpdateDP(e) {
  var calendarEventActionResponse = CardService.newCalendarEventActionResponseBuilder()
    .addAttendees(["user1@example.com", "user2@example.com"])
    .build();

    return calendarEventActionResponse
}


// Function runs on any updates to the Text Scheduling section
function textScheduleUpdateDP(e) {

  var textScheduleSection = CardService.newCardSection()
    .addWidget(textOptionDP())
    .addWidget(textOptionDP())
    .addWidget(addTextOptionButtonDP());

  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .addSection(textScheduleSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function addTextOptionUpdateDP(e){
   // TO FILL IN
}

function checkTextOptions(e) {

  if (e.formInput.textOption1DPvalue != null) {
    updatedSection.addWidget(nextButtonDP2());
  }

  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .addSection(updatedSection)
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}


// ------------------------------- SECTION CHANGERS -----------------------------------

function ontoSection3 (e) {

  var card = CardService.newCardBuilder()
    .addSection(schedulingSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function ontoSection2 (e) {

  var card = CardService.newCardBuilder()
    .addSection(pollSettingsSection())
    .setFixedFooter(buildPreviousAndRootButtonSet());

  return CardService.newNavigation().updateCard(card.build());
}

function completePoll (e) {

  // TO FILL IN

}
