/**
 * currently:
 *  sets a timer (fixed amount of time for now)
 *  removes email from inbox
 *  once timer is up, forwards the email
 * 
 * to do:
 *  - user should be able to select how long they want the email to snooze for
 *  - it would be good if the user could view the emails that are currently snoozing 
 *        (i think this could be done by adding labels) 
 */

function snoozeTimer(email){
  // set a time based trigger 
  var trigger = ScriptApp.newTrigger('forwardEmail')
  .timeBased()
  .after(30000) // time in milliseconds
  .create();

  // stores email information so that it can be used by forwardEmail later
  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(id, email.gmail.messageId);

  // move email out of inbox into trash
  var thread = GmailApp.getThreadById(email.gmail.threadId);
  GmailApp.moveThreadToTrash(thread);
}

function forwardEmail(e) {
  // retrieves the email information
  var triggerId = e.triggerUid;
  var scriptProperties = PropertiesService.getScriptProperties();
  var email = scriptProperties.getProperty(triggerId);
  var message = GmailApp.getMessageById(email);
  
  // gets the current user's email address
  var emailAddress = Session.getActiveUser().getEmail();
  
  // forwards the message to current user
  message.forward(emailAddress);
}
