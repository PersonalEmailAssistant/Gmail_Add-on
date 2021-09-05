//------------------------------- MANAGE PROPERTIESSERVICE STORAGE -------------------------------------

function checkPropertymap(){
  var scriptProperties = PropertiesService.getUserProperties();
  if(scriptProperties.getProperty("map")===null || JSON.parse(scriptProperties.getProperty("map"))[0].length!=3){
    var defaultsavedlocations = [["UWA", "-31.981179,115.819910"," "]]
    // map stores all saved locations
    scriptProperties.setProperty("map", JSON.stringify(defaultsavedlocations));
    // mapselect is used to set the default values of map link
    scriptProperties.setProperty("mapselected", JSON.stringify(["","",""]));
  }
}

function checkPropertyquicksnooze(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("quicksnooze")===null){
    var defaultquicksnooze = [["30 Minutes","0.5"],["2 Hours","2"],["Tomorrow","24"],["Next Week","168"]]; // time in hours
    scriptProperties.setProperty("quicksnooze", JSON.stringify(defaultquicksnooze));
  }
}

function checkPropertyrecipientgroups(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("recipientgroups")===null){
    scriptProperties.setProperty("recipientgroups", JSON.stringify([["test","22721679@student.uwa.edu.au,lilyfel3@gmail.com"]]));// temp email addresses
  }
}

function checkPropertySelectedSnoozeRecipients(){
  var scriptProperties = PropertiesService.getUserProperties();
  if (scriptProperties.getProperty("selectedrecipients")===null){
    scriptProperties.setProperty("selectedrecipients", " ");
  }
}
