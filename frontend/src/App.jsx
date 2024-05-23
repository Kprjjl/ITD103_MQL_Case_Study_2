import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

import { 
  Button, 
  Typography, 
  Card, 
  CardHeader, 
  CardBody,
  CardFooter,
  Tooltip,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";

import TrashCanIcon from './components/TrashCanIcon';
import TrashStatusDonut from './components/TrashStatusDonut';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

function App() {
  const [trashCans, setTrashCans] = useState([])
  const [selectedTrashCan, setSelectedTrashCan] = useState(null)

  useEffect(() => {
    const fetchTrashCans = async () => {
      try {
        const response = await axios.get('http://localhost:3001/trash');
        setTrashCans(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrashCans();
  }, []);

  useEffect(() => {
    if (selectedTrashCan === null && trashCans.length > 0) {
      setSelectedTrashCan(trashCans[0]);
    }
  }, [trashCans]);

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
      <div className='my-10 p-4 grid gap-x-6 grid-cols-3' style={{ border: '1px solid red' }}>
        <Card>
          <CardHeader floated={false} shadow={false}>
            <TrashStatusDonut trashData={trashCans.map(trash => ({
              name: trash.label,
              y: trash.current_level,
            }))} />
          </CardHeader>
        </Card>
        <Card className='p-4'>
          <CardHeader floated={false} shadow={false}>
          </CardHeader>
          <CardBody>
            <TrashCanIcon 
              color="white" 
              progressColor="lime" 
              progress={selectedTrashCan && (selectedTrashCan.current_level / selectedTrashCan.height * 100)}
            />
          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 p-2 pb-0 flex justify-between">
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
            <Typography color="blueGray" size="sm" className="font-medium">
              {selectedTrashCan && 
                `${(selectedTrashCan.current_level / selectedTrashCan.height * 100).toFixed(0)}% full`
              }
            </Typography>
          </CardFooter>
        </Card>
        <Card></Card>
      </div>
    </div>
  )
}

export default App
