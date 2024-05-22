import { useState } from 'react'
import './App.css'

import { 
  Button, 
  Typography, 
  Card, 
  CardHeader, 
  CardBody 
} from "@material-tailwind/react";

import TrashCanIcon from './components/TrashCanIcon';

function App() {
  const [count, setCount] = useState(0)
  const [level, setLevel] = useState(50)

  return (
    <div className="min-h-screen bg-blue-gray-50/50 p-8">
      <Card>
        <CardBody>
        <div className='w-20 h-20 m-3 relative'>
          <TrashCanIcon color="white" progressColor="lime" progress={level}/>
        </div>
          <Button onClick={() => setCount((count) => count + 1)}>
            <Typography color="white">
              count is {count}
            </Typography>
          </Button>
          <Typography color="gray">
            Edit <code>App.jsx</code> and save to test HMR
          </Typography>
        </CardBody>
      </Card>
    </div>
  )
}

export default App
