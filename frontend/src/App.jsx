import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { 
  Button, 
  Typography, 
  Card, 
  CardHeader, 
  CardBody,
  CardFooter,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

import TrashCanIcon from './components/TrashCanIcon';
import TrashStatusDonut from './components/TrashStatusDonut';
import TrashLevelsChart from './components/TrashLevelsChart';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

function App() {
  const [trashCans, setTrashCans] = useState([]);
  const [selectedTrashCan, setSelectedTrashCan] = useState(null);
  const [trashLevelsData, setTrashLevelsData] = useState([]);
  const [trashLevelColor, setTrashLevelColor] = useState('red');

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
          setTrashLevelColor(getLevelColor(selectedTrashCan.current_level / selectedTrashCan.height));
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
      setTrashLevelColor(getLevelColor(selectedTrashCan.current_level / selectedTrashCan.height));
    }
  }, [selectedTrashCan]);

  const editTrashCanLabel = async (label) => {
    try {
      const response = await axios.put(`http://localhost:3001/trash/${selectedTrashCan._id}`, { label });
      setSelectedTrashCan(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50 p-2">
      <div className='my-10 p-4 grid gap-6 grid-cols-1 md:grid-cols-3' style={{ border: '1px solid red' }}>
        <Card>
          <CardHeader floated={false} shadow={false} >
            <TrashStatusDonut trashCans={trashCans} />
          </CardHeader>
          <CardFooter className="border-t border-blue-gray-100 p-2 flex justify-between">
          </CardFooter>
        </Card>
        <Card>
          <CardBody>
            <TrashCanIcon 
              color="white" 
              progressColor={trashLevelColor}
              progress={selectedTrashCan && (selectedTrashCan.current_level / selectedTrashCan.height * 100)}
            />
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 py-3 flex justify-between">
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
        <Card>
          <CardHeader floated={false} shadow={false}></CardHeader>
          <CardBody>
            {selectedTrashCan && (
              <TrashLevelsChart trashLevelsData={trashLevelsData} lineColor={trashLevelColor} />
            )}
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 p-2 flex justify-between">
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
