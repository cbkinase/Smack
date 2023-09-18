import React from "react";
import { isImage, previewFilter, getFileExt } from "./AttachmentFncs.js";
import PreviewImageModal from "../../../../PreviewImageModal/PreviewImageModal";
import OpenModalButton from "../../../../OpenModalButton";

function AttachmentCard ({ attachments, messageId, user, handleDeleteAttachment, setHoverId, hoverId, message }) {
	// download
	const downloadFile = (e, objectKey) => {
		e.preventDefault();
		fetch(`/api/messages/attachments/${objectKey}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		})
			.then(response => response.json())
			.then(res => {
				const downloadLink = document.createElement("a");
				downloadLink.href = res.url;
				downloadLink.download = objectKey;
				downloadLink.target = "_blank";
				downloadLink.rel = "noopener noreferrer";
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			});
	};

	return (
		<div className="msg-attachments" id={`msg-${messageId}-attachments`}>
			{Object.values(attachments).map((attch) => (

				<span className="msg-attachment-preview-file-wrapper"
					key={attch.id}
					onMouseEnter={() => { setHoverId(attch.id); }}
					onMouseLeave={() => { setHoverId(0); }}
				>
					{isImage(attch.content)

						? <OpenModalButton
							modalComponent={
								<PreviewImageModal
									url={attch.content}
								/>
							}

							buttonText={<img className="msg-attachment-preview-img"
								src={attch.content}
								alt="msg-attachment-preview">
							</img>}
							className={"msg-attachment-preview-file-wrapper"}

						/>

						:						<>
							<img
								className="msg-attachment-preview-file"
								src={previewFilter(attch.content)}
								alt="msg-attachment-preview">
							</img>

							<div className="attachment-details">
								<div>
									{attch.content.split("/")[3].length > 20
										? `${attch.content.split("/")[3].substring(0, 20)}...`
										:										`${attch.content.split("/")[3]}`
									}
								</div>
								<div>
									{getFileExt(attch.content)}
								</div>
							</div>
						</>
					}
					{hoverId !== attch.id
						? null
						: isImage(attch.content)
							?							(<>
								<div className="img-attachment-details">
									<div>
										{attch.content.split("/")[3].length > 20
											? `${attch.content.split("/")[3].substring(0, 20)}...`
											:											`${attch.content.split("/")[3]}`
										}
									</div>
									<div>
										{getFileExt(attch.content)}
									</div>
								</div>
								<div className="attachment-hover-menu">
									<button onClick={(e) => downloadFile(e, attch.content.split("/")[3])}>
										<i className="fa-solid fa-cloud-arrow-down" style={{ color: "#000000" }}></i>
									</button>

									{user.id === attch.user_id
										? <button onClick={(e) => handleDeleteAttachment(e, message, attch)}>
											<i className="fa-solid fa-trash-can" style={{ color: "#000000" }}></i>
										</button>
										:										null
									}
								</div>
							</>)
							:							<div className="attachment-hover-menu">
								<button onClick={(e) => downloadFile(e, attch.content.split("/")[3])}>
									<i className="fa-solid fa-cloud-arrow-down" style={{ color: "#000000" }}></i>
								</button>

								{user.id === attch.user_id
									? <button onClick={(e) => handleDeleteAttachment(e, message, attch)}>
										<i className="fa-solid fa-trash-can" style={{ color: "#000000" }}></i>
									</button>
									:									null
								}

							</div>
					}
				</span>

			))}

		</div>
	);
}

export default AttachmentCard;
