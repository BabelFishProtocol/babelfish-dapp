import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { prettyTx } from '../../utils/helpers';

import { PrettyTxProps } from './PrettyTx.types';

export const PrettyTx = ({ value }: PrettyTxProps) => (
  <Tooltip
    arrow
    title={
      <Typography variant="body2" color="primary">
        {value}
      </Typography>
    }
  >
    <Button size="small" variant="text" sx={{ textTransform: 'unset' }}>
      <Typography variant="body2">{prettyTx(String(value))}</Typography>
    </Button>
  </Tooltip>
);
