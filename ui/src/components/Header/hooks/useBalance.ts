import { useQuery } from 'react-query';
import fetchBalance from '../fetchBalance';

function useBalance() {
  return useQuery('balance', fetchBalance);
}
export default useBalance;
