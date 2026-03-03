import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../pages/layouts/BaseLayout'
import UserList from '../pages/users/UserList'

export const router = createBrowserRouter([
    {
        path: '/',
        element: 
            <BaseLayout/>,
        
        children: [
            {index: true, element: <UserList/>},
            // {path: 'books', element: <BookList/>},
            // {path: 'orders', element: <OrderList/>},
        ]
    }
])