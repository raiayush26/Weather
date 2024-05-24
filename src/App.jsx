import React from 'react';

import Suggest from './Component/Suggestion/Suggestion';
import Color from './Component/divColor/Color';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suggest />,
  },
  {
    path: "/color",
    element: <Color />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
