import { useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import contentCopy from '../../assets/icons/content-copy.svg';
import contentCopyDone from '../../assets/icons/done.svg';
import { PrettyTxProps } from './PrettyTx.types';
import { prettyTx } from '../../utils/helpers';
import { useUpdatePrettyTxUrl } from './PrettyTx.hooks';

const iconData = {
  copy: {
    text: 'Copy hash number',
    url: contentCopy,
  },
  done: {
    text: 'Copied',
    url: contentCopyDone,
  },
};

export const PrettyTx = ({
  value,
  color = 'primary',
  variant = 'body2',
}: PrettyTxProps) => {
  const [isCopyClicked, setClickActive] = useState(false);

  const currentIconData = iconData[isCopyClicked ? 'done' : 'copy'];

  const handleClick = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(String(value));
      setClickActive(true);
    }
  };

  const url = useUpdatePrettyTxUrl(String(value));
  const linkData = url && {
    href: url,
    target: '_blank',
    rel: 'noreferrer noopener',
  };

  return (
    <Tooltip
      arrow
      onClose={() => setClickActive(false)}
      title={
        <Typography
          variant="body2"
          color={color}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {value}
          <IconButton
            aria-label="copy"
            onClick={handleClick}
            sx={{
              background: 'transparent',
              borderRadius: '50%',
              p: 0.5,
              ml: 0.5,
            }}
          >
            <img
              src={currentIconData.url}
              alt={currentIconData.text}
              title={currentIconData.text}
            />
          </IconButton>
        </Typography>
      }
    >
      <Button
        size="small"
        variant="text"
        color={color}
        sx={{ textTransform: 'unset', p: 0 }}
        {...linkData}
      >
        <Typography variant={variant}>{prettyTx(String(value))}</Typography>
      </Button>
    </Tooltip>
  );
};
