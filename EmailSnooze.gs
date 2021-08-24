/**
 * currently: retrieves email subject and body, sends email from current account with this info
 * todo:
 *  - allow the user to select how long until the email comes back
 *  - include the original sender's email (perhaps the email should be forwarded rather than a new one sent)
 */
function sendEmails(email) {
  message = GmailApp.getMessageById(email.gmail.messageId);
  emailAddress = Session.getActiveUser().getEmail();
  subject = message.getSubject();
  body = message.getBody();

  MailApp.sendEmail(emailAddress, subject, body);
}
