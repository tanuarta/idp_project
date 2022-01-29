from __future__ import print_function

import os.path
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from datetime import date

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from slackapp import *

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive']

def gdrive():
    """Shows basic usage of the Drive v3 API.
    Prints the names and ids of the first 10 files the user has access to.
    """
    print("running")
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
      if creds and creds.expired and creds.refresh_token:
          creds.refresh(Request())
      else:
          flow = InstalledAppFlow.from_client_secrets_file(
              'credentials.json', SCOPES)
          creds = flow.run_local_server(port=0)
      # Save the credentials for the next run
      with open('token.json', 'w') as token:
          token.write(creds.to_json())

    try:
      service = build('drive', 'v3', credentials=creds)
      query = f"mimeType= 'application/vnd.google-apps.folder' and name= 'IDP'"
      response = service.files().list(
        pageSize=10,
        q=query,
        fields='nextPageToken, files(id, name)').execute()

      print(response['files'][0]['id'])

      folder_id = response['files'][0]['id']
      query = f"parents = '{folder_id}'"

      # Call the Drive v3 API
      results = service.files().list(
        pageSize=10, 
        fields="nextPageToken, files(id, name, modifiedTime, permissions)",
        q=query,
        ).execute()
      #print(results)
      items = results.get('files', [])
      #print(items)

      if not items:
        print('No files found.')
        return

      for item in items:
        #print(item)
        modTime = item['modifiedTime']
        name = item['name']
        fileId = item['id']
        permissionArray = item['permissions']
        #print(permissionArray)

        for permission in permissionArray:
          if permission['role'] == 'writer':
            print(permission['emailAddress'])

        modDateTime = parse(modTime).replace(tzinfo=None)

        modDate = modDateTime.date()
        todayDate = date.today()

        three_months = modDate + relativedelta(months=+3)

        print(three_months)

        # CHANGE THIS TO BE >= INSTEAD OF <=
        if todayDate <= three_months:
          # Send message
          print('pog')
          for permission in permissionArray:
            if permission['role'] == 'writer':
              print(permission['emailAddress'])
              ropeEmail = permission['emailAddress']
              #print('returning')
              slackMessage('Please review ' + name, ropeEmail)
        
        
    except HttpError as error:
      # TODO(developer) - Handle errors from drive API.
      print(f'An error occurred: {error}')