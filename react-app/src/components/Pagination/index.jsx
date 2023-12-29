import { useState, useEffect } from "react";
import "./pagination.css";

export default function Pagination({
	currentPage,
	onPageChange,
	totalPages,
	maxPageNumbersToShow = 5,
}) {
	const [selectedPage, setSelectedPage] = useState(currentPage);

	useEffect(() => {
		setSelectedPage(currentPage);
	}, [currentPage]);

	const handleSelectChange = (e) => {
		setSelectedPage(parseInt(e.target.value, 10));
	};

	const handleGoClick = () => {
		onPageChange(selectedPage);
	};

	// Calculate the range of page numbers to show
	const halfMaxVisible = Math.floor(maxPageNumbersToShow / 2);
	let startPage = Math.max(1, currentPage - halfMaxVisible);
	let endPage = Math.min(totalPages, currentPage + halfMaxVisible);

	// Adjust the range if near the start or end
	if (currentPage - 1 <= halfMaxVisible) {
		endPage = startPage + maxPageNumbersToShow - 1;
	}
	if (totalPages - currentPage <= halfMaxVisible) {
		startPage = totalPages - maxPageNumbersToShow + 1;
	}

	// Prevent negative start pages
	startPage = Math.max(startPage, 1);
	// Ensure the range doesn't exceed the total pages
	endPage = Math.min(endPage, totalPages);

	return (
		<div>
			<div className="pagination">
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(1)}
				>
					≪
				</button>
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
				>
					&lt;
				</button>

				{Array.from(
					{ length: endPage - startPage + 1 },
					(_, i) => startPage + i,
				).map((page) => (
					<button
						key={page}
						className={
							currentPage === page
								? "active-page"
								: "inactive-page"
						}
						onClick={() => onPageChange(page)}
					>
						{page}
					</button>
				))}

				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}
				>
					&gt;
				</button>
				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(totalPages)}
				>
					≫
				</button>
			</div>
			<div className="pagination-nav">
				<label htmlFor="page-select">Navigate to page</label>
				<select
					className="pagination-select"
					id="page-select"
					onChange={handleSelectChange}
					value={selectedPage}
				>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(pageNumber) => (
							<option
								// selected={pageNumber === currentPage}
								key={pageNumber}
								value={pageNumber}
							>
								{pageNumber}
							</option>
						),
					)}
				</select>
				<button
					className="pagination-select-go"
					onClick={handleGoClick}
				>
					Go
				</button>
			</div>
		</div>
	);
}
