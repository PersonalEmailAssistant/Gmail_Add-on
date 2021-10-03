//this callback function rendering ML UI on the composing section
function onGmailCompose(e) {
  onComposing();
  checkPropertymap();
  var card = CardService.newCardBuilder()
      .addSection(generalSection())
      .addSection(mapSavedSection());
  
  return card.build();
}

//this callback function rendering ML UI on the sidebar
function onGmailSideBarML(e) {
  onSideBar();
  var card = CardService.newCardBuilder()
      .addSection(generalSection())
      .addSection(mapSavedSection())
      .setFixedFooter(buildPreviousAndRootButtonSet());
  return card.build();
}

function mapSavedSection(e) {
  // add buttons with saved locations
  var scriptProperties = PropertiesService.getUserProperties();
  var savedlocation = JSON.parse(scriptProperties.getProperty("map"));

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
  if (checkSideBarOrComposing() == false) {
    var mapsavedSection = CardService.newCardSection()
      .setHeader("Saved Locations");
    mapsavedSection
      .addWidget(mapsavedButtonSet)
      .addWidget(CardService.newTextParagraph().setText("\n\n"))
      .addWidget(getManangeCustomButtons())
      .setCollapsible(true)
      .setNumUncollapsibleWidgets(2);
    return mapsavedSection;
  }
  var mapsavedSection = CardService.newCardSection()
  mapsavedSection
    .setHeader("Saved Locations")
    .addWidget(mapsavedButtonSet)
    .addWidget(CardService.newTextParagraph().setText("\n\n"))
    .addWidget(getManangeCustomButtons());
  return mapsavedSection;
}

function generalSection(e) {
  
  var generalSection = CardService.newCardSection()
    .setHeader('Map Link')
    .addWidget(locationInput())
    .addWidget(positionInput())
    .addWidget(inserting())
    .addWidget(addLocationButton())
    .addWidget(deleteLocationButton())
    ;

  if (checkSideBarOrComposing() == false) {
    generalSection = CardService.newCardSection()
    .setHeader('Map Link')
    .addWidget(locationInput())
    .addWidget(positionInput())
    .addWidget(massageInput())
    .addWidget(inserting())
    .addWidget(addLocationButton())
    .addWidget(deleteLocationButton())
    ;
  }
  return generalSection;
}

function locationInput(e) {
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // PropertiesService should allow for long-term storage
  var selectedlocation = JSON.parse(scriptProperties.getProperty("mapselected"));

  var locationInput = CardService.newTextInput()
    .setFieldName('location')
    .setTitle('Location')
    .setHint('Required')
    .setValue(selectedlocation[0]);

  return locationInput; 
}

function positionInput(e) {
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // PropertiesService should allow for long-term storage
  var selectedlocation = JSON.parse(scriptProperties.getProperty("mapselected"));
  var positionInput = CardService.newTextInput()
    .setFieldName('position')
    .setTitle('Latitude and Longitude')
    .setHint('Required')
    .setValue(selectedlocation[1]);

  return positionInput; 
}

function massageInput(e) {
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // PropertiesService should allow for long-term storage
  var selectedlocation = JSON.parse(scriptProperties.getProperty("mapselected"));
  var massageInput = CardService.newTextInput()
    .setFieldName('message')
    .setTitle('Message')
    .setHint('Optional')
    .setValue(selectedlocation[2]);

  return massageInput; 
}

function inserting(e) {

  var text = ['', ''];
  if (checkSideBarOrComposing() == false) {
    text[0] = 'Insert Map Link'
    text[1] = 'Insert Static Map'
  } else if (checkSideBarOrComposing() == true) {
    text[0] = 'Show Map Link'
    text[1] = 'Show Static Map'
  } else return;

  var insertLinkButton = CardService.newTextButton()
        .setText(text[0])
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('onGmailInsertLink')
        )
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var insertMapButton = CardService.newTextButton()
        .setText(text[1])
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('onGmailInsertMap')
        )
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
      
  var buttonSet = CardService.newButtonSet()
    .addButton(insertLinkButton)
    .addButton(insertMapButton);

  return buttonSet;
}

function deleteLocationButton(e) {
    var deleteLocationButton = CardService.newTextButton()
        .setText('Delete Location')
        .setBackgroundColor("#EA3323")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('deleteLocation'))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

    return deleteLocationButton;
}

function addLocationButton(e) {
    var addLocationButton = CardService.newTextButton()
        .setText('Save Location')
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName('saveNewLocation'))
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

    return addLocationButton;
}

/**
 * Callback for inserting a map link into the Gmail draft.
 * When user is on the sidebar, return a card for user to copy the link.
 * @param {Object} e The event object.
 * @return {CardService.UpdateDraftActionResponse} The draft update response.
 */
function onGmailInsertLink(e) {
  // Get the text that was entered by the user.
  if(e.formInput.location == null || e.formInput.position == null){
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText("Please type in required fields first. :)"))
      .build();
  }
  var location = e.formInput.location;
  var position = e.formInput.position;
  // parameter to act as a cache buster.
  if (!location) {return}
  var linkContent = ""
  if (position) {
    linkContent += Utilities.formatString('<a href="https://www.google.com/maps?q=%s">%s</a>', position, location);
  }
  else {linkContent = location;}
  
  //-------------action on sidebar-----------------
  if (checkSideBarOrComposing() == true) {
    var message = CardService.newTextParagraph()
      .setText(linkContent);
    var hint = CardService.newTextParagraph()
      .setText('Or you can select the link above to copy and paste it onto anywhere.')
    var card = CardService.newCardBuilder()
      .addSection(CardService.newCardSection()
        .setHeader('Click On the Link Below to See details!')
        .addWidget(message)
        .addWidget(hint))
        .setFixedFooter(buildPreviousAndRootButtonSet())
      .build();
    return [card];
  }
  //-----------------------------------------------

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
  if(e.formInput.location == null || e.formInput.position == null){
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText("Please type in required fields first. :)"))
      .build();
  }
  // Get the text that was entered by the user.
  var location = e.formInput.location;
  var position = e.formInput.position;
  // check if user wrote a message
  var message = "";
  if (e.formInput.message!=undefined) message = e.formInput.message;
  // parameter to act as a cache buster.
  // test1 for address
  // test2 for the coordinate
  if (!location) {return}
  var linkContent = ""
  if (position) {
    linkContent += Utilities.formatString('<img style="display: block; max-height: 300px;" src="https://maps.googleapis.com/maps/api/staticmap?center='+position+'&zoom=17&size=600x300&maptype=roadmap&language=English&format=jpg&markers=color:red%7Clabel%7C'+position+'&key=AIzaSyD8-rjn3KAVBFfzBRN5utHlZvEPCQphM6A"/>');
  }
  else {linkContent = location;}
  var url = 'https://maps.googleapis.com/maps/api/staticmap?center='+ position + '&zoom=17&size=600x300&maptype=roadmap&language=English&format=jpg&markers=color:red%7Clabel%7C' + position + '&key=AIzaSyD8-rjn3KAVBFfzBRN5utHlZvEPCQphM6A';
  //-------------action on sidebar-----------------
  var details = '';
  details += Utilities.formatString('<a href="https://www.google.com/maps?q=%s">%s</a>', position, location);
  if (checkSideBarOrComposing() == true) {
    var picture = CardService.newImage()
      .setImageUrl(url);
    var message = CardService.newTextParagraph()
      .setText(details);
    var hint = CardService.newTextParagraph()
      .setText('Cick the link above to see more detail.')   
    var card = CardService.newCardBuilder()
      .addSection(CardService.newCardSection()
        .setHeader('The Static Map')
        .addWidget(picture)
        .addWidget(message)
        .addWidget(hint))
      .setFixedFooter(buildPreviousAndRootButtonSet())
      .build();
    return [card];
  }
  //-----------------------------------------------

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
  if (checkSideBarOrComposing() == true){ 
    return CardService.newNavigation().updateCard(onGmailSideBarML());
  } else if (checkSideBarOrComposing() == false){
    return CardService.newNavigation().updateCard(onGmailCompose());
  }
}

function saveNewLocation(e){  
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // this should allow for long-term storage
  var savedlocation = JSON.parse(scriptProperties.getProperty("map"));
  console.log(savedlocation)
  if(e.formInput.location == null || e.formInput.position == null){
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText("Please type in required fields before saving location."))
      .build();
  } 
  var message = "";
  var flag = 0;
  if (e.formInput.message!=undefined) message = e.formInput.message;
  savedlocation.forEach(function(value){
    if(value[0] == e.formInput.location){
      flag = 1
      value[1] = e.formInput.position
      value[2] = message;}
  })
  if(flag == 0) savedlocation.push([e.formInput.location,e.formInput.position, message])

  scriptProperties.setProperty("map", JSON.stringify(savedlocation));
  scriptProperties.setProperty("mapselected", JSON.stringify([e.formInput.location,e.formInput.position, message]));
  if (checkSideBarOrComposing() == true){ 
    return CardService.newNavigation().updateCard(onGmailSideBarML())
  } else if (checkSideBarOrComposing() == false){
    return CardService.newNavigation().updateCard(onGmailCompose())
  }
}

function deleteLocation(e){
  checkPropertymap();
  var scriptProperties = PropertiesService.getUserProperties(); // this should allow for long-term storage
  var savedlocation = JSON.parse(scriptProperties.getProperty("map"));
  console.log(savedlocation)
  var message = "";
  if (e.formInput.message!=undefined) message = e.formInput.message;
  savedlocation.push([e.formInput.location,e.formInput.position, message])

  scriptProperties.deleteProperty("map");
  scriptProperties.deleteProperty("mapselected");
  
  if (checkSideBarOrComposing() == true){ 
    return CardService.newNavigation().updateCard(onGmailSideBarML())
  } else if (checkSideBarOrComposing() == false){
    return CardService.newNavigation().updateCard(onGmailCompose())
  }
}
