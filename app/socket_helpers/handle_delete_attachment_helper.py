from app.models import db, Attachment
from ..s3_helpers import remove_file_from_s3
from .write_error_message import write_error_message


def handle_delete_attachment_helper(data):
    attachment_id = data.get("id")
    try:
        this_attachment = Attachment.query.get(attachment_id)
        remove_attachment = remove_file_from_s3(this_attachment.content)

        if not remove_attachment:
            return write_error_message("Failed to delete files from AWS")

        db.session.delete(this_attachment)
        db.session.commit()
        return data
    except:  # noqa: E722
        return write_error_message("Failed to delete attachment")
