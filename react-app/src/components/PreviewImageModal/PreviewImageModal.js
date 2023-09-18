export default function PreviewImageModal({ url }) {
	return (
		<div className="preview-image-modal-wrapper">
			<img src={url} alt={`${url} preview`}></img>
		</div>
	);
}
