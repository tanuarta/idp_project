// Client ID and API key from the Developer Console
var CLIENT_ID = config.clientId;
var API_KEY = config.apiKey;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

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
    console.log("Logged out")
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
    [
      'Name', 'What do you want to do?', 'What kills do you think you need?'
    ],
    // Additional rows ...
    ];
    var body = {
      values: values
    };

    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:C1',
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

  var name = nameBox.value;
  var q1 = q1Box.value;
  var q2 = q2Box.value;

  console.log(name);
  console.log(q1);
  console.log(q2);
  
  var values = [
    [
      name, q1, q2
    ],
    // Additional rows ...
  ];
  var body = {
    values: values
  };

  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:C2',
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