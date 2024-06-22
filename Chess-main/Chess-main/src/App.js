import './App.css';
import {Route , Routes , Link} from "react-router-dom";
import Gameui from './Game/Gameui'
import ChessboardJs from 'react-chessboardjs-wrapper'

function App() {
  return (
    <div className="App">
        I am god and visible to all


        <br></br>
        <Routes>
            <Route path="/gameui/:id/:color" element={<Gameui/>}/>
        </Routes>
      
        play game <Link to="/gameui/123/white">game</Link>
    </div>
  );
}

export default App;
