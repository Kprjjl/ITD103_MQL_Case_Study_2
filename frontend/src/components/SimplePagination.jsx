import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function SimplePagination({ currentPage, setCurrentPage, totalPages, darkMode }) {
  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex items-center gap-8 justify-center">
      <IconButton
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={currentPage === 1}
        className={darkMode ? 'border-gray-600 text-gray-300' : ''}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      <Typography color={darkMode ? "white" : "gray"} className="font-normal">
        Page <strong className={darkMode ? "text-white" : "text-gray-900"}>{currentPage}</strong> of{" "}
        <strong className={darkMode ? "text-white" : "text-gray-900"}>{totalPages}</strong>
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={currentPage === totalPages}
        className={darkMode ? 'border-gray-600 text-gray-300' : ''}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

export default SimplePagination;
