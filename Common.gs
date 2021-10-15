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
    message = "Good Morning, Here's Today's Calendar";
  } else if (hour >= 12 && hour < 18) {
    message = "Good Afternoon, Here's Today's Calendar";
  } else {
    message = "Good Evening, Here's Today's Calendar";
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
 * Renders the homepage
 */
function onHomePage(e) {
  var card = buildSearchCard_(e, true);
  return [card];
}

/**
* Renders the contextual interface for a Gmail message.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onGmailMessageSelected(e) {
  var card = buildSearchCard_(e, false);
  return [card];
}

/**
* Renders the contextual interface for a calendar event.
* This section is researved for furture dev(i.e., calendar related functions)
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onCalendarEventOpen(e) {
  var card = buildSearchCard_(e, false, "No functions found for current event.");
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
  var isOnhomePage = event.parameters.isOnhomePage;//can't open snooze if no email has been opened

  if (query.replace(" ", "").localeCompare('snooze', undefined, {sensitivity: 'base' }) === 0 && isOnhomePage == 'false') {
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
* @param {isOnHomepage} - a boolean flag to determine whether on gmail homepage or not
* @param {string} opt_error - Optional message to include (typically when
*    contextual search failed.)
* @return {Card} Card to display
*/
function buildSearchCard_(e, isOnHomepage, opt_error) {
  if (isOnHomepage == true) {
    var searchField = CardService.newTextInput()
    .setFieldName("query")
    .setSuggestions(CardService.newSuggestions()
      .addSuggestion('Map link')
      .addSuggestion('Doodle poll'))
    .setHint("Name of functions")
    .setTitle("What can I do for you today?"); 
  } else {
    var searchField = CardService.newTextInput()
    .setFieldName("query")
    .setSuggestions(CardService.newSuggestions()
      .addSuggestion('Snooze')
      .addSuggestion('Map link')
      .addSuggestion('Doodle poll'))
    .setHint("Name of functions")
    .setTitle("What can I do for you today?");
  }

  var onSearchInput = {isOnhomePage: 'false'}
  if (isOnHomepage == true) {
    onSearchInput = {isOnhomePage: 'true'}
  }

  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSearch")
  .setParameters(onSearchInput)
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("selectedrecipients", "");
  //var banner = CardService.newImage()
  //    .setImageUrl('https://image.freepik.com/free-vector/hello-word-memphis-background_136321-401.jpg');
  calendarsection = buildHomepageCalendarAvailability(now.getTime());

  var message = CardService.newTextParagraph()
      .setText("Can't find the function you are looking for?" +
                "Select/Open an email " + 
                "or head to Calendar/Gmail to see more!")

  var info = messageChooser(e);

  var submitButton = CardService.newTextButton()
  .setText("Search")
  .setOnClickAction(onSubmitAction)
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  //------------image infront of each button------------------------------------------------
  var action = CardService.newAction()
    .setFunctionName('easterEgg');
  var imageButton = CardService.newImageButton()
  .setIconUrl("https://media.istockphoto.com/photos/smiley-face-drawing-picture-id157527255")
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
              .setFunctionName('snoozeEmailCard'))
      );

  var resetAction = CardService.newAction()
    .setFunctionName("resetAllPropertiesService")
    var resetPropertiesServicebutton = CardService.newTextButton()
      .setText('Reset All User Specific Data')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#EA3323")
      .setOnClickAction(resetAction);
    //var resetSection = CardService.newCardSection()
    // .addWidget(resetPropertiesServicebutton).setCollapsible(true);

  if (isOnHomepage == true) {
    var section = CardService.newCardSection()
    //.addWidget(banner)
    .addWidget(searchField)
    .addWidget(submitButton)
    .addWidget(buttonSetMapLink)
    .addWidget(buttonSetDoodlePoll)
    .addWidget(message)
    .addWidget(resetPropertiesServicebutton)
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(5);
  } else {
    var section = CardService.newCardSection()
    //.addWidget(banner)
    .addWidget(searchField)
    .addWidget(submitButton)
    .addWidget(buttonSetSnooze)
    .addWidget(buttonSetMapLink)
    .addWidget(buttonSetDoodlePoll)
    .addWidget(message)
    .addWidget(resetPropertiesServicebutton)
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(5);
  }

  if (opt_error) {
    var message = CardService.newTextParagraph()
    .setText("Note: " + opt_error);
    section.addWidget(message);
  }

  var footer = buildPreviousAndRootButtonSet();

  return CardService.newCardBuilder()
  .setHeader(
    CardService.newCardHeader()
      .setTitle('Welcome to Personal Assistant')
      .setSubtitle(info)
  )
  .addSection(calendarsection)
  .addSection(section)
  .setFixedFooter(footer)
  .build();
}

/**
 *  This function is used to create footer in the add-on.
 *  note: this function needs to work with card object instead of (update card)
 *  'Back' will return the previous 'card' in the card stack
 *  'Home' will return the top 'card' in the card stack
 *  Create a ButtonSet with those two buttons above.
 *  Example: var card = CardService.newCardBuilder()
 *             .setFixedFooter(buildPreviousAndRootButtonSet());
 *           return card.build()
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
var userTimeZone = CalendarApp.getDefaultCalendar().getTimeZone();

function buildHomepageCalendarAvailability(msSinceEpoch){
  section = CardService.newCardSection();
  var inputdate = new Date(msSinceEpoch);
  var events = CalendarApp.getDefaultCalendar().getEventsForDay(inputdate);
  if (events.length == 0){
    var eventtext = CardService.newTextParagraph()
      .setText("You do not have any calendar events for today");
    section.addWidget(eventtext)
  }
  else {
    events.forEach(function(value) {
      starttime = Utilities.formatDate(value.getStartTime(), userTimeZone, "hh:mm a");
      endtime = Utilities.formatDate(value.getEndTime(), userTimeZone, "hh:mm a");
      var eventtext = CardService.newTextParagraph()
        .setText(" "+value.getTitle()+" from "+starttime+" - "+endtime+"\n");
      section.addWidget(eventtext);
    })
  }
  return section;
}
