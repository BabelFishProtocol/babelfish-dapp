import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { AgregatorComponent } from './Agregator.component';
import { AgregatorFormValues } from './Agregator.types';

const mockAvailableBalance = '81.123';

export const AgregatorContainer = () => {
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  // TODO: use useCallback here
  const getTokenAvaliableBalance = () => {
    // todo: implement
    setAvailableBalance(utils.parseEther(mockAvailableBalance));
  };

  const getReceiveAmount = (sendAmount: string) =>
    // todo: implement
    utils.formatUnits(
      utils
        .parseUnits(sendAmount)
        .mul(BigNumber.from(95))
        .div(BigNumber.from(100))
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
