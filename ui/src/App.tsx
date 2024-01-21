import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoutesMap from './components/RoutesMap';

export default function App() {
  return (
    <>
      <ToastContainer />
      <RoutesMap />
    </>
  );
}
