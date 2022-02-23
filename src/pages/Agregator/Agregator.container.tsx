import { BigNumber, utils } from 'ethers';
import { useCallback, useState } from 'react';
import { AgregatorComponent } from './Agregator.component';
import { AgregatorFormValues } from './Agregator.types';

const mockAvailableBalance = '81.123';

export const AgregatorContainer = () => {
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  // WIP: use useCallback here
  const getTokenAvaliableBalance = useCallback(() => {
    // todo: implement
    setAvailableBalance(utils.parseEther(mockAvailableBalance));
  }, [mockAvailableBalance]);

  const getReceiveAmount = useCallback(
    (sendAmount: string) =>
      // todo: implement
      utils.formatUnits(
        utils
          .parseUnits(sendAmount)
          .mul(BigNumber.from(95))
          .div(BigNumber.from(100))
      ),
    [availableBalance]
  );
  const onSubmit = (data: AgregatorFormValues) => {
    // TODO: implement
    // eslint-disable-next-line no-console
    console.log(data);
  };
  return (
    <AgregatorComponent
      availableBalance={availableBalance}
      getTokenAvaliableBalance={getTokenAvaliableBalance}
      getReceiveAmount={getReceiveAmount}
      onSubmit={onSubmit}
    />
  );
};
