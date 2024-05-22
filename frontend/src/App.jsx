import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

import { 
  Button, 
  Typography, 
  Card, 
  CardHeader, 
  CardBody,
  Tooltip,
} from "@material-tailwind/react";

import TrashCanIcon from './components/TrashCanIcon';

function App() {
  const [trashCans, setTrashCans] = useState([])
  const [selectedTrashCan, setSelectedTrashCan] = useState(null)

  useEffect(() => {
    const fetchTrashCans = async () => {
      try {
        const response = await axios.get('http://localhost:3001/trash')
        setTrashCans(response.data)
        setSelectedTrashCan((trashCans.length > 0) ? trashCans[0] : null)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTrashCans();
  }, []);

  const debugLog = () => {
    console.log(trashCans);
    console.log(selectedTrashCan);
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50 p-2">
      {debugLog()}
      <Card>
        <CardBody>
          <div className='w-40 h-40 m-3 relative w'>
            <TrashCanIcon 
              color="white" 
              progressColor="lime" 
              progress={selectedTrashCan && (selectedTrashCan.current_level / selectedTrashCan.height * 100)}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default App
