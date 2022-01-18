// Client ID and API key from the Developer Console
var CLIENT_ID = '675470811033-sibo04brkmpilumo090ng24fjs2kv9r8.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCDSI4swYkCMKH86woOwgF7jR7rZh5_4tc';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var createButton = document.getElementById('create_button');
var submitButton = document.getElementById('submit_form');

var idpQuestions = document.getElementById('idp_questions');

var sheetId = "dummy";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createButton.style.display = 'block';
    // createSheet();
    console.log("Succesfully Signed In")
  } else {
    console.log("Logged out", CLIENT_ID)
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

function createSheet() {
  gapi.client.sheets.spreadsheets.create({
    properties: {
      title: 'Cool New Sheet'
    }
  }).then((response) => {
    const reply = JSON.parse(response.body);
    console.log(reply.spreadsheetId);
    idpQuestions.style.display = 'block';
    createButton.style.display = 'none';
    submitButton.style.display = 'block';
    sheetId = reply.spreadsheetId;

    var values = [
    ['Name'], 
    ['Describe your history with Nutanix, and any pertinent prior work experience (including relevant skills you have acquired in these past roles).'], 
    ['What Nutanix core values do you most strongly demonstrate?'],
    ['What Nutanix core values do you feel you need to demonstrate more effectively?'],
    ['What professional values motivate you?'],
    ['What is most important to you in your career?'],
    ['What are your strongest skills and abilities?'],
    ['What are some areas you would like to improve upon?'],
    ['What goals do you have for your career over the next two years?'],
    ['What goals do you have for your career beyond two years?'],
    // Additional rows ...
    ];
    var body = {
      values: values
    };

    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:A10',
      valueInputOption: 'RAW',
      resource: body
    }).then((response) => {
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
    });

  }).catch((response) => {
    const reply = JSON.parse(response.body);
    console.log(reply);
  });
}

function submitForm() {
  var nameBox = document.getElementById('name');
  var q1Box = document.getElementById('q1');
  var q2Box = document.getElementById('q2');
  var q3Box = document.getElementById('q3');
  var q4Box = document.getElementById('q4');
  var q5Box = document.getElementById('q5');
  var q6Box = document.getElementById('q6');
  var q7Box = document.getElementById('q7');
  var q8Box = document.getElementById('q8');
  var q9Box = document.getElementById('q9');

  var name = nameBox.value;
  var q1 = q1Box.value;
  var q2 = q2Box.value;
  var q3 = q3Box.value;
  var q4 = q4Box.value;
  var q5 = q5Box.value;
  var q6 = q6Box.value;
  var q7 = q7Box.value;
  var q8 = q8Box.value;
  var q9 = q9Box.value;

  var body = {
    name: name + ' IDP',
  }

  gapi.client.drive.files.update({
    fileId: sheetId,
    resource: body,
  }).then((response) => {
    var result = response.result;
    console.log(`Name Changed`);
  });

  console.log(name);
  console.log(q1);
  console.log(q2);
  
  var values = [
    [name], 
    [q1], 
    [q2], 
    [q3], 
    [q4], 
    [q5], 
    [q6], 
    [q7], 
    [q8], 
    [q9]
    // Additional rows ...
  ];
  body = {
    values: values
  };

  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Sheet1!B1:B10',
    valueInputOption: 'RAW',
    resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
  });

  idpQuestions.style.display = 'none';
  createButton.style.display = 'block';
  submitButton.style.display = 'none';
}

/*
function listMajors() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      appendPre('Name, Major:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[4]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}
*/