import { createBrowserRouter } from "react-router-dom";
import Home from './views/home';
import About from './views/about';
import StartScreen from './views/start-screen';
import NotFound from './views/not-found';

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
  {
    path: "*",
    element: <NotFound />
  },
]);

export default router;
