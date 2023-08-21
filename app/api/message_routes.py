from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Attachment

from app.s3_helpers import (get_unique_filename, upload_file_to_s3, remove_file_from_s3, download_file_from_s3)

message_routes = Blueprint('messages', __name__)


@message_routes.route("/attachments/<content_name>", methods=["GET"])
@login_required
def download_attachment(content_name):
    try:
        aws_url = download_file_from_s3(content_name)
        return {"url": aws_url}, 200
    except:
        return {"errors": "Failed to get aws url"}, 400


@message_routes.route("/attachments/upload", methods=["POST"])
@login_required
def upload_attachments_and_get_links():
    incoming_attachments_arr = request.files
    outgoing_attachments = {}

    for id, attachment in incoming_attachments_arr.items():
        attachment.filename = get_unique_filename(attachment.filename)
        upload_attachment = upload_file_to_s3(attachment)

        if "url" not in upload_attachment:
            print('Failed to upload to AWS')
            return {'errors': ['Failed to upload to AWS']}, 400
        else:
            outgoing_attachments[id] = upload_attachment["url"]

    return outgoing_attachments
