import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  }, {
    path: '/dashboard',
    element: <Root /> // replace with Dashboard page
  }, {
    path: '/users',
    element: <Root /> // replace with Users page
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
