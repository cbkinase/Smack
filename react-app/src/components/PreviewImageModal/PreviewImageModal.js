import { useModal } from "../../context/Modal";

export default function PreviewImageModal({url}) {
    const { closeModal } = useModal();

    return (
        <div className="preview-image-moda-wrapper">
            <img src={url} alt={`${url} preview`}>
            </img>
        </div>
        
    );
}
