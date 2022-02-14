import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { Dropdown } from '../../components/Dropdown/Dropdown.component';
import { PageView } from '../../components/PageView/PageView.component';
import { InputWithButtonPillGroup } from '../../components/InputPillGroup/InputWithButtonPillGroup.component';
import { BaseChainType, baseChains } from '../../config/chains';
import { tokensCatalog, TokenTypeBase } from '../../config/tokens';

export const AgregatorComponent = () => {
  const [selectedChain, setSelectedChain] = useState<BaseChainType>();
  const [selectedBasset, setSelectedBasset] = useState<TokenTypeBase>();

  const handleChainChange = (newChainId: string) => {
    setSelectedChain(baseChains.find(({ id }) => id === newChainId));
    setSelectedBasset(undefined);
  };

  const handleBassetChange = (newBassetId: string) => {
    // @ts-ignore
    setSelectedBasset(tokensCatalog[newBassetId]);
  };

  return (
    <PageView
      title={
        <Box
          sx={{
            py: 2.5,
            px: 3,
          }}
        >
          <Typography variant="h2">Starting chain</Typography>
        </Box>
      }
    >
      <Box
        sx={{
          width: 310,
          mx: 'auto',
        }}
      >
        <Dropdown
          label="Select Network"
          placeholder="Select Chain"
          itemSelectedId={selectedChain?.id}
          setItemSelected={handleChainChange}
          options={baseChains}
        />
        {}
        <Dropdown
          label="Select Network"
          placeholder="Select Network"
          disabled={!selectedChain}
          // @ts-ignore
          options={selectedChain ? selectedChain.bassets : []}
          itemSelected={selectedBasset}
          setItemSelected={handleBassetChange}
        />
        <InputWithButtonPillGroup
          title="Deposit amount"
          symbol="USDT"
          totalAmount={BigNumber.from(81)}
        />
      </Box>
    </PageView>
  );
};
