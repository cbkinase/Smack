import pdfImg from "../../../../../misc/pdf-svgrepo-com.svg";
import csvImg from "../../../../../misc/excel-svgrepo-com (1).svg";
import zipImg from "../../../../../misc/file-zip-fill-svgrepo-com.svg";
import fileImg from "../../../../../misc/file-ui-svgrepo-com.svg";

export function isImage (filename) {
	const imageTypes = "jpegjpgpngsvggif";
	const lowerFileName = filename.toLowerCase();
	return imageTypes.includes(lowerFileName.split(".").pop());
}

export function previewFilter (filename) {
	const fileExt = filename.split(".").pop();
	switch (fileExt) {
	case "pdf":
		return pdfImg;
	case "csv":
		return csvImg;
	case "xlsx":
		return csvImg;
	case "zip":
		return zipImg;
	default:
		return fileImg;
	}
}

export function getFileExt (filename) {
	const fileExt = filename.split(".").pop();
	return fileExt.toUpperCase();
}
