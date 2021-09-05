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
  return updateCard(e)
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
  snoozeTimer(e);
}
/**
 * Actions for the Snooze Quick Button widgets. Each calls the buttonSnoozeTimeChange
 * function, with the amount of hours
 */
function quickSnoozeButtons(e){buttonSnoozeTimeChange(e, +e.parameters.hours);}

function addNewQuickButton(e){
  checkPropertyquicksnooze();
  var scriptProperties = PropertiesService.getUserProperties();
  var quicksnoozebuttons = JSON.parse(scriptProperties.getProperty("quicksnooze"));
  var buttonname = e.formInput.addquickbuttoninput + " Hours"
  quicksnoozebuttons.push([buttonname, ""+e.formInput.addquickbuttoninput]);
  scriptProperties.setProperty("quicksnooze", JSON.stringify(quicksnoozebuttons));
  return updateCard(e)
}
