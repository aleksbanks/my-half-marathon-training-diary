import { Button } from '@/shared/ui/Button/Button'

function App() {
  return (
    <div>
      <h1>Running Diary</h1>
      <Button onClick={() => console.log('Button clicked!')}>Start Running</Button>
    </div>
  )
}

export default App
