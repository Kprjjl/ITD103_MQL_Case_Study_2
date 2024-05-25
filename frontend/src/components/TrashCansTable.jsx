import React, { useState } from "react";
import { Typography, Input } from "@material-tailwind/react";

const TrashCansTable = ({ setSelectedTrashCan, trashCans, darkMode }) => {
  const [searchLabel, setSearchLabel] = useState("");

  return (
    <div>
      <div className="mb-4 flex items-center gap-x-2">
        <Typography color={darkMode ? "white" : "blueGray"} variant="h4" className="flex-shrink-0">
          Trash Cans
        </Typography>
        <div className="flex-grow">
          <Input
            label="Search Trash Can"
            onChange={(e) => setSearchLabel(e.target.value)}
            className={darkMode ? "bg-transparent text-white placeholder-gray-400" : ""}
            inputProps={{ className: darkMode ? "text-white" : "" }}
          />
        </div>
      </div>
      <table className={`min-w-full divide-y ${darkMode ? "divide-gray-600" : "divide-blue-gray-200"}`}>
        <thead className={darkMode ? "bg-gray-800" : "bg-blue-gray-50"}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-blue-gray-500"}`}>
              Label
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-blue-gray-500"}`}>
              Height
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-blue-gray-500"}`}>
              Current Level
            </th>
          </tr>
        </thead>
        <tbody className={darkMode ? "bg-transparent divide-gray-600" : "bg-white divide-blue-gray-200"}>
          {trashCans.filter(item => item.label.toLowerCase().includes(searchLabel.toLowerCase())).map(trashCan => (
            <tr
              key={trashCan._id}
              className={`hover:bg-${darkMode ? "gray-700" : "blue-gray-50"} cursor-pointer`}
              onClick={() => setSelectedTrashCan(trashCan)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-blue-gray-900"}`}>
                    {trashCan.label}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? "text-white" : "text-blue-gray-900"}`}>
                  {trashCan.height} cm
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? "text-white" : "text-blue-gray-900"}`}>
                  {trashCan.current_level} cm
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrashCansTable;
