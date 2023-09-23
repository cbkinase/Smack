from flask import current_app, render_template
from flask_mail import Message
import gevent
from . import mail


def send_email(to, subject, template,**kwargs):
    SMACK_MAIL_SUBJECT_PREFIX = current_app.config["SMACK_MAIL_SUBJECT_PREFIX"]
    SMACK_SENDER = current_app.config["SMACK_MAIL_SENDER"]
    app = current_app._get_current_object()
    msg = Message(
            subject=SMACK_MAIL_SUBJECT_PREFIX + ' ' + subject,
            sender=SMACK_SENDER,
            recipients=[to],
            )
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    # Create a new greenlet to send the email in the background
    gevent.spawn(send_async_email, app, msg)


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)
