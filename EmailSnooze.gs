/**
 * attempt to send a predefined email when a button is pushed 
 */
function sendEmails() {
  // for now i have set these, later they will be found from the current email
  emailAddress = "22721679@student.uwa.edu.au"; // my email address
  subject = "test email";
  message = "this is a test email sent";
  MailApp.sendEmail(emailAddress, subject, message);

}
// [END apps_script_gmail_send_emails]

var EMAIL_SENT = 'EMAIL_SENT';
