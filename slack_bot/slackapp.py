import logging
logging.basicConfig(level=logging.DEBUG)

import os
import bot_token
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

def slackMessage(text, ropemail):
  slack_token = bot_token.token
  client = WebClient(token=slack_token)

  userInfo = client.users_lookupByEmail(
    email=ropemail
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