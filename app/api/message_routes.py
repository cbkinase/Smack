from flask import Blueprint, request
from flask_login import login_required
from app.s3_helpers import get_unique_filename, upload_file_to_s3, download_file_from_s3
from .errors import bad_request

message_routes = Blueprint("messages", __name__)


@message_routes.route("/attachments/<content_name>", methods=["GET"])
@login_required
def download_attachment(content_name):
    """
    Return a URL from which AWS S3 bucket content can be downloaded
    """
    try:
        aws_url = download_file_from_s3(content_name)
        return {"url": aws_url}, 200
    except:  # noqa: E722
        return bad_request("Failed to get AWS URL")


@message_routes.route("/attachments/upload", methods=["POST"])
@login_required
def upload_attachments_and_get_links():
    """
    Upload attachments to AWS S3 and return the URL where it is stored
    """
    incoming_attachments_arr = request.files
    outgoing_attachments = {}

    for id, attachment in incoming_attachments_arr.items():
        attachment.filename = get_unique_filename(attachment.filename)
        upload_attachment = upload_file_to_s3(attachment)

        if "url" not in upload_attachment:
            print("Failed to upload to AWS")
            return bad_request("Failed to upload to AWS")
        else:
            outgoing_attachments[id] = upload_attachment["url"]

    return outgoing_attachments
