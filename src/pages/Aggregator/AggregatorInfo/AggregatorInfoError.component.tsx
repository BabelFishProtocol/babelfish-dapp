import { Box } from "@mui/material";

interface AggregatorInfoErrorComponentProps {
    errorMessage: string;
}

export const AggregatorInfoErrorComponent = ({
  errorMessage
}: AggregatorInfoErrorComponentProps) => (
  <Box
    style={{
        width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 230,
      color: '#EB5757',
    }}
  >
    {errorMessage}
  </Box>
);
