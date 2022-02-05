// Client ID and API key from the Developer Console
// ROAN
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
var nextButton = document.getElementById('next_button');
var backButton = document.getElementById('back_button');
var cancelButton = document.getElementById('cancel_button');

var questions = [
  ['name','quarter','engEmail','manEmail'],
  ['q1','q2', 'q3'],
  ['q4','q5'],
  ['q6','q7'],
  ['q8','q9']
]

const homePage = document.getElementById('home_page');
const idpQuestions = [
  document.getElementById('idp_questions_0'),
  document.getElementById('idp_questions_1'),
  document.getElementById('idp_questions_2'),
  document.getElementById('idp_questions_3'),
  document.getElementById('idp_questions_4')
];

var sheetId = 'dummy';
var currentPage = 0;
var fileId = 'dummy';
var parentId = 'dummy';

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

function startIDP() {  
  idpQuestions[currentPage].style.display = 'flex';
  homePage.style.display = 'none';
  createButton.style.display = 'none';
  nextButton.style.display = 'block';
  signoutButton.style.display= 'none';
  cancelButton.style.display='block';
}

function submitForm() {
  var validInput = true;
  for(var i=0; i < questions[currentPage].length; i++) {
    var temp = document.getElementById(questions[currentPage][i])
    if(!temp.validity.valid) {
      validInput = false;
      temp.style.border = "2px solid rgba(255,0,0,0.7)";
    } else {
      temp.style.border = "none";
    }
  }

  if(validInput) {
    var nameBox = document.getElementById('name');
    var manEmail = document.getElementById('manEmail');
    var engEmail = document.getElementById('engEmail');
    var quarterBox = document.getElementById('quarter');
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
    var mEmail = manEmail.value;
    var eEmail = engEmail.value;
    var quarter = quarterBox.value;
    // console.log(quarter)
    var q1 = q1Box.value;
    var q2 = q2Box.value;
    var q3 = q3Box.value;
    var q4 = q4Box.value;
    var q5 = q5Box.value;
    var q6 = q6Box.value;
    var q7 = q7Box.value;
    var q8 = q8Box.value;
    var q9 = q9Box.value;
  
    gapi.client.drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and name='IDP'",
      spaces: 'drive',
      fields: 'nextPageToken, files(id, name)'
    }).then((response) => {
      const reply = JSON.parse(response.body);
      const fileArray = reply['files']
  
      if (fileArray.length === 0) {
        console.log('asdasd')
        body = {
          mimeType : 'application/vnd.google-apps.folder',
          name : 'IDP'
        }
  
        gapi.client.drive.files.create({
          resource: body
        }).then((response) => {
          const reply = JSON.parse(response.body);
          console.log(reply['id'])
          folderId = reply['id']
        }).catch((response) => {
          console.log(response);
        })
      } else {
        console.log(fileArray);
        folderId = fileArray[0]['id'];
      }
  
      gapi.client.drive.files.copy({
        fileId: '1YfV5W-nUbeLzFJfR9IIOm48NdfJQwcildzyAXL74hI0',
        name: name + ' IDP - ' + quarter
      }).then((response) => {
        const reply = JSON.parse(response.body);
        console.log(reply['id'])
        sheetId = reply['id'];
        
        var values = [
          [q1], 
          [q2], 
          [q3], 
          [q4], 
          [q5], 
          [q6], 
          [q7], 
          [q8], 
          [q9]
        ];
        var body = {
          values: values
        };
    
        gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: 'Sheet1!C4:C12',
          valueInputOption: 'RAW',
          resource: body
        }).then((response) => {
          var result = response.result;
          console.log(`${result.updatedCells} cells updated.`);
        });
    
        body = {
          role: 'writer',
          type: 'user',
          emailAddress: mEmail,
        }
    
        gapi.client.drive.permissions.create({
          fileId: sheetId,
          resource: body,
        }).then((response) => {
          var result = response.result;
          console.log(result)
          console.log(`Manager Permission Changed`);
        });
  
        body = {
          role: 'writer',
          type: 'user',
          emailAddress: eEmail,
        }
    
        gapi.client.drive.permissions.create({
          fileId: sheetId,
          resource: body,
        }).then((response) => {
          var result = response.result;
          console.log(result)
          console.log(`Engineer Permission Changed`);
        });
  
        gapi.client.drive.files.get({
          fileId: sheetId,
          fields: 'parents'
        }).then((response) => {
          const reply = JSON.parse(response.body);
          console.log(reply['parents'][0])
          parentId = reply['parents'][0]
  
          gapi.client.drive.files.update({
            fileId: sheetId,
            addParents: folderId,
            removeParents: parentId,
          }).then((response) => {
            console.log(response);
          });
        });
    
      }).catch((response) => {
        const reply = JSON.parse(response.body);
        console.log(reply);
      });
  
    }).catch((response) => {
      //const reply = JSON.parse(response.body);
      console.log(response);
    });
    returnHome();
    showSnackbar("submission_success");
  } else {
    showSnackbar("invalid_input");
  }

}

function nextPage() {
  var validInput = true;
  for(var i=0; i < questions[currentPage].length; i++) {
    var temp = document.getElementById(questions[currentPage][i])
    if(!temp.validity.valid) {
      validInput = false;
      temp.style.border = "2px solid rgba(255,0,0,0.7)";
    } else {
      temp.style.border = "none";
    }
  }

  if(validInput) {
    idpQuestions[currentPage].style.display = 'none';
    currentPage = currentPage + 1;
    idpQuestions[currentPage].style.display = 'flex';
  
    if (currentPage > 0) {
      backButton.style.display = 'block';
    }
    if (currentPage === 4) {
      nextButton.style.display = 'none';
      submitButton.style.display = 'block';
    }
  } else {
    showSnackbar("invalid_input")
  }

}

function prevPage() {
  idpQuestions[currentPage].style.display = 'none';
  currentPage = currentPage - 1;
  idpQuestions[currentPage].style.display = 'flex';

  if (currentPage === 0) {
    backButton.style.display = 'none';
  }
  if (currentPage < 4) {
    nextButton.style.display = 'block';
    submitButton.style.display = 'none';
  }
}

function returnHome() {
  var nameBox = document.getElementById('name');
  var manEmail = document.getElementById('manEmail');
  var engEmail = document.getElementById('engEmail');
  var quarterBox = document.getElementById('quarter');
  var q1Box = document.getElementById('q1');
  var q2Box = document.getElementById('q2');
  var q3Box = document.getElementById('q3');
  var q4Box = document.getElementById('q4');
  var q5Box = document.getElementById('q5');
  var q6Box = document.getElementById('q6');
  var q7Box = document.getElementById('q7');
  var q8Box = document.getElementById('q8');
  var q9Box = document.getElementById('q9');

  homePage.style.display = 'flex';
  idpQuestions[0].style.display = 'none';
  idpQuestions[1].style.display = 'none';
  idpQuestions[2].style.display = 'none';
  idpQuestions[3].style.display = 'none';
  idpQuestions[4].style.display = 'none';

  currentPage = 0;

  createButton.style.display = 'block';
  backButton.style.display = 'none';
  nextButton.style.display = 'none';
  submitButton.style.display = 'none';
  signoutButton.style.display = 'block'
  cancelButton.style.display = 'none';

  nameBox.value = '';
  manEmail.value = '';
  engEmail.value = ''
  q1Box.value = '';
  q2Box.value = '';
  q3Box.value = '';
  q4Box.value = '';
  q5Box.value = '';
  q6Box.value = '';
  q7Box.value = '';
  q8Box.value = '';
  q9Box.value = '';

  nameBox.style.border = 'none';
  manEmail.style.border = 'none';
  engEmail.style.border = 'none';
  q1Box.style.border = 'none';
  q2Box.style.border = 'none';
  q3Box.style.border = 'none';
  q4Box.style.border = 'none';
  q5Box.style.border = 'none';
  q6Box.style.border = 'none';
  q7Box.style.border = 'none';
  q8Box.style.border = 'none';
  q9Box.style.border = 'none';

}

function showSnackbar(type) {
  var snacbkar = document.getElementById("snackbar")
  if(type === "invalid_input") {
    snacbkar.innerHTML = "<i class="+"material-icons"+">error</i>"
    +"<p>"+"Please fill in all fields."+"</p>"
  } else if(type === "submission_success") {
    snacbkar.innerHTML = "<i class="+"material-icons"+">check</i>"
    +"<p>"+"IDP successfully submitted!"+"</p>"
  } else if(type === "submission_error") {
    snacbkar.innerHTML = "<i class="+"material-icons"+">error</i>"
    +"<p>"+"Error submitting IDP."+"</p>"
  } else {
    snacbkar.innerHTML = "Invalid type."
  }

  snacbkar.className = "show"

  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}