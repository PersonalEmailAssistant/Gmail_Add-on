
   
//------------------------------- EMAIL SNOOZE FUNCTIONS -------------------------------------
/** 
 * EMAIL SNOOZE:
 * Snoozing emails temporarily removes them from the inbox and, after a set period of time,
 * returns them to the top of the inbox
 * This allows users to manage their inbox by reminding them to follow up on emails that they may not
 * initially have time to repond to at a set later date
 */

var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours
GmailApp.createLabel("Snoozed"); // creates gmail folder 

/**
 * Callback for rendering the snooze email card
 * Display allows users to select time to snooze current email until and include additional recipients to recieve email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function snoozeEmailCard(e) {
  // check if user has entered a datetime
  // if so set snoozeUntil to time, else is default of now + 2 hours
  if (e.formInput.date_field != undefined){
    snoozeUntil = new Date(e.formInput.date_field.msSinceEpoch);
  }

  // text widgets to provide desciptions and instructions
  var descriptiontxt = CardService.newTextParagraph()
    .setText("Snoozing emails temporarily removes them from the inbox and, after a set period of time, returns them to the top of the inbox. \n\nClick a time to snooze email: ");
  var explanationtxt = CardService.newTextParagraph()
    .setText("\nOr choose your own time below: ")
  var recipienttxt = CardService.newTextParagraph()
    .setText("\n(Optional) Include additional recipients: ")

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
    .addWidget(descriptiontxt)
    .addWidget(snoozeQuickButtons())
    .addWidget(explanationtxt)
    .addWidget(snoozeDateTimePicker());

  // check that date/time input is not in the past
  var btnSet = CardService.newButtonSet();
  if (now.getTime() > snoozeUntil.getTime()) { 
    // date/time invalid so button set to have no action
    section.addWidget(btnSet.addButton(invalidButton));
  } else {
    section.addWidget(btnSet.addButton(snoozeButton));
  }
  section.addWidget(recipienttxt)
    .addWidget(snoozeAddRecipients(e))
    .addWidget(emailSnoozeRecipientGroupsButtons())
    .addWidget(getManangeCustomButtons())
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(6);

  // send response email
  var responsetxt = CardService.newTextParagraph()
    .setText("(Optional) Send reply email to let them know you will get back to them:");
  var responseupdateaction = CardService.newAction()
      .setFunctionName('updateResponseField');
  var responseaction = CardService.newAction()
      .setFunctionName('sendSnoozeResponseEmail');
  responseemailbody = getPropertySnoozeResponseEmail();
  var responseinput = CardService.newTextInput()
    .setFieldName("responseinput")
    .setTitle("Email body")
    .setMultiline(true)
    .setValue(responseemailbody)
    .setOnChangeAction(responseupdateaction);

  sendreplyoption = switchDecoratedText  = CardService.newDecoratedText()
  .setText("(Optional) Send reply email to let them know you will get back to them:")
  .setWrapText(true)
  .setSwitchControl(CardService.newSwitch()
      .setFieldName("sendreplyemail")
      .setValue(true));
      //.setOnChangeAction(CardService.newAction()
      //    .setFunctionName("handleSwitchChange")));

  var section2 = CardService.newCardSection()
    .addWidget(sendreplyoption)
    .addWidget(responseinput);
  
  var footer = buildPreviousAndRootButtonSet();
  var card = CardService.newCardBuilder()
  .setFixedFooter(footer)
  .addSection(section)
  .addSection(section2);
  return card.build();
}

function updateResponseField(e){
  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("snoozeresponseemail", e.formInput.responseinput);
}

function sendSnoozeResponseEmail(e){
  console.log(e)
  updateResponseField(e)
  MailApp.sendEmail({
    to: "recipient@example.com",
    subject: "Logos",
    htmlBody: e.formInput.responseinput,
  });
}

/**
 * Callback for creating the Snooze Quick Button widgets. Each button is a quick
 * shortcut to common snooze times
 * @return {CardService.Card} The button set containing each Snooze Quick Button
 */
function snoozeQuickButtons() {
  // recieve saved quick snooze times from PropertiesService
  var quicksnoozetimes = getPropertyquicksnooze();

  // creates a button for each time saved to call clickQuickSnoozeButtons with respective parameter
  var snoozeButtonSet = CardService.newButtonSet();
  // loop through quicksnoozetimes: value[0] = (string) name, value[1] = (int) hours
  quicksnoozetimes.forEach(function(value) { // for each time saved
    // sets parameter for clickQuickSnoozeButtons() to time's hours
    var savedaction = CardService.newAction()
      .setFunctionName('clickQuickSnoozeButtons')
      .setParameters({hours:value[1]});
    // create a button for that time
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(savedaction);
    snoozeButtonSet.addButton(button);
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

/**
 * Callback for updating the additional snooze recipient input box
 * When snoozeEmailCard is called after user changes time picker date the card refreshes
 * This function sets default value of snoozerecipients to be the previous input to ensure 
 *  the user input is not reset each time
 * @return {CardService.Card} The TextInput widget
 */
function snoozeAddRecipients(e){
  console.log(e)
  recipients = e.formInput.snoozerecipients
  if (recipients == undefined) recipients = ""
  var scriptProperties = PropertiesService.getUserProperties();
  selectedrecipients = getPropertySelectedSnoozeRecipients();
  if (selectedrecipients != "") recipients += selectedrecipients
  scriptProperties.setProperty("selectedrecipients", "");
  var addrecipients = CardService.newTextInput()
    .setFieldName("snoozerecipients")
    .setTitle("Enter comma separated email addresses")
    .setMultiline(true)
    .setValue(recipients);
  return addrecipients;
}

/**
 * Callback creates a time-based trigger to forward current email and moves
 * current email out of inbox into snoozed folder
 * @return {CardService.Card} onGmailMessageSelected (goes back to homepage)
 */
function snoozeTimer(e, date){
  console.log("snooze timer")
  snoozeUntil = new Date(e.formInput.date_field.msSinceEpoch)
  if (date != undefined){ snoozeUntil = date }
  // get thread and add it to snoozed folder
  var thread = GmailApp.getThreadById(e.gmail.threadId);
  var label = GmailApp.getUserLabelByName("Snoozed");
  thread.addLabel(label);

  // set a time based trigger to forward email
  var trigger = ScriptApp.newTrigger('forwardEmail')
    .timeBased()
    .after(snoozeUntil.getTime()-now.getTime()) // time in milliseconds
    .create();

  // stores email information so that it can be used by forwardEmail later and clears selectedrecipients
  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("selectedrecipients", "");
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

/**
 * Called by time-based trigger
 * Retrieves the email thread associated the with trigger
 * if the email has not been moved to the inbox, it forwards the email
 * to the current user's email address and any additional recipients
 */
function forwardEmail(e) {
  // retrieves the email information
  var triggerId = e.triggerUid;
  var scriptProperties = PropertiesService.getScriptProperties();
  var email = scriptProperties.getProperty(triggerId);
  var message = GmailApp.getMessageById(email);
  var thread =  message.getThread();
  var label = GmailApp.getUserLabelByName("Snoozed");

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
  }
}

/**
 * Called by the user through clicking the quicktime buttons. 
 * Updates global variable snoozeUntil with the user input's time
 * then calls snooze timer to set time-based trigger
 */
function clickQuickSnoozeButtons(e){
  // 3600000 converts hours to milliseconds
  //snoozeUntil = new Date(now.getTime()+(e.parameters.hours*3600000));
  return snoozeTimer(e, new Date(now.getTime()+(e.parameters.hours*3600000)));
}


//------------------------------- RECIPIENT GROUPS FUNCTIONS -------------------------------------
/**
 * Recipient groups allows the user to store strings containing a group of recipient emails
  * e.g [["my friends", "email1@gmail.com, email2@gmail.com, email3@gmail.com"], ["my team", email4@gmail.com, email5@gmail.com"]]
 * This will be used during the snooze function to shortcut snoozing to a group of recipients 
 */

/**
 * Callback creates buttonset containing one button for each group
 * @return {CardService.Card} The buttonset widget
 */
function emailSnoozeRecipientGroupsButtons(){
  // retrieve stored recipientgroups from PropertiesService
  var recipientgroups = getPropertyrecipientgroups();

  // if they do not have any recipient groups, return explanation paragraph
  if (recipientgroups.length == 0) {
    return CardService.newTextParagraph()
    .setText("\nCreate custom quick buttons below:")
  }

  // create button set containing one button for each group
  var buttonset = CardService.newButtonSet();
  // loop through each group: value[0] = (string) name, value[1] = (string) comma separated addresses
  recipientgroups.forEach(function(value) {
    // create an action with group's respective parameters
    var savedaction = CardService.newAction()
    .setFunctionName('emailSnoozeRecipientGroupsAction')
    .setParameters({label:value[0], recipients:value[1]});
    // create button
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#71c0eb")
      .setOnClickAction(savedaction);
    // add button to buttonset
    buttonset.addButton(button);
  });
  return buttonset;
}

/**
 * Callback adds the recipient email string to the "include additional recipients" input box
 * @return {CardService.Card} snoozeEmailCard() (to update display)
 */
function emailSnoozeRecipientGroupsAction(e){
  if (e.parameters.recipients == undefined) return;
  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("selectedrecipients", e.parameters.recipients);
  console.log("selected snooze recipients");
  console.log(e.parameters.recipients);
  return snoozeEmailCard(e)
}
