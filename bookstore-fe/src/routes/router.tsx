import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../pages/layouts/BaseLayout'
import UserList from '../pages/users/UserList'
import BookList from '../pages/books/BookList'
import OrderList from '../pages/orders/OrderList'
import SignIn from '../pages/sign-in/Login'
import ProtectedRoute from '../components/layouts/ProtectedRoute'
import LoginRoute from '../components/layouts/LoginRoute'
import { isAuthenticated } from '../api/auth'

const handleLoginSuccess = () => {
    console.log('LOGIN SUCCESS → GO DASHBOARD');
    console.log('isAuth'+ isAuthenticated());
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: 
            <ProtectedRoute>
                <BaseLayout/>
            </ProtectedRoute>,
        
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
            <LoginRoute>
                <SignIn onSuccess={handleLoginSuccess} />
            </LoginRoute>
    },
])