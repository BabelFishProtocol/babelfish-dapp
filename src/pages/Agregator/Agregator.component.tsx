import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Dropdown } from '../../components/Dropdown/Dropdown.component';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import { PageView } from '../../components/PageView/PageView.component';

export const AgregatorComponent = () => (
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
        label="Select network"
        placeholder="Select chain"
        options={[
          {
            value: 'ethereum',
            icon: ethereumIcon,
            name: 'ETH Mainnet',
          },
        ]}
      />
      <Dropdown
        label="Select Network"
        placeholder="Select Network"
        options={[
          {
            value: 'ethereum',
            icon: ethereumIcon,
            name: 'ETH Mainnet',
          },
        ]}
      />
    </Box>
  </PageView>
);
