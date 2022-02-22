import React, { useCallback, useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { Button } from '../Button/Button.component';
import { TableActionsProps } from './TableActions.types';

export const TableActionsComponent = ({ actions }: TableActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Button
        variant="text"
        id="demo-positioned-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        onClick={handleClick}
      >
        ...
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              action.onClick(e);
              handleClose();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
