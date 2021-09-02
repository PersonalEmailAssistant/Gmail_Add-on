function snoozeTimer(email){
  var thread = GmailApp.getThreadById(email.gmail.threadId);
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
  scriptProperties.setProperty(id, email.gmail.messageId);

  // check if the user has entered additional recipients to recieve snoozed email
  if (email.formInput.snoozerecipients!=undefined) scriptProperties.setProperty(id+"additional", email.formInput.snoozerecipients);
  else scriptProperties.setProperty(id+"additional", "");

  // move email out of inbox
  GmailApp.moveThreadToArchive(thread);
  GmailApp.refreshThread(thread);
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
  message.getThread().moveToTrash();
  
  
  // gets the current user's email address
  var emailAddress = Session.getActiveUser().getEmail();

  // check if there are additional recipients to forward to
  var additionalrecipients = scriptProperties.getProperty(triggerId+"additional");
  if (additionalrecipients != "") emailAddress+=","+additionalrecipients;

  // forwards the message to addresses
  message.forward(emailAddress);

  // remove label from original email and move to trash
  var label = GmailApp.getUserLabelByName("Snoozed");
  message.getThread().removeLabel(label);
}


function buttonSnoozeTimeChange(e, hours){
  snoozeUntil = new Date(now.getTime()+hours*3600000);
  console.log(snoozeUntil);
  snoozeTimer(e);
}
/**
 * Actions for the Snooze Quick Button widgets. Each calls the buttonSnoozeTimeChange
 * function, with the amount of hours
 */
function twoHoursSnooze(e){ buttonSnoozeTimeChange(e, 2);}
function tomorrowSnooze(e){ buttonSnoozeTimeChange(e, 24);}
function nextWeekSnooze(e){ buttonSnoozeTimeChange(e, 24*7);}
