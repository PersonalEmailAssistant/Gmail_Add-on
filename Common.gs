function onHomepage(e) {
  // add button that sends an email
  var action = CardService.newAction()
      .setFunctionName('sendEmails')
  var button = CardService.newTextButton()
      .setText('Send Email')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .addSection(section)

  return card.build();
}
