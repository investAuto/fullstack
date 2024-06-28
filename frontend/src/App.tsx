import { Template } from './components/template';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Template>
                <Outlet />
            </Template>
        </div>
    );
}

export default App;
