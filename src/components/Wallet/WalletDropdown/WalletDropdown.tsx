import { Button } from '../../Button/Button.component';
import { WalletDropdownProps } from './WalletDropdown.types';

export const WalletDropdown = ({ activate }: WalletDropdownProps) => (
  <Button
    sx={{ padding: ({ spacing }) => spacing(2, 2.5) }}
    id="wallet-selector-button"
    onClick={activate}
  >
    Connect Wallet
  </Button>
);
