import logging
logging.basicConfig(level=logging.DEBUG)

import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

slack_token = os.environ["SLACK_BOT_TOKEN"]
client = WebClient(token=slack_token)

def message(text):
  userInfo = client.users_lookupByEmail(
    email='roan.tanuarta@nutanix.com'
  )
  print(userInfo['user']['id'])

  userId = userInfo['user']['id']


  try:
      response = client.chat_postMessage(
          channel=userId,
          text=text
      )
  except SlackApiError as e:
      # You will get a SlackApiError if "ok" is False
      assert e.response["error"]    # str like 'invalid_auth', 'channel_not_found'