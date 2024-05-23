import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { 
  Button, ButtonGroup,
  Typography, 
  Card, 
  CardHeader, CardBody, CardFooter,
  Tooltip,
  Input,
  IconButton,
  Tab, Tabs, TabsHeader, TabsBody, TabPanel,
} from "@material-tailwind/react";

import TrashCanIcon from './components/TrashCanIcon';
import TrashStatusDonut from './components/TrashStatusDonut';
import TrashLevelsChart from './components/TrashLevelsChart';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

function App() {
  const [trashCans, setTrashCans] = useState([]);
  const [selectedTrashCan, setSelectedTrashCan] = useState(null);
  const [trashLevelsData, setTrashLevelsData] = useState([]);
  const [searchLabel, setSearchLabel] = useState('');
  const [dtUnits, setDtUnits] = useState('minute');

  function getLevelColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }
  
  const fetchTrashLevelsData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/trash-level/${selectedTrashCan._id}`);
      const formattedData = response.data.map(([timestamp, level]) => [new Date(timestamp).getTime(), level]);
      setTrashLevelsData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTrashCans = async () => {
      try {
        const response = await axios.get('http://localhost:3001/trash');
        setTrashCans(response.data);
        setSelectedTrashCan(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrashCans();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'UPDATE_TRASH_CAN') {
        const updatedTrashCan = message.payload;
        setTrashCans(prevCans => prevCans.map(can => can._id === updatedTrashCan._id ? updatedTrashCan : can));
        if (selectedTrashCan && updatedTrashCan._id === selectedTrashCan._id) {
          setSelectedTrashCan(updatedTrashCan);
        }
      } else if (message.type === 'NEW_TRASH_LEVEL') {
        const newTrashLevel = message.payload;
        if (selectedTrashCan && newTrashLevel.metadata.trash_id === selectedTrashCan._id) {
          setTrashLevelsData(prevData => [...prevData, [new Date(newTrashLevel.timestamp).getTime(), newTrashLevel.trash_level]]);
        }
      }
    };
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      ws.close();
    };
  }, [selectedTrashCan]);

  useEffect(() => {
    if (selectedTrashCan) {
      fetchTrashLevelsData();
    }
  }, [selectedTrashCan]);

  const editTrashCanLabel = async (label) => {
    try {
      const response = await axios.put(`http://localhost:3001/trash/${selectedTrashCan._id}`, { label });
      setSelectedTrashCan(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50 p-2">
      <div className='my-10 p-4 grid gap-6 grid-cols-1 md:grid-cols-3' >
        <Card className="flex flex-col justify-between h-full">
          <Tabs value="chart" className="flex flex-col h-full">
            <CardHeader floated={false} shadow={false} className="flex-grow">
              <TabsBody>
                <TabPanel value="chart">
                  <TrashStatusDonut trashCans={trashCans} />
                </TabPanel>
                <TabPanel value="table">
                  <div className="mb-4 flex items-center gap-x-2">
                    <Typography color="blueGray" variant="h4" className="flex-grow" style={{ flexShrink: 0 }}>Trash Cans</Typography>
                    <Input label="Search Trash Can" onChange={(e) => setSearchLabel(e.target.value)} />
                  </div>
                  <table className="min-w-full divide-y divide-blue-gray-200">
                    <thead className="bg-blue-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Label</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Height</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Current Level</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-gray-200">
                      {trashCans.filter(item => item.label.includes(searchLabel)).map(trashCan => (
                        <tr key={trashCan._id} className="hover:bg-blue-gray-50 cursor-pointer" onClick={() => setSelectedTrashCan(trashCan)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-blue-gray-900">{trashCan.label}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-gray-900">{trashCan.height} cm</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-gray-900">{trashCan.current_level} cm</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabPanel>
              </TabsBody>
            </CardHeader>
            <CardFooter className="border-t border-blue-gray-100 p-2 mt-auto min-h-20">
              <TabsHeader className="min-h-16">
                <Tab value="chart" className="min-h-14">Trash Can Chart</Tab>
                <Tab value="table" className="min-h-14">Trash Can Data</Tab>
              </TabsHeader>
            </CardFooter>
          </Tabs>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardBody>
            <TrashCanIcon 
              color="white" 
              progressColor={getLevelColor(selectedTrashCan && selectedTrashCan.current_level / selectedTrashCan.height)}
              progress={selectedTrashCan && (selectedTrashCan.current_level / selectedTrashCan.height * 100)}
            />
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 py-3 flex justify-between min-h-20">
            <div className='flex flex-col justify-center'>
              <div className="flex gap-x-1">
                <Typography variant="h5" color="blueGray">
                  {selectedTrashCan && selectedTrashCan.label}
                </Typography>
                <IconButton 
                  variant="text" 
                  size="sm"
                  onClick={() => {
                    const newLabel = prompt('Enter new label');
                    if (newLabel) {
                      editTrashCanLabel(newLabel);
                    }
                  }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-blue-gray-400" />
                </IconButton>
              </div>
            </div>
            <div>
              <Typography color="blueGray" size="sm" className="font-medium text-right">
                {selectedTrashCan && `Height: ${selectedTrashCan.height} cm`}
              </Typography>
              <Typography color="blueGray" size="sm" className="font-medium text-right">
                {selectedTrashCan && `${(selectedTrashCan.current_level / selectedTrashCan.height * 100).toFixed(0)}% full`}
              </Typography>
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardBody>
            {selectedTrashCan && (
              <TrashLevelsChart 
                trashCan={selectedTrashCan}
                trashLevelsData={trashLevelsData} 
                lineColor={getLevelColor(selectedTrashCan && selectedTrashCan.current_level / selectedTrashCan.height)}
                dtUnits={dtUnits}
              />
            )}
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 p-2 flex justify-between min-h-20">
            <ButtonGroup size="md" color="white" variant="gradient" className='flex justify-center'>
              <Button onClick={() => setDtUnits('minute')} >Min</Button>
              <Button onClick={() => setDtUnits('hour')} >Hr</Button>
              <Button onClick={() => setDtUnits('day')} >D</Button>
              <Button onClick={() => setDtUnits('week')} >W</Button>
              <Button onClick={() => setDtUnits('month')} >M</Button>
              <Button onClick={() => setDtUnits('year')} >Y</Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
