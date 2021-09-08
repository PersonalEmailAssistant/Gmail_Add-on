/**
 * Callback for rendering the card for the compose action dialog.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
 function onGmailCompose(e) {
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // PropertiesService should allow for long-term storage
  var selectedlocation = JSON.parse(scriptProperties.getProperty("mapselected"));
  console.log(selectedlocation);
  var header = CardService.newCardHeader()
      .setTitle('Insert Map Link');
  var input1 = CardService.newTextInput()
      .setFieldName('text1')
      .setTitle('Location')
      .setValue(selectedlocation[0]);
  var input2 = CardService.newTextInput()
      .setFieldName('text2')
      .setTitle('Latitude and Longitude')
      .setValue(selectedlocation[1]);
  var input3 = CardService.newTextInput()
      .setFieldName('text3')
      .setTitle('Message (Optional)')
      .setValue(selectedlocation[2]);
  var action = CardService.newAction()
      .setFunctionName('onGmailInsertLink');
  var action1 = CardService.newAction()
      .setFunctionName('onGmailInsertMap');
  var addlocation = CardService.newAction()
      .setFunctionName('saveNewLocation');
  var button = CardService.newTextButton()
      .setText('Insert map link')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var button1 = CardService.newTextButton()
      .setText('Insert static map')
      .setOnClickAction(action1)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var button2 = CardService.newTextButton()
      .setText('Save Location')
      .setOnClickAction(addlocation)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button1)
      .addButton(button)
      .addButton(button2);
  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(input1)
      .addWidget(input2)
      .addWidget(input3)
      .addWidget(buttonSet);
  
  // add buttons with saved locations
  var scriptProperties = PropertiesService.getUserProperties();
  var savedlocation = JSON.parse(scriptProperties.getProperty("map"));

  var mapsavedSection = CardService.newCardSection()
      .setHeader("Saved Locations");

  var mapsavedButtonSet = CardService.newButtonSet();
  savedlocation.forEach(function(value) {
    var savedaction = CardService.newAction()
    .setFunctionName('setDefaultmapLocation')
    .setParameters({name:value[0], coordinates:value[1], message:value[2]});
    var mapButton = CardService.newTextButton()
      .setText(value[0])
      .setBackgroundColor("#71c0eb")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(savedaction);
    mapsavedButtonSet.addButton(mapButton);
  });
 mapsavedSection
    .addWidget(mapsavedButtonSet);

  var footer = buildPreviousAndRootButtonSet();

  var card = CardService.newCardBuilder()
      .setName('map link')
      .setHeader(header)
      .addSection(section)
      .addSection(mapsavedSection)
      .setFixedFooter(footer);
  return card.build();
}

/**
 * Callback for inserting a map link into the Gmail draft.
 * @param {Object} e The event object.
 * @return {CardService.UpdateDraftActionResponse} The draft update response.
 */
function onGmailInsertLink(e) {
  console.log(e);
  // Get the text that was entered by the user.
  var text1 = e.formInput.text1;
  var text2 = e.formInput.text2;
  // parameter to act as a cache buster.
  // test1 for address
  // test2 for the coordinate
  if (!text1) {return}
  var linkContent = ""
  if (text2) {
    linkContent += Utilities.formatString('<a href="https://www.google.com/maps?q=%s">%s</a>', text2, text1);
  }
  else {linkContent = text1;}
  var response = CardService.newUpdateDraftActionResponseBuilder()
      .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
          .addUpdateContent(linkContent,CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT))
      .build();
  return response;
}

/**
 * Callback for inserting a static map into the Gmail draft.
 * @param {Object} e The event object.
 * @return {CardService.UpdateDraftActionResponse} The draft update response.
 */
function onGmailInsertMap(e) {
  console.log(e);
  // Get the text that was entered by the user.
  var text1 = e.formInput.text1;
  var text2 = e.formInput.text2;
  // check if user wrote a message
  var message = "";
  if (e.formInput.text3!=undefined) message = e.formInput.text3;
  // parameter to act as a cache buster.
  // test1 for address
  // test2 for the coordinate
  if (!text1) {return}
  var linkContent = ""
  if (text2) {
    linkContent += Utilities.formatString('<img style="display: block; max-height: 300px;" src="https://maps.googleapis.com/maps/api/staticmap?center='+text2+'&zoom=17&size=600x300&maptype=roadmap&language=English&format=jpg&markers=color:red%7Clabel%7C'+text2+'&key=AIzaSyD8-rjn3KAVBFfzBRN5utHlZvEPCQphM6A"/>');
  }
  else {linkContent = text1;}
  var response = CardService.newUpdateDraftActionResponseBuilder()
      .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
          .addUpdateContent(linkContent,CardService.ContentType.MUTABLE_HTML)
          .addUpdateContent(message,CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT))
      .build();
  return response;
}

function setDefaultmapLocation(e){
  var scriptProperties = PropertiesService.getUserProperties();
  scriptProperties.setProperty("mapselected", JSON.stringify([e.parameters.name,e.parameters.coordinates, e.parameters.message]));
  return CardService.newNavigation().updateCard(onGmailCompose())
}

function saveNewLocation(e){
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // this should allow for long-term storage
  var savedlocation = JSON.parse(scriptProperties.getProperty("map"));
  var message = "";
  if (e.formInput.text3!=undefined) message = e.formInput.text3;
  savedlocation.push([e.formInput.text1,e.formInput.text2, message])
  console.log(savedlocation)
  scriptProperties.setProperty("map", JSON.stringify(savedlocation));
  scriptProperties.setProperty("mapselected", JSON.stringify([e.formInput.text1,e.formInput.text2, message]));
  return CardService.newNavigation().updateCard(onGmailCompose())
}