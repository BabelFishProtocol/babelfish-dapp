import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TopInfoProps } from './TopInfo.types';

export const TopInfo = ({ data }: TopInfoProps) => (
  <Box
    sx={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      top: 0,
      left: 0,
      width: '100vw',
      color: '#000',
      zIndex: ({ zIndex }) => zIndex.appBar,
    }}
  >
    {data.map(({ description, display }) => {
      if (!display) return null;
      return (
        <Box
          sx={{
            width: '100%',
            minHeight: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: ({ palette }) => palette.background.paper,
            '&:nth-of-type(even)': {
              backgroundColor: ({ palette }) => palette.primary.main,
            },
          }}
        >
          <Typography variant="body2">{description}</Typography>
        </Box>
      );
    })}
  </Box>
);
