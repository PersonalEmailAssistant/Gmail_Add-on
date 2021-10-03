var _ = LodashGS.load();

/**
 * Callback for personalized info.
 * @return the different message to show to the user depend on the time.
 */
function messageChooser(e) {
  var hour = Number(Utilities.formatDate(new Date(), userTimeZone, 'H'));
  console.log(hour);
  var message;
  if (hour >= 6 && hour < 12) {
    message = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    message = 'Good Afternoon';
  } else {
    message = 'Good Evening';
  }
  console.log(message);
  return message;
}

/**
 * creates different messages during different time of a day
 */
function easterEgg(e) {
  var info = messageChooser(e)
  var message;
  if (info == 'Good Morning') {
    message = 'Have a good day:))';
  } else if (info == 'Good Afternoon') {
    message = 'Pleasant afternoon^_^';
  } else if (info == 'Good Evening'){
    message = 'It is been a long day. Have a good rest!';
  }
  var notification = CardService.newNotification().setText(message)
  return CardService.newActionResponseBuilder()
  .setNotification(notification)
  .build();
}

/**
* Renders the contextual interface for a Gmail message.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onGmailMessageSelected(e) {
  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("selectedrecipients", " ");

  var card = buildSearchCard_(e);
  return [card];
}

/**
* Renders the contextual interface for a calendar event.
* This section is researved for furture dev(i.e., calendar related functions)
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onCalendarEventOpen(e) {
  var card = buildSearchCard_(e, "No functions found for current event.");
  return [card];
}

/**
* Handles the user search request.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onSearch(event) {
  if (!event.formInputs || !event.formInputs.query) {
    var notification = CardService.newNotification()
    .setText("Enter a query before searching.");
    return CardService.newActionResponseBuilder()
    .setNotification(notification)
    .build();
  }

  var query =  event.formInputs.query[0];
  var checking = '';//if no function found, checking enable the process of pushing no match found notification

    if (query.replace(" ", "").localeCompare('snooze', undefined, {sensitivity: 'base' }) === 0) {
    var card = onGmailMessage(event)
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
  } else if (query.replace(" ", "").localeCompare('maplink', undefined, {sensitivity: 'base' }) === 0) {
    var card = onGmailSideBarML(event)
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
  } else if (query.replace(" ", "").localeCompare('doodlepoll', undefined, {sensitivity: 'base' }) === 0) {
    var card = doodlePoll(event)
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
  }

  if (!checking || checking.length == 0) {
    var notification = CardService.newNotification().setText("No function found.");
    return CardService.newActionResponseBuilder()
    .setNotification(notification)
    .build();
  }

}

/**
* Builds the search interface for looking up functions.
*
* @param {string} opt_error - Optional message to include (typically when
*    contextual search failed.)
* @return {Card} Card to display
*/
function buildSearchCard_(e, opt_error) {
  
  var searchField = CardService.newTextInput()
  .setFieldName("query")
  .setSuggestions(CardService.newSuggestions()
    .addSuggestion('Snooze')
    .addSuggestion('Map link')
    .addSuggestion('Doodle poll'))
  .setHint("Name of functions")
  .setTitle("What can I do for you today?");

  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSearch")
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var banner = CardService.newImage()
      .setImageUrl('https://image.freepik.com/free-vector/hello-word-memphis-background_136321-401.jpg');

  var message = CardService.newTextParagraph()
      .setText("Can't find the function you are looking for?" +
                "Head to Calendar/Gmail to see more!")

  var info = messageChooser(e);

  var submitButton = CardService.newTextButton()
  .setText("Search")
  .setOnClickAction(onSubmitAction)
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

//------------image infront of each button------------------------------------------------
  var action = CardService.newAction()
    .setFunctionName('easterEgg');
  var imageButton = CardService.newImageButton()
  .setIconUrl("https://static.wikia.nocookie.net/p__/images/9/95/Robby_the_Robot01.png/revision/latest/top-crop/width/360/height/360?cb=20201228181530&path-prefix=protagonist")
  .setOnClickAction(action);
//---------------------------------------------------------------------------------------
  
  // Doodle Poll - Main menu selection
  var doodlePoll = CardService.newAction()
        .setFunctionName('doodlePoll');

  var doodlePollButton = CardService.newTextButton()
    .setText('Doodle Poll')
    .setOnClickAction(doodlePoll);

  var buttonSetDoodlePoll = CardService.newButtonSet()
    .addButton(imageButton)
    .addButton(doodlePollButton);


  var buttonSetMapLink = CardService.newButtonSet()
    .addButton(imageButton)
    .addButton(
      CardService.newTextButton()
        .setText('Map Link')
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('onGmailSideBarML'))
    );

  var buttonSetSnooze = CardService.newButtonSet()
      .addButton(imageButton)
      .addButton(
        CardService.newTextButton()
          .setText('Snooze')
          .setOnClickAction(
            CardService.newAction()
              .setFunctionName('onGmailMessage'))
      );


  var section = CardService.newCardSection()
  .addWidget(banner)
  .addWidget(searchField)
  .addWidget(submitButton)
  .addWidget(buttonSetSnooze)
  .addWidget(buttonSetMapLink)
  .addWidget(buttonSetDoodlePoll)
  .addWidget(message)
  .setCollapsible(true)
  .setNumUncollapsibleWidgets(6);

  if (opt_error) {
    var message = CardService.newTextParagraph()
    .setText("Note: " + opt_error);
    section.addWidget(message);
  }

  var footer = buildPreviousAndRootButtonSet();

  return CardService.newCardBuilder()
  .setHeader(
    CardService.newCardHeader()
      .setTitle('Welcome to Robbie')
      .setSubtitle(info + ' :)')
  )

  .addSection(section)
  .setFixedFooter(footer)
  .build();
}

  /**
   *  Create a ButtonSet with two buttons: one that backtracks to the
   *  last card and another that returns to the original (root) card.
   *  @return {ButtonSet}
   */
  function buildPreviousAndRootButtonSet() {
    return CardService.newFixedFooter()
        .setPrimaryButton(CardService.newTextButton()
            .setText('Back')
            .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoPreviousCard')))
        .setSecondaryButton(CardService.newTextButton()
            .setText('Home')
            .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoRootCard')));
  }

  /**
   *  Pop a card from the stack.
   *  @return {ActionResponse}
   */
  function gotoPreviousCard() {
    var nav = CardService.newNavigation().popCard();
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
  }

  /**
   *  Return to the initial add-on card.
   *  @return {ActionResponse}
   */
  function gotoRootCard() {
    var nav = CardService.newNavigation().popToRoot();
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
  }
  
var now = new Date();
var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours
GmailApp.createLabel("Snoozed");
var userTimeZone = CalendarApp.getDefaultCalendar().getTimeZone();

/**
 * Callback for rendering the card for a specific Gmail message. Only visable after the user has selected an email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e){
  var action = CardService.newAction()
    .setFunctionName('snoozeTimer')
    .setParameters({id: e.messageMetadata.messageId});
  var snoozeButton = CardService.newTextButton()
    .setText('Snooze Email')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);

  // Card Section for Snooze components, each add widget calls a function that creates the widget
  var snoozeSection = CardService.newCardSection()
    .setHeader("Snooze Email")
    .addWidget(snoozeQuickButtons())
    .addWidget(snoozeDateTimePicker())
    .addWidget(CardService.newButtonSet().addButton(snoozeButton))
    .addWidget(snoozeAddRecipients())
    .addWidget(emailSnoozeRecipientGroupsButtons())
    .addWidget(CardService.newTextParagraph().setText("\n\n"))
    .addWidget(getManangeCustomButtons());
  
  var footer = buildPreviousAndRootButtonSet();

  // Card which includes the Snooze components only
  var card = CardService.newCardBuilder()
    .addSection(snoozeSection)
    .setFixedFooter(footer);

  return card.build();
}

/**
 * Callback for rendering the card for a specific Gmail message. Only visable after the user has selected an email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function updateCard(e) {

  var selectedSnoozeTime = e.formInput.date_field.msSinceEpoch;
  snoozeUntil = new Date(selectedSnoozeTime);

  // Button Actions
  var action = CardService.newAction()
      .setFunctionName('snoozeTimer')
      .setParameters({id: e.messageMetadata.messageId});
  var noAction = CardService.newAction()
      .setFunctionName('noAction');

  // Button Renders
  var snoozeButton = CardService.newTextButton()
    .setText('Snooze Email')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setOnClickAction(action);
  var invalidButton = CardService.newTextButton()
    .setText('Enter Valid Time')
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    .setOnClickAction(noAction);

  var btnSet = CardService.newButtonSet();
  var section = CardService.newCardSection()
    .setHeader("Snooze Email")
    .addWidget(snoozeQuickButtons())
    .addWidget(snoozeDateTimePicker());

  if (now.getTime() > snoozeUntil.getTime()) {
    section.addWidget(btnSet.addButton(invalidButton));
  } else {
    section.addWidget(btnSet.addButton(snoozeButton));
  }

  section.addWidget(snoozeAddRecipients());
  section.addWidget(emailSnoozeRecipientGroupsButtons());
  section.addWidget(getManangeCustomButtons());

  var card = CardService.newCardBuilder()
    .addSection(section);

  return CardService.newNavigation().updateCard(card.build());

}


//------------------------------- SNOOZE WIDGETS -------------------------------------

/**
 * Callback for creating the Snooze Quick Button widgets. Each button is a quick
 * shortcut to common snooze times
 * @return {CardService.Card} The button set containing each Snooze Quick Button
 */
function snoozeQuickButtons() {
  var scriptProperties = PropertiesService.getUserProperties();
  checkPropertyquicksnooze();
  var quicksnoozetimes = JSON.parse(scriptProperties.getProperty("quicksnooze"));

  var snoozeButtonSet = CardService.newButtonSet();

  quicksnoozetimes.forEach(function(value) {
    console.log(value[1]);
    var savedaction = CardService.newAction()
    .setFunctionName('quickSnoozeButtons')
    .setParameters({hours:value[1]});
    var mapButton = CardService.newTextButton()
      .setText(value[0])
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(savedaction);
    snoozeButtonSet.addButton(mapButton);
  });

  return snoozeButtonSet;
}

/**
 * Callback for creating the Snooze Date Picker widget.
 * @return {CardService.Card} The Date Picker widget
 */
function snoozeDateTimePicker() {
  var snoozeDateTimePicker = CardService.newDateTimePicker()
    .setTitle("Enter the date to snooze until.")
    .setFieldName("date_field")
    .setValueInMsSinceEpoch(snoozeUntil.getTime())
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateCard"));

  return snoozeDateTimePicker;
}

function snoozeAddRecipients(){
  checkPropertySelectedSnoozeRecipients();
  var scriptProperties = PropertiesService.getUserProperties();
  var selectedrecipients = scriptProperties.getProperty("selectedrecipients");
  var addrecipients = CardService.newTextInput()
    .setFieldName("snoozerecipients")
    .setTitle("Include Additional Recipients")
    .setValue(selectedrecipients);
  return addrecipients;
}
