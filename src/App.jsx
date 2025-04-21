import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import './App.css';
import ContactPage from './components/ContactPage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import Create_User from './components/Create_User';
import EmployeePage from './components/EmployeeInfoPage';
import { UserProvider } from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import UnassignedUsersList from './components/UnassignedUsersList';
import OrdersList from './components/OrdersList'
import OrderForm from './components/OrderForm';
import FileUpload from './components/FileUpload';

import ExportOrdersButton from './components/ExportOrdersButton';
import ItemsTable from './components/ItemsTable';
function App() {
  

  return (
    <>
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<SignUpPage />}></Route>
                  <Route path="/login" element={<LoginPage />}></Route>
                  <Route path="/home" element={<HomePage />}></Route>
                  <Route path="/signup" element={<SignUpPage />}></Route>
                  <Route path="/orderform" element={<OrderForm />}></Route>
                      <Route path="/orderlist" element={<OrdersList isAdmin={ true} />}></Route>
                  <Route path="/upload-orders" element={<FileUpload / >}></Route>
                  <Route path="/about" element={<AboutPage />}></Route>
                  <Route path="/exportOrdersButton" element={<ExportOrdersButton /> }></Route>
                  <Route path="/services" element={<ServicesPage />}></Route>
                  <Route path="/contacts" element={<ContactPage />}></Route>

                  <Route
                       path="/unassigned_user"
                        element={
                            <ProtectedRoute requiredRoles={['admin', 'manager']}>
                                <UnassignedUsersList />
                            </ProtectedRoute>
                          }
                  />
                  <Route path="/employeeinfo" element={<EmployeePage />}></Route>
                  <Route
                       path="/create_user/:userId"
                       element={
                          <ProtectedRoute requiredRoles={['admin', 'manager']}>
                              <Create_User />
                          </ProtectedRoute>
                          }
                      />
                  <Route path="/orders/get_items" element={<ItemsTable isAdmin={true} isManager={true} /> }></Route>
              </Routes>

          </Router>
      </UserProvider>
    </>
  )
}

export default App
