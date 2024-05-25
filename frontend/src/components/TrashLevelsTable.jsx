import React, { useState, useEffect } from "react";
import SimplePagination from "./SimplePagination";

const TrashLevelsTable = ({ itemsPerPage, trashLevelsData, darkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reversedData, setReversedData] = useState([]);

  useEffect(() => {
    setReversedData([...trashLevelsData].reverse());
  }, [trashLevelsData]);

  const totalPages = Math.ceil(reversedData.length / itemsPerPage);
  const currentData = reversedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <table className={`min-w-full divide-y ${darkMode ? "divide-gray-600 bg-transparent" : "divide-blue-gray-200 bg-transparent"}`}>
        <thead className={darkMode ? "bg-gray-800" : "bg-blue-gray-50"}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-blue-gray-500"}`}>
              Timestamp
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-blue-gray-500"}`}>
              Trash Level
            </th>
          </tr>
        </thead>
        <tbody className={darkMode ? "bg-transparent divide-gray-600" : "bg-white divide-blue-gray-200"}>
          {currentData.map(([timestamp, level]) => (
            <tr key={timestamp} className={`hover:bg-${darkMode ? "gray-700" : "blue-gray-50"} cursor-pointer`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? "text-white" : "text-blue-gray-900"}`}>
                  {new Date(timestamp).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? "text-white" : "text-blue-gray-900"}`}>
                  {`${level} cm`}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SimplePagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        darkMode={darkMode}
      />
    </div>
  );
};

export default TrashLevelsTable;
