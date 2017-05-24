import base64
import httplib2

from apiclient import discovery
from oauth2client.file import Storage
from email.mime.text import MIMEText
from flask import render_template

from hello_utilities.log_helper import _log
from hello_models.models import User
from hello_webapp.extensions import db
from hello_settings import ENV_DICT, GOOGLE_STORAGE_LOCATION


def send_email(user, subject, template_path, template_vars):
    """
    helper function for sending an email (using gmail)
    :param user: User object to send email to
    :param subject: string subject of the email
    :param template_path: string path to jinja template file for the email
    :param template_vars: dictionary of variables to be used during template rendering
    :return: None
    """
    # Authorize the httplib2.Http object with our credentials
    gmail_storage = Storage(GOOGLE_STORAGE_LOCATION)
    gmail_credentials = gmail_storage.get()
    if gmail_credentials.invalid:
        raise Exception('++ gmail credentials are invalid, try re-creating gmail token to get new credentials')
    gmail_http = httplib2.Http()
    gmail_http = gmail_credentials.authorize(gmail_http)

    # Build the Gmail service from discovery
    gmail_service = discovery.build('gmail', 'v1', http=gmail_http)

    # email address that emails will be sent from
    from_email = "noreply@successkit.io"

    # either really send the email, or send to test recipient based on ENV_DICT
    if ENV_DICT.get('SEND_EMAILS'):
        to_email = user.email
    else:
        to_email = ENV_DICT['TEST_EMAIL_RECIPIENT']

    # render HTML from template
    page_html = render_template(template_path, **template_vars)

    message = MIMEText(page_html, 'html')
    message['to'] = to_email
    message['from'] = from_email
    message['subject'] = subject
    encoded_msg = base64.urlsafe_b64encode(message.as_string())
    body = {'raw': encoded_msg}

    # send the email
    try:
        message = (gmail_service.users().messages().send(userId="me", body=body).execute())
    except Exception as error:
        _log('++ gmail api error while sending email: %s' % error)


def send_test_email():
    """
    helper function for testing email sending
    :return: None
    """
    user = db.session.query(User).filter(
        User.email == 'test@gmail.com',
    ).one_or_none()
    t_vars = {
        'user': user
    }
    send_email(user=user,
               subject='Hello',
               template_path='emails/test_email.html',
               template_vars=t_vars)


if __name__ == '__main__':
    from hello_webapp.app import create_app
    app = create_app()
    with app.app_context():
        send_test_email()