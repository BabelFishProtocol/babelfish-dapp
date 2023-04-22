import { Box, Link } from '@mui/material';

const githubLatestReleaseUrl =
  'https://github.com/BabelFishProtocol/babelfish-dapp/releases/latest';

export const Footer = () => (
  <Box
    component="footer"
    sx={{
      height: '40px',
      display: 'flex',
      justifyContent: 'end',
      marginTop: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Link
      href={githubLatestReleaseUrl}
      target="_blank"
      color="primary"
      sx={{ marginRight: '56px' }}
    >
      Latest release
    </Link>
  </Box>
);
