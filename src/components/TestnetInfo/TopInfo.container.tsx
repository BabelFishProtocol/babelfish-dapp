import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Urls } from '../../constants';
import {
  connectorSelector,
  testnetMainnetSelector,
} from '../../store/app/app.selectors';
import { isPortis } from '../../utils/types';
import { TopInfo } from './TopInfo.component';
import { TopInfoElement } from './TopInfo.types';

export const TopInfoContainer = () => {
  const testnetMainnetFlag = useSelector(testnetMainnetSelector);
  const connector = useSelector(connectorSelector);
  const location = useLocation();
  const [isAggregatorPage, setIsAggregatorPage] = useState(false);
  useEffect(() => {
    setIsAggregatorPage(!!location.pathname.includes(Urls.Aggregator));
  }, [location]);

  const data: TopInfoElement[] = [
    {
      description:
        'Note: You are currently connected to the testnet. All coins have no value here.',
      display: testnetMainnetFlag !== 'mainnet',
    },
    {
      description:
        ' Note: You are currently connected to the Portis Wallet and Binance network is not supported here.',
      display: !!(connector && isPortis(connector)) && isAggregatorPage,
    },
  ];
  if (!data.some(({ display }) => display)) return null;

  return <TopInfo data={data} />;
};
