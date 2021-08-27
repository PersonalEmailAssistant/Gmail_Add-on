var now = new Date();
var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours


function onHomepage(e) {

}

// useful link for getting info from gmail:
  // https://developers.google.com/apps-script/reference/gmail/gmail-app
  // https://developers.google.com/apps-script/reference/gmail/gmail-message


// only visable after the user has selected an email
function onGmailMessage(e){
  console.log(e.messageMetadata.messageId)
    // add button that sends an email
  var action = CardService.newAction()
      .setFunctionName('snoozeTimer')
      .setParameters({id: e.messageMetadata.messageId});
  var button = CardService.newTextButton()
      .setText('Snooze Email')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Add date picker
  var dateTimePicker = CardService.newDatePicker()
      .setTitle("Enter the date to snooze until.")
      .setFieldName("date_field")
      .setValueInMsSinceEpoch(snoozeUntil.getTime())
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("snoozeTimeChange"))
  // add time picker // for hours and minutes
  var timeTimePicker = CardService.newTimePicker()
      .setFieldName("time_field")
      .setHours(snoozeUntil.getHours())
      .setMinutes(0)
      .setOnChangeAction(CardService.newAction()
        .setFunctionName("snoozeTimeChange"))

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .setHeader("Section header")
      .addWidget(buttonSet)
      .addWidget(dateTimePicker)
      .addWidget(timeTimePicker);
  var card = CardService.newCardBuilder()
      .addSection(section)

  return card.build();
}
