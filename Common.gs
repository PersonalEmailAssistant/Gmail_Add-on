var now = new Date();
var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours
GmailApp.createLabel("Snoozed");

/**
 * Callback for what is seen when viewing the Homepage. Left as empty as there should be no action for viewing
 * the Homepage. We should only view the add-on when an e-mail is selected.
 */
function onHomepage(e) { 
  var scriptProperties = PropertiesService.getUserProperties(); // PropertiesService should allow for long-term storage
  if(scriptProperties.getProperty("map")==null){
    var defaultsavedlocations = [["UWA", "-31.981179,115.819910"]]
    // map stores all saved locations
    scriptProperties.setProperty("map", JSON.stringify(defaultsavedlocations));
    // mapselect is used to set the default values of map link
    scriptProperties.setProperty("mapselected", JSON.stringify(["",""]));
  }
}


/**
 * Callback for rendering the card for a specific Gmail message. Only visable after the user has selected an email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e){

  var action = CardService.newAction()
    .setFunctionName('snoozeTimer')
    .setParameters({id: e.messageMetadata.messageId});
  var snoozeButton = CardService.newTextButton()
    .setText('Snooze Email')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);

  // Card Section for Snooze components, each add widget calls a function that creates the widget
  var snoozeSection = CardService.newCardSection()
    .setHeader("Snooze Email")
    .addWidget(snoozeQuickButtons())
    .addWidget(snoozeDatePicker())
    .addWidget(snoozeTimePicker())
    .addWidget(CardService.newButtonSet().addButton(snoozeButton))
    .addWidget(snoozeAddRecipients());

  // Card which includes the Snooze components only
  var card = CardService.newCardBuilder()
    .addSection(snoozeSection);

  return card.build();
}

/**
 * Callback for rendering the card for a specific Gmail message. Only visable after the user has selected an email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function updateCard(e) {

  var selectedSnoozeTime = e.formInput.date_field.msSinceEpoch;
  selectedSnoozeTime += (e.formInput.time_field.hours-8) * 3600000;
  selectedSnoozeTime += e.formInput.time_field.minutes * 60000;
  snoozeUntil = new Date(selectedSnoozeTime);

  // Button Actions
  var action = CardService.newAction()
      .setFunctionName('snoozeTimer')
      .setParameters({id: e.messageMetadata.messageId});
  var noAction = CardService.newAction()
      .setFunctionName('noAction');

  // Button Renders
  var snoozeButton = CardService.newTextButton()
    .setText('Snooze Email')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);
  var invalidButton = CardService.newTextButton()
    .setText('Enter Valid Time')
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    .setOnClickAction(noAction);

  var btnSet = CardService.newButtonSet();
  var section = CardService.newCardSection()
    .setHeader("Snooze Email")
    .addWidget(snoozeQuickButtons())
    .addWidget(snoozeDatePicker())
    .addWidget(snoozeTimePicker());

  if (now.getTime() > snoozeUntil.getTime()) {
    section.addWidget(btnSet.addButton(invalidButton));
  } else {
    section.addWidget(btnSet.addButton(snoozeButton));
  }

  section.addWidget(snoozeAddRecipients());

  var card = CardService.newCardBuilder()
    .addSection(section);

  return CardService.newNavigation().updateCard(card.build());

}


//------------------------------- SNOOZE WIDGETS -------------------------------------

/**
 * Callback for creating the Snooze Quick Button widgets. Each button is a quick
 * shortcut to common snooze times
 * @return {CardService.Card} The button set containing each Snooze Quick Button
 */
function snoozeQuickButtons() {

  // Create actions for each button
  var twohoursaction = CardService.newAction().setFunctionName('twoHoursSnooze');
  var tomorrowaction = CardService.newAction().setFunctionName('tomorrowSnooze');
  var nextweekaction = CardService.newAction().setFunctionName('nextWeekSnooze');

  // Create the buttons
  var twohoursbutton = CardService.newTextButton()
      .setText('Two Hours')
      .setOnClickAction(twohoursaction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var tomorrowbutton = CardService.newTextButton()
      .setText('Tomorrow')
      .setOnClickAction(tomorrowaction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var nextweekbutton = CardService.newTextButton()
      .setText('Next Week')
      .setOnClickAction(nextweekaction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  // Create the button set
  var snoozeButtonSet = CardService.newButtonSet()
      .addButton(twohoursbutton)
      .addButton(tomorrowbutton)
      .addButton(nextweekbutton);

  return snoozeButtonSet;
}

/**
 * Callback for creating the Snooze Date Picker widget.
 * @return {CardService.Card} The Date Picker widget
 */
function snoozeDatePicker() {

  var snoozeDatePicker = CardService.newDatePicker()
    .setTitle("Enter the date to snooze until.")
    .setFieldName("date_field")
    .setValueInMsSinceEpoch(snoozeUntil.getTime()+(8*3600000)) // its ugly but it works
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateCard"));

  return snoozeDatePicker;
}

/**
 * Callback for creating the Snooze Time Picker widget.
 * @return {CardService.Card} The Time Picker widget
 */
function snoozeTimePicker() {

  var snoozeTimePicker = CardService.newTimePicker()
    .setFieldName("time_field")
    .setHours(snoozeUntil.getHours())
    .setMinutes(snoozeUntil.getMinutes())
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateCard"));

  return snoozeTimePicker;
}

function snoozeAddRecipients(){
    var addrecipients = CardService.newTextInput()
    .setFieldName("snoozerecipients")
    .setTitle("Include Additional Recipients")
    .setValue("");
  return addrecipients;
}
