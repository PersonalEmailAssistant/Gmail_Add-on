// this file is based and improved on the 
// open source project:https://developers.google.com/workspace/add-ons/teams-addon-sample?hl=en
// to do: remove all the useless code; refine or add one more homepage
//
// Copyright 2019 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Sample Google Workspace Add-on that displays profile information about people
// the user is collaborating with. Collaborators are based on the context --
// recipients of a gmail message, Drive file ACLs, or event attendees.
//
// Profile information is from the Directory API in the Admin SDK. As a result,
// the add-on only shows information for email addresses in the same domain
// as as the current user. Different  strategies can be used for other use cases,
// such as integration with a CRM where the focus may be on external email
// addresses/customers.

// See https://github.com/contributorpw/lodashgs
var _ = LodashGS.load();

/**
 * Callback for personalized info.
 * @return the different message to show to the user depend on the time.
 */
function messageChooser(e) {
  //perth:GMT+8; the code is now hard coded and limited to perth timezone:(
  //to do: find out user's timezone through event 'e'. (i.e., e.userTimezone) or pop up setting for user
  //potential problem: e remains NULL while user haven't choose email.
  var hour = Number(Utilities.formatDate(new Date(), 'GMT+8', 'H'));
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
* Renders the contextual interface for a Gmail message.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onGmailMessageSelected(event) {
  var card = buildSearchCard_();
  return [card];
}

/**
* Renders the contextual interface for a calendar event.
*
* @param {Object} event - current add-on event
* @return {Card[]} Card(s) to display
*/
function onCalendarEventOpen(event) {
  var card = buildSearchCard_("No functions found for current event.");
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
  var people = '';
  // var people = queryPeople_(query);
  if (query == 'SNOOZE' || query == 'Snooze') {
    var notification = CardService.newNotification().setText("snooze found.")
    var card = onGmailMessage(event)
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .setNavigation(nav)
      .build();
  } else if (query == 'MAP LINK' || query == 'Map Link' || query == 'MapLink') {
    var notification = CardService.newNotification().setText("map link found.")
    var card = onGmailCompose(event)
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .setNavigation(nav)
      .build();
  }

  if (!people || people.length == 0) {
    var notification = CardService.newNotification().setText("No function found.");
    return CardService.newActionResponseBuilder()
    .setNotification(notification)
    .build();
  }

  var card = buildTeamListCard_(people);
  var navigation = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder()
  .setNavigation(navigation)
  .build();
}


function onTest1() {
  console.log('hello');
}

/**
* Builds the search interface for looking up people.
*
* @param {string} opt_error - Optional message to include (typically when
*    contextual search failed.)
* @return {Card} Card to display
*/
function buildSearchCard_(opt_error) {
  var banner = CardService.newImage()
  .setImageUrl('https://storage.googleapis.com/gweb-cloudblog-publish/original_images/Workforce_segmentation_1.png');

  var id = '1';

  var searchField = CardService.newTextInput()
  .setFieldName("query")
  .setSuggestions(CardService.newSuggestions()
    .addSuggestion('SNOOZE')
    .addSuggestion('MAP LINK'))
  .setHint("Name of functions")
  .setTitle("What can I do for you today?");

  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSearch")
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var banner1 = CardService.newImage()
      .setImageUrl('https://image.freepik.com/free-vector/hello-word-memphis-background_136321-401.jpg');

  var message = CardService.newTextParagraph()
      .setText("Can't find the function you are looking for?" + 
                "Head to Calendar/Gmail to see more!")
  
  var info = messageChooser();

  var submitButton = CardService.newTextButton()
  .setText("Search")
  .setOnClickAction(onSubmitAction)
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var action2 = CardService.newAction()
    .setFunctionName('onTest1')
    .setParameters({});

  var imageButton = CardService.newImageButton()
  .setIconUrl("https://static.wikia.nocookie.net/p__/images/9/95/Robby_the_Robot01.png/revision/latest/top-crop/width/360/height/360?cb=20201228181530&path-prefix=protagonist")
  .setOnClickAction(action2);

  var buttonSetMapLink = CardService.newButtonSet()
    .addButton(imageButton)
    .addButton(
      CardService.newTextButton()
        .setText('Map Link')
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('onGmailCompose')
            .setParameters({}))
    );

  var buttonSetSnooze = CardService.newButtonSet();
    // for(var i = 1; i <= 3; i++) {
      var i = 1;
      buttonSetSnooze.addButton(imageButton)
      buttonSetSnooze.addButton(createToCardButton(i));
    // }


  var section = CardService.newCardSection()
  .addWidget(banner1)
  .addWidget(searchField)
  .addWidget(submitButton)
  //.addWidget(buttonSet)
  .addWidget(buttonSetSnooze)
  .addWidget(buttonSetMapLink)
  .addWidget(message)
  .setCollapsible(true)
  .setNumUncollapsibleWidgets(3);

  if (opt_error) {
    var message = CardService.newTextParagraph()
    .setText("Note: " + opt_error);
    section.addWidget(message);
  }

  var footer = buildPreviousAndRootButtonSet();

  return CardService.newCardBuilder()
  .setHeader(
    CardService.newCardHeader()
      .setTitle('Welcome to Robby')
      .setSubtitle(info + ' :)')
  )
  //.addSection(justForLook)
  .addSection(section)
  .setFixedFooter(footer)
  .build();
}

/**
   *  Create a button that navigates to the specified child card.
   *  @return {TextButton}
   */
  function createToCardButton(id) {
    var text = '';
    switch (id) {
      case 1:
        text = 'snooze';
        var action = CardService.newAction()
            .setFunctionName('onGmailMessage')
            // .setParameters({'id': id.toString()});
        var button = CardService.newTextButton()
            .setText(text)
            .setOnClickAction(action);
        return button;
        break;

      case 2:
        text = 'map link';
        break;

      case 3:
        text = 'doodle poll'
        break;
    }
    var action = CardService.newAction()
        .setFunctionName('gotoChildCard')
        .setParameters({'id': id.toString()});
    var button = CardService.newTextButton()
        .setText(text)
        .setOnClickAction(action);
    return button;
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
            //.setTextButtonStyle(CardService.TextButtonStyle.FILLED))
        .setSecondaryButton(CardService.newTextButton()
            .setText('Home')
            .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoRootCard')));
            //.setTextButtonStyle(CardService.TextButtonStyle.FILLED));
  }

  /**
   *  Create a child card, with buttons leading to each of the other
   *  child cards, and then navigate to it.
   *  @param {Object} e object containing the id of the card to build.
   *  @return {ActionResponse}
   */
  function gotoChildCard(e) {
    if (e == null || e.messageMetadata.messageId == null) {
      return;
    }
    var id = parseInt(e.parameters.id);  // Current card ID
    var id2 = (id==3) ? 1 : id + 1;      // 2nd card ID
    var id3 = (id==1) ? 3 : id - 1;      // 3rd card ID
    var title = 'CARD ' + id;

    //------------------
    var action = CardService.newAction()
      .setFunctionName('snoozeTimer')
      .setParameters({id: e.messageMetadata.messageId});
    var snoozeButton = CardService.newTextButton()
      .setText('Snooze Email')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(action);

    // Create buttons that go to the other two child cards.
    var buttonSet = CardService.newButtonSet()
      .addButton(createToCardButton(id2))
      .addButton(createToCardButton(id3));

    var footer = buildPreviousAndRootButtonSet();

    // Card Section for Snooze components, each add widget calls a function that creates the widget
    var snoozeSection = CardService.newCardSection()
      .setHeader("Snooze Email")
      .addWidget(snoozeQuickButtons())
      .addWidget(snoozeDatePicker())
      .addWidget(snoozeTimePicker())
      .addWidget(CardService.newButtonSet().addButton(snoozeButton))
      .addWidget(snoozeAddRecipients())
      .addWidget(emailSnoozeRecipientGroupsButtons())
      .addWidget(buttonSet);

    // Card which includes the Snooze components only
    var card = CardService.newCardBuilder()
      .setName('snooze')
      .addSection(snoozeSection)
      .setFixedFooter(footer);

    return card.build();
    //------------------
 
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
  
//------------------------------------------------------------------------------------------------------------------------
//-----------------------------------code below is 'Snooze Email' from Github Common.gs-----------------------------------
var now = new Date();
var snoozeUntil = new Date(now.getTime()+(2 * 60 * 60 * 1000)); // set default snooze time as now + 2 hours
GmailApp.createLabel("Snoozed");

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
    .addWidget(snoozeDatePicker())
    .addWidget(snoozeTimePicker())
    .addWidget(CardService.newButtonSet().addButton(snoozeButton))
    .addWidget(snoozeAddRecipients())
    .addWidget(emailSnoozeRecipientGroupsButtons());

  // Card which includes the Snooze components only
  var card = CardService.newCardBuilder()
    .addSection(snoozeSection);

  return card.build();
}

/**
 * Callback for rendering the card for a specific Gmail message. Only visable after the user has selected an email
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function updateCard(e) {

  var selectedSnoozeTime = e.formInput.date_field.msSinceEpoch;
  selectedSnoozeTime += (e.formInput.time_field.hours-8) * 3600000;
  selectedSnoozeTime += e.formInput.time_field.minutes * 60000;
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
    .addWidget(snoozeDatePicker())
    .addWidget(snoozeTimePicker());

  if (now.getTime() > snoozeUntil.getTime()) {
    section.addWidget(btnSet.addButton(invalidButton));
  } else {
    section.addWidget(btnSet.addButton(snoozeButton));
  }

  section.addWidget(snoozeAddRecipients());
  section.addWidget(emailSnoozeRecipientGroupsButtons());

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
function snoozeDatePicker() {

  var snoozeDatePicker = CardService.newDatePicker()
    .setTitle("Enter the date to snooze until.")
    .setFieldName("date_field")
    .setValueInMsSinceEpoch(snoozeUntil.getTime()+(8*3600000))
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateCard"));

  return snoozeDatePicker;
}

/**
 * Callback for creating the Snooze Time Picker widget.
 * @return {CardService.Card} The Time Picker widget
 */
function snoozeTimePicker() {
  var snoozeTimePicker = CardService.newTimePicker()
    .setFieldName("time_field")
    .setHours(snoozeUntil.getHours())
    .setMinutes(snoozeUntil.getMinutes())
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("updateCard"));

  return snoozeTimePicker;
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
//------------------------------------------------------------------------------------------------------------------------
//----------------------------------end of Common.gs from Github----------------------------------------------------------
