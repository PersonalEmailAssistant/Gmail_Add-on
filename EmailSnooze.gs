/**
 * currently: retrieves email subject and body, sends email from current account with this info
 * to do:
 *  - allow the user to select how long until the email comes back
 *  - include the original sender's email address (perhaps the email should be forwarded rather than a new one sent)
 *  - once email has been scheduled to send, the original email should be deleted
 */
function snoozeTimer(email){
  // set a time based trigger 
  var trigger = ScriptApp.newTrigger('sendEmails')
  .timeBased()
  .after(30000) // time in milliseconds
  .create();

  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(id, email.gmail.messageId);
}


function sendEmails(e) {
  var triggerId = e.triggerUid;
  var scriptProperties = PropertiesService.getScriptProperties();
  var email = scriptProperties.getProperty(triggerId);

  var message = GmailApp.getMessageById(email);
  var emailAddress = Session.getActiveUser().getEmail();
  var subject = message.getSubject();
  var body = message.getBody();

  MailApp.sendEmail(emailAddress, subject, body);
}
