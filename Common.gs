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
      // Set default value as today's date
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("dateTimeChange"))

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(buttonSet);
      .addWidget(dateTimePicker);
  var card = CardService.newCardBuilder()
      .addSection(section)

  return card.build();
}
