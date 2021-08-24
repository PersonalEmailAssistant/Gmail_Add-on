/**
 * currently:
 *  moves the email out of inbox
 *  sets a timer to trigger, for now the time is pre-defined
 *  during snooze period, the email can be viewed in the "snooze" labelled folder
 *        (this is different to the folder it goes to when you use the actual gmail snooze button.
 *            ideally, it would go there but i don't know if that is possible)
 *  after timer finishes, the email is returned to the inbox and snooze label is removed
 * 
 * to do:
 *  it would be good if there was a way to see how long the email is snoozed for - i thought about doing this 
 *      by adding another label but then it creates an another new folder and that would get messy
 *  one huge problem - the email doesn't go to the top of the inbox because the sent date has not changed
 *  find out if there is a way for app script call the snooze function - this would solve all problems
 *      (feels a bit like we are reinventing the wheel, the button is literally already there :<)
 */

function snoozeTimer(email){
  // set a time based trigger 
  var trigger = ScriptApp.newTrigger('unsnoozeEmail')
  .timeBased()
  .after(30000) // time in milliseconds
  .create();

  label = GmailApp.createLabel("Snooze");
  var thread = GmailApp.getThreadById(email.gmail.threadId);
  thread.addLabel(label);
  thread.moveToArchive(); // move out of inbox

  var id = trigger.getUniqueId();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(id, email.gmail.threadId);
}

function unsnoozeEmail(e){
  var triggerId = e.triggerUid;
  var scriptProperties = PropertiesService.getScriptProperties();
  var threadId = scriptProperties.getProperty(triggerId);
  var thread = GmailApp.getThreadById(threadId);

  label = thread.getLabels();
  thread.removeLabel(label[0]);
  thread.moveToInbox();
}
