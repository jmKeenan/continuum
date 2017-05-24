import httplib2

from oauth2client import tools
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage

from hello_settings import GOOGLE_SECRETS_PATH, GOOGLE_STORAGE_LOCATION


def recreate_gmail_token():
    """
    This function uses devops/secret_files/google/client_secret.json
    to fetch a new token from google
    and store it in devops/secret_files/google/gmail.storage
    -- this token is then used by all apps to send emails through gmail
    :return:
    """
    # Check https://developers.google.com/gmail/api/auth/scopes for all available scopes
    GMAIL_OAUTH_SCOPE = 'https://mail.google.com/'

    # Location of the credentials storage file
    GMAIL_STORAGE = Storage(GOOGLE_STORAGE_LOCATION)

    # Start the OAuth flow to retrieve credentials
    gmail_flow = flow_from_clientsecrets(GOOGLE_SECRETS_PATH, scope=GMAIL_OAUTH_SCOPE)
    gmail_http = httplib2.Http()

    # Try to retrieve credentials from storage or run the flow to generate them
    tools.run_flow(gmail_flow, GMAIL_STORAGE, http=gmail_http)

    print '++ gmail credentials written to: {}'.format(GOOGLE_STORAGE_LOCATION)


if __name__ == '__main__':
    recreate_gmail_token()