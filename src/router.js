import { createBrowserRouter } from 'react-router-dom';
import DesktopExperience from './desktop/DesktopExperience';
import About from './views/about';
import StartScreen from './views/start-screen';
import NotFound from './views/not-found';

const router = createBrowserRouter(
  [
    {
      path: '/',
      // 首页与桌面共用常驻父组件，开机切换路由时保留真实桌面实例。
      element: <DesktopExperience />,
      children: [
        { index: true, element: <StartScreen /> },
        // 桌面由父组件渲染；此路由只标记开机完成，避免再次挂载 Home。
        { path: 'home', element: <></> }
      ]
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ],
  { future: { v7_relativeSplatPath: true } }
);

export default router;
