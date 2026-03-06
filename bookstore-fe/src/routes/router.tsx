import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../pages/layouts/BaseLayout'
import UserList from '../pages/users/UserList'
import BookList from '../pages/books/BookList'
import OrderList from '../pages/orders/OrderList'
import SignIn from '../pages/sign-in/Login'

const handleLoginSuccess = () => {
    console.log('LOGIN SUCCESS → GO DASHBOARD');
    // console.log('isAuth'+ isAuthenticated());
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: 
            <BaseLayout/>,
        
        children: [
            {path: 'users', element: <UserList/>},
            {path: 'books', element: <BookList/>},
            {path: 'orders', element: <OrderList/>},
        ]
    },
    {
        path: '/',
        index: true,
        element: 
        <SignIn onSuccess={handleLoginSuccess} />,
    },
])