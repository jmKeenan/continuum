import json

from flask import request, jsonify, Blueprint

from hello_utilities.bullhorn.bullhorn_api import BullhornApi
from hello_utilities.log_helper import _log, _capture_exception
from hello_utilities.send_email import send_email
from hello_settings import TEMPLATE_DIR, ENV_DICT


def get_webhook_blueprint():
    # blueprint for these routes
    webhook_blueprint = Blueprint('webhook_blueprint', __name__, template_folder=TEMPLATE_DIR)

    @webhook_blueprint.route('/api/email/webhook/', methods=['POST', 'GET'])
    def api_email_webhook(**kwargs):
        """
        endpoint to post emails to (via zapier integration)
        """
        api_key = request.headers.get('CPI-API-KEY', None)
        if not api_key == ENV_DICT['CPI_API_KEY']:
            raise Exception('++ email webhook with bad api key')

        data = request.form
        to_email = data['raw__To_email']
        # recipient_email = data['recipient'] ## this just contains the bcc
        from_email = data['from_email']
        email_content = data['body_plain']
        subject = data['subject']

        bapi = BullhornApi()

        search_results = bapi.search_candidates(input=to_email, fields='email,id,firstName,lastName')
        if search_results:
            candidate = search_results[0]
            if candidate['email'] == to_email:
                note_id = bapi.create_note(
                    comments=email_content,
                    action='Email sent',
                    candidate_id=candidate['id']
                )
                _log('++ created note via email: {}'.format(note_id))
                if note_id:
                    response = jsonify({
                        'success': 'True',
                        'message': 'created note'
                    })
                    response.status_code = 200
                    return response

        # if we reached here, then a note was not created, and we should send an error email
        alert_emails = ENV_DICT['ALERT_EMAILS']
        for to_email in alert_emails:
            t_vars = {
                'email_content': email_content,
                'to_email': to_email,
                'subject': subject,
            }
            send_email(
                to_email=to_email,
                subject='Note Creation Failure',
                template_path='emails/alert_email.html',
                template_vars=t_vars
            )
        response = jsonify({
            'success': 'False',
            'message': 'failed to created note'
        })
        response.status_code = 200
        return response

    # finally return blueprint
    return webhook_blueprint