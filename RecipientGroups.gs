/**
 * Recipient groups allows the user to store strings containing a group of recipient emails
  * e.g [["my friends", "email1@gmail.com, email2@gmail.com, email3@gmail.com"], ["my team", email4@gmail.com, email5@gmail.com"]]
 * This will be used during the snooze function to shortcut snoozing to a group of recipients 
 * If the user is composing an email, it will add the recipient group's emails to the "To:" line
 * 
 * Currently
 * - there is no way to add or remove recipient groups (for now i have added my email addresses)
 * - functionality for composing emails has not been added yet
 */

function addNewRecipientGroupsCard(){}

function emailSnoozeRecipientGroupsButtons(){
  var scriptProperties = PropertiesService.getUserProperties();
  checkPropertyrecipientgroups();
  var recipientgroups = JSON.parse(scriptProperties.getProperty("recipientgroups"));
  var buttonset = CardService.newButtonSet();

  recipientgroups.forEach(function(value) {
    console.log(value[1]);
    var savedaction = CardService.newAction()
    .setFunctionName('emailSnoozeRecipientGroupsAction')
    .setParameters({label:value[0], recipients:value[1]});
    var button = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#71c0eb")
      .setOnClickAction(savedaction);
    buttonset.addButton(button);
  });

  return buttonset;
}

function emailSnoozeRecipientGroupsAction(e){
  var scriptProperties = PropertiesService.getUserProperties();
  checkPropertySelectedSnoozeRecipients()
  scriptProperties.setProperty("selectedrecipients", e.parameters.recipients);
  return updateCard(e)
}
function composeEmailRecipientGroupsCard(){}
function composeEmailRecipientGroupsAction(){}