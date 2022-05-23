import MUIBreadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { UrlNames, Urls } from '../../constants';
import { BreadcrumbsProps } from './Breadcrumbs.types';
import arrowRight from '../../assets/icons/arrowRight.svg';

export const Breadcrumbs = ({ links, ...props }: BreadcrumbsProps) => (
  <Box
    sx={{
      p: 0,
      maxWidth: { xs: 1400 },
      width: '90%',
      margin: '0 auto',
    }}
  >
    <MUIBreadcrumbs
      separator={<img src={arrowRight} alt="Arrow Right" />}
      sx={{ pt: 3, pb: 3 }}
      {...props}
    >
      <MUILink
        component={Link}
        underline="hover"
        key="home"
        color="white"
        to={Urls.Dashboard}
      >
        {UrlNames.Dashboard}
      </MUILink>
      {links.map(({ title, href }, index) =>
        href ? (
          <MUILink
            component={Link}
            underline="hover"
            color="white"
            key={index}
            to={href}
          >
            {title}
          </MUILink>
        ) : (
          <Typography color="inherit" key={index}>
            {title}
          </Typography>
        )
      )}
    </MUIBreadcrumbs>
  </Box>
);
