/**
 * currently: retrieves email subject and body, sends email from current account with this info
 * todo:
 *  - allow the user to select how long until the email comes back
 *  - include the original sender's email address (perhaps the email should be forwarded rather than a new one sent)
 *  - once email has been scheduled to sent, the original email should be deleted
 */
function snoozeTimer(email){
  // calculate time to resent email
  var time = new Date(); //current date
  time = time.getTime() + 300000; // adds 5 minutes in milliseconds
  var time = new Date(time);
  console.log(time)

  // set a time based trigger 
  var trigger = ScriptApp.newTrigger('sendEmails')
  .timeBased()
  .at(time)
  .create();

  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(id, email);
  console.log(scriptProperties.getProperty(id));
}


function sendEmails(e) {
  var triggerId = e.triggerUid;
  var email = scriptProperties.getProperty(triggerId);
  console.log(email)

  var message = GmailApp.getMessageById(email.gmail.messageId);
  var emailAddress = Session.getActiveUser().getEmail();
  var subject = message.getSubject();
  var body = message.getBody();

  MailApp.sendEmail(emailAddress, subject, body);
}