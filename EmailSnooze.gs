var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours
GmailApp.createLabel("Snoozed"); // creates gmail folder 

/**
 * Callback for rendering the snooze email card
 *  Card allows users to select time to snooze current email until 
 *  and include additional recipients to recieve email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function snoozeEmailCard(e) {
  // check if user has entered a datetime
  // if so set snoozeUntil to time, else is default of now + 2 hours
  if (e.formInput.date_field != undefined){
    snoozeUntil = new Date(e.formInput.date_field.msSinceEpoch);
  }

  // Button Actions
  // action calls snoozeTimer to create a time-based trigger
  var action = CardService.newAction()
      .setFunctionName('snoozeTimer')
      .setParameters({id: e.messageMetadata.messageId});
  // noaction call empty function and returns to snoozeEmailCard (for invalid user input)
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

  // create section to display widgets
  var section = CardService.newCardSection()
    .setHeader("Snooze Email")
    .addWidget(snoozeQuickButtons())
    .addWidget(snoozeDateTimePicker());

  // check that date/time input is not in the past
  var btnSet = CardService.newButtonSet();
  if (now.getTime() > snoozeUntil.getTime()) { 
    // date/time invalid so button set to have no action
    section.addWidget(btnSet.addButton(invalidButton));
  } else {
    section.addWidget(btnSet.addButton(snoozeButton));
  }

  section.addWidget(snoozeAddRecipients(e.formInput.snoozerecipients));
  section.addWidget(emailSnoozeRecipientGroupsButtons());
  section.addWidget(getManangeCustomButtons());

  // add section to card and build display
  var card = CardService.newCardBuilder().addSection(section);
  return CardService.newNavigation().updateCard(card.build());

}


/**
 * Callback for creating the Snooze Quick Button widgets. Each button is a quick
 * shortcut to common snooze times
 * @return {CardService.Card} The button set containing each Snooze Quick Button
 */
function snoozeQuickButtons() {
  var quicksnoozetimes = getPropertyquicksnooze();

  var snoozeButtonSet = CardService.newButtonSet();

  quicksnoozetimes.forEach(function(value) {
    console.log(value[1]);
    var savedaction = CardService.newAction()
    .setFunctionName('quickSnoozeButtons')
    .setParameters({hours:value[1]});
    var mapButton = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(savedaction);
    snoozeButtonSet.addButton(mapButton);
  });

  return snoozeButtonSet;
}

/**
 * Callback for creating the Snooze Date Picker widget.
 * @return {CardService.Card} The Date Picker widget
 */
function snoozeDateTimePicker() {
  var snoozeDateTimePicker = CardService.newDateTimePicker()
    .setTitle("Enter the date to snooze until.")
    .setFieldName("date_field")
    .setValueInMsSinceEpoch(snoozeUntil.getTime())
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("snoozeEmailCard"));

  return snoozeDateTimePicker;
}

function snoozeAddRecipients(recipients){
  console.log(recipients)
  checkPropertySelectedSnoozeRecipients();
  var scriptProperties = PropertiesService.getUserProperties();
  var selectedrecipients = scriptProperties.getProperty("selectedrecipients");
  if (recipients != null){
    if (recipients.includes(selectedrecipients)) selectedrecipients = recipients
    else selectedrecipients = recipients + selectedrecipients
  } 
  var addrecipients = CardService.newTextInput()
    .setFieldName("snoozerecipients")
    .setTitle("Include Additional Recipients")
    .setMultiline(true)
    .setValue(selectedrecipients);
  return addrecipients;
}

function snoozeTimer(e){
  var thread = GmailApp.getThreadById(e.gmail.threadId);
  var label = GmailApp.getUserLabelByName("Snoozed");
  thread.addLabel(label);

  // set a time based trigger
  var trigger = ScriptApp.newTrigger('forwardEmail')
    .timeBased()
    .after(snoozeUntil.getTime()-now.getTime()) // time in milliseconds
    .create();

  // stores email information so that it can be used by forwardEmail later
  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("selectedrecipients", " ");
  scriptProperties.setProperty(id, e.gmail.messageId);

  // check if the user has entered additional recipients to recieve snoozed email
  if (e.formInput.snoozerecipients!=undefined) scriptProperties.setProperty(id+"additional", e.formInput.snoozerecipients);
  else scriptProperties.setProperty(id+"additional", "");

  // move email out of inbox
  GmailApp.moveThreadToArchive(thread);
  GmailApp.refreshThread(thread);
  return onGmailMessageSelected(e);
}

/**
 * Action for the Invalid Time Snooze Button. Left as empty as there should be no action for the button,
 * as it is only visible when an invalid time is selected
 */
function noAction() {}


function forwardEmail(e) {
  // retrieves the email information
  var triggerId = e.triggerUid;
  var scriptProperties = PropertiesService.getScriptProperties();
  var email = scriptProperties.getProperty(triggerId);
  var message = GmailApp.getMessageById(email);
  var thread =  message.getThread();
  var label = GmailApp.getUserLabelByName("Snoozed");
  console.log(thread.getLabels());

  // only forwards email if it is found in the Snooze folder
  if (thread.getLabels().includes(label)){
    // gets the current user's email address
    var emailAddress = Session.getActiveUser().getEmail();

    // check if there are additional recipients to forward to
    var additionalrecipients = scriptProperties.getProperty(triggerId+"additional");
    if (additionalrecipients != "") emailAddress+=","+additionalrecipients;

    // forwards the message to addresses
    message.forward(emailAddress);

    // remove label from original email and move to trash
    thread.removeLabel(label);
    //thread.moveToTrash();
  }
}


function buttonSnoozeTimeChange(e, hours){
  console.log(hours);
  snoozeUntil = new Date(now.getTime()+hours*3600000);
  console.log(snoozeUntil);
  return snoozeTimer(e);
}
/**
 * Actions for the Snooze Quick Button widgets. Each calls the buttonSnoozeTimeChange
 * function, with the amount of hours
 */
function quickSnoozeButtons(e){return buttonSnoozeTimeChange(e, +e.parameters.hours);}
