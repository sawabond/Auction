import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoutesMap from './components/RoutesMap';
import Header from './components/Header/Header';

export default function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <RoutesMap />
    </>
  );
}
