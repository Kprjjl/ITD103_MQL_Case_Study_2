import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { 
  Button, ButtonGroup,
  Typography, 
  Card, CardHeader, CardBody, CardFooter,
  Navbar,
  Input,
  IconButton,
  Tab, Tabs, TabsHeader, TabsBody, TabPanel,
  Switch,
} from "@material-tailwind/react";
import Highcharts from 'highcharts';
import darkTheme from './highcharts-theme';

import WebSocketIcon from './components/websocketIcon';
import TrashCanIcon from './components/TrashCanIcon';
import TrashStatusDonut from './components/TrashStatusDonut';
import TrashLevelsChart from './components/TrashLevelsChart';
import TrashLevelsTable from './components/TrashLevelsTable';
import TrashCansTable from './components/TrashCansTable';
import { PencilSquareIcon, MoonIcon } from '@heroicons/react/16/solid';

function App() {
  const [trashCans, setTrashCans] = useState([]);
  const [selectedTrashCan, setSelectedTrashCan] = useState(null);
  const [trashLevelsData, setTrashLevelsData] = useState([]);
  const [searchLabel, setSearchLabel] = useState('');
  const [dtUnits, setDtUnits] = useState('minute');
  const [wsConnected, setWsConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      setWsConnected(true);
    };
    ws.onclose = () => {
      setWsConnected(false);
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

  const editTrashCanHeight = async (height) => {
    try {
      const response = await axios.put(`http://localhost:3001/trash/${selectedTrashCan._id}`, { height });
      setSelectedTrashCan(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900/50" : "bg-blue-gray-50/50"}`} > {/* style={{ border: '1px solid red' }} */}
      <Card color={darkMode ? "gray":"white"} variant="gradient" className='sticky rounded-none' >
        <CardBody className="flex justify-between px-6 py-4 sticky">
          <div className="w-28"></div>
          <div>
            <Typography variant="h4" color={darkMode ? "white" : "black"} >Trash Monitoring System</Typography>
          </div>
          
          <div className="flex gap-x-3 items-center" >
            <div className="h-full">
              <WebSocketIcon connection={wsConnected} width={24} height={24} darkMode={darkMode} />
            </div>
            <MoonIcon className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-400"}`} />
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="black"
              size="sm"
            />
          </div>
        </CardBody>
      </Card>
      <div className='p-4 grid gap-6 grid-cols-1 md:grid-cols-3' >
        <Card className={`flex flex-col h-full`} color={darkMode ? "gray":"white"} variant="gradient" >
          <Tabs value="chart" className="flex flex-col justify-between h-full">
            <TabsBody className="h-full">
              <TabPanel value="chart" className="flex items-center justify-center h-full" >
                <CardHeader floated={false} shadow={false} >
                  <TrashStatusDonut trashCans={trashCans} darkMode={darkMode} />
                </CardHeader>
              </TabPanel>
              <TabPanel value="table" className="p-0">
                <CardHeader floated={false} shadow={false} className="w-full m-0 bg-transparent p-4">
                  <TrashCansTable
                    setSelectedTrashCan={setSelectedTrashCan}
                    trashCans={trashCans}
                    darkMode={darkMode}
                  />
                </CardHeader>
              </TabPanel>
            </TabsBody>
            <CardFooter className="border-t border-blue-gray-100 p-2 min-h-20">
              <TabsHeader 
                className="min-h-16 bg-transparent"
                indicatorProps={{
                  className: "bg-gray-500/50 shadow-none !text-gray-900",
                }}
              >
                <Tab value="chart" className={`min-h-14 ${darkMode && "text-white"}`}>
                  <Typography variant="h6" color="blueGray" >Trash Can Chart</Typography>
                </Tab>
                <Tab value="table" className={`min-h-14 ${darkMode && "text-white"}`}>
                  <Typography variant="h6" color="blueGray" >Trash Can Data</Typography>
                </Tab>
              </TabsHeader>
            </CardFooter>
          </Tabs>
        </Card>

        <Card className={`flex flex-col justify-between`} color={darkMode ? "gray":"white"} variant="gradient" >
          <CardBody className="h-full flex items-center" >
            <TrashCanIcon 
              color={darkMode ? "gray" : "white"}
              progressColor={getLevelColor(selectedTrashCan && selectedTrashCan.current_level / selectedTrashCan.height)}
              progress={selectedTrashCan && (selectedTrashCan.current_level / selectedTrashCan.height * 100)}
              darkMode={darkMode}
            />
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 py-3 flex justify-between min-h-20">
            <div className='flex flex-col justify-center'>
              <div className="flex gap-x-1 items-center">
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
              <div className="flex items-center" >
                <IconButton
                  variant="text" 
                  size="sm"
                  onClick={() => {
                    const newHeight = prompt('Enter new height (cm)');
                    if (newHeight) {
                      editTrashCanHeight(newHeight);
                    }
                  }}
                >
                  <PencilSquareIcon className="h-4 w-4 text-blue-gray-400" />
                </IconButton>
                <Typography color="blueGray" size="sm" className="font-medium text-right">
                  {selectedTrashCan && `Height: ${selectedTrashCan.height} cm`}
                </Typography>
              </div>
              <Typography color="blueGray" size="sm" className="font-medium text-right">
                {selectedTrashCan && `${(selectedTrashCan.current_level / selectedTrashCan.height * 100).toFixed(0)}% full`}
              </Typography>
            </div>
          </CardFooter>
        </Card>

        <Card className={`flex flex-col justify-between`} color={darkMode ? "gray":"white"} variant="gradient" >
          <Tabs value="chart" className="flex flex-col justify-between h-full">
            <TabsBody className="h-full">
              <TabPanel value="chart">
                <CardHeader floated={false} shadow={false}>
                  <ButtonGroup size="md" color={darkMode ? "gray" : "white"} variant="filled" className='flex justify-center' fullWidth>
                    <Button onClick={() => setDtUnits('minute')} >Min</Button>
                    <Button onClick={() => setDtUnits('hour')} >Hr</Button>
                    <Button onClick={() => setDtUnits('day')} >D</Button>
                    <Button onClick={() => setDtUnits('week')} >W</Button>
                    <Button onClick={() => setDtUnits('month')} >M</Button>
                    <Button onClick={() => setDtUnits('year')} >Y</Button>
                  </ButtonGroup>
                </CardHeader>
                <CardBody className="m-auto w-full">
                  {selectedTrashCan && (
                    <TrashLevelsChart 
                      trashCan={selectedTrashCan}
                      trashLevelsData={trashLevelsData} 
                      lineColor={getLevelColor(selectedTrashCan && selectedTrashCan.current_level / selectedTrashCan.height)}
                      dtUnits={dtUnits}
                      darkMode={darkMode}
                    />
                  )}
                </CardBody>
              </TabPanel>
              <TabPanel value="table" className="p-0 h-full">
                <CardHeader floated={false} shadow={false} className="w-full h-full m-0 bg-transparent p-4">
                  <TrashLevelsTable 
                    itemsPerPage={8}
                    trashLevelsData={trashLevelsData}
                    darkMode={darkMode}
                  />
                </CardHeader>
              </TabPanel>
            </TabsBody>
            <CardFooter className="border-t border-blue-gray-100 p-2 min-h-20">
              <TabsHeader
                className="min-h-16 bg-transparent"
                indicatorProps={{
                  className: "bg-gray-500/50 shadow-none !text-gray-900",
                }}
              >
                <Tab value="chart" className={`min-h-14 ${darkMode && "text-white"}`}>
                  <Typography variant="h6" color="blueGray" >Trash Level Data</Typography>
                </Tab>
                <Tab value="table" className={`min-h-14 ${darkMode && "text-white"}`}>
                  <Typography variant="h6" color="blueGray" >Time Series</Typography>
                </Tab>
              </TabsHeader>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default App;
