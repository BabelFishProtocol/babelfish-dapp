import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentChainSelector } from '../../store/app/app.selectors';
import { isRskAddress } from '../../utils/helpers';

export const useUpdatePrettyTxUrl = (hashValue: string) => {
  const currentChain = useSelector(currentChainSelector);
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    if (currentChain?.blockExplorerUrls && hashValue.length) {
      const subpage = isRskAddress(hashValue.toString()) ? 'address' : 'tx';
      setUrl(`${currentChain.blockExplorerUrls[0]}/${subpage}/${hashValue}`);
    }
  }, [currentChain, hashValue]);

  return url;
};
