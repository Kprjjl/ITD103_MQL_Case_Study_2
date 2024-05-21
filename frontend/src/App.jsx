import { useState } from 'react'
import './App.css'

import { 
  Button, 
  Typography, 
  Card, 
  CardHeader, 
  CardBody 
} from "@material-tailwind/react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Card>
        <CardBody>
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
    </>
  )
}

export default App
