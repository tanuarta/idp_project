import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from gdrive import gdrive

# Initializes your app with your bot token and socket mode handler
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# Listens to incoming messages that contain "hello"
# To learn available listener arguments,
# visit https://slack.dev/bolt-python/api-docs/slack_bolt/kwargs_injection/args.html
@app.message("hello")
def message_hello(message, say):
    # say() sends a message to the channel where the event was triggered
    print(message)
    user_id = message['user']
    result = app.client.users_info(
        user=user_id
    )
    print(result['user']['profile'])
    email = result['user']['profile']['email']
    say(f"Hey there <@{message['user']}>!")
    say(f"Your email is _{email}_")
    items = gdrive()
    say('You have the following files:')
    for item in items:
        name = item['name']
        fileId = item['id']
        
        say(f"{name} ({fileId})")

# Start your app
if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()