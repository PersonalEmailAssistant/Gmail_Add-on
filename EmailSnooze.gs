/**
 * currently:
 *  sets a timer 
 *  removes email from inbox
 *  once timer is up, forwards the email
 * 
 * to do:
 *  - as well as the specific date/time picker, i think it would be valuble to have set buttons for 
 *      tomorrow, 1 week, ect. like gmail snooze and followupthen have
 *  - it would be good if the user could view the emails that are currently snoozing 
 *        (i think this could be done by adding labels) 
 */

function snoozeTimer(email){
  // set a time based trigger 
  var trigger = ScriptApp.newTrigger('forwardEmail')
  .timeBased()
  .after(snoozeUntil.getTime()-now.getTime()) // time in milliseconds
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

// called when the user changes the time or date picker
// gets values from time and date picker to update snoozeUntil 
function snoozeTimeChange(e){
  var selectedSnoozeTime = e.formInput.date_field.msSinceEpoch;
  selectedSnoozeTime += (e.formInput.time_field.hours-8) * 3600000 
  selectedSnoozeTime += e.formInput.time_field.minutes * 60000;
  snoozeUntil = new Date(selectedSnoozeTime);
  console.log(snoozeUntil)
}

function buttonSnoozeTimeChange(e, hours){
  snoozeUntil = new Date(now.getTime()+hours*3600000);
  console.log(snoozeUntil);
  snoozeTimer(e);
}

function twoHoursSnooze(e){ buttonSnoozeTimeChange(e, 2);}
function tomorrowSnooze(e){ buttonSnoozeTimeChange(e, 24);}
function nextWeekSnooze(e){ buttonSnoozeTimeChange(e, 24*7);}
function twoWeeksSnooze(e){ buttonSnoozeTimeChange(e, 24*14);}
