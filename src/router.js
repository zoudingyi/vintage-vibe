import { createBrowserRouter } from "react-router-dom";
import Home from './views/home';
import About from './views/about';
import StartScreen from './views/start-screen';

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartScreen/>,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />
  },
]);

export default router;
