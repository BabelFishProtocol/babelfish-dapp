import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import { SlippageSliderProps } from './SlippageSlider.types';

export const SlippageSlider = ({
  title,
  value,
  min,
  max,
  disabled,
  labelSx,
  onChange,
  ...inputProps
}: SlippageSliderProps) => (
    <Box sx={{ width: '100%' }}>
        <Typography variant="h3" sx={{ mb: 1.5, ...labelSx }}>
            {title}
        </Typography>
        { !disabled ? 
            <Slider
                valueLabelDisplay="auto"
                value={value}
                min={min}
                max={max}
                onChange={onChange}
                {...inputProps}
            />
            :
            <h4>N/A</h4>
        }
    </Box>
);
