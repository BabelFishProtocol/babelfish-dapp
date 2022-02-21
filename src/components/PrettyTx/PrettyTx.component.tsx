import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { prettyTx } from '../../utils/helpers';

import { PrettyTxProps } from './PrettyTx.types';

export const PrettyTx = ({
  value,
  color = 'primary',
  variant = 'body2',
}: PrettyTxProps) => (
  <Tooltip
    arrow
    title={
      <Typography variant="body2" color={color}>
        {value}
      </Typography>
    }
  >
    <Button
      size="small"
      variant="text"
      color={color}
      sx={{ textTransform: 'unset', p: 0 }}
    >
      <Typography variant={variant}>{prettyTx(String(value))}</Typography>
    </Button>
  </Tooltip>
);
