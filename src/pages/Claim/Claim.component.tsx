import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { PageView } from '../../components/PageView/PageView.component';
import { formatDateUTC } from '../../utils/helpers';
import { ClaimInputs, ClaimDefaultValues } from './Claim.fields';
import { ClaimComponentProps, ClaimFields } from './Claim.types';

export const ClaimComponent = ({ onSubmit }: ClaimComponentProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ClaimFields>({
    mode: 'onChange',
    defaultValues: ClaimDefaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageView
        title={
          <Typography variant="h2" padding={1}>
            CLAIM FISH BALANCE
          </Typography>
        }
      >
        <Box
          sx={{
            p: 3,
            mx: 'auto',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <ControlledCurrencyInput
            title="TOTAL FISH AVAILABLE"
            symbol="FISH"
            placeholder="0.0000"
            name={ClaimInputs.ClaimAmount}
            control={control}
          />
          <Button fullWidth type="submit" disabled={!isValid}>
            CLAIM
          </Button>
          <Typography
            variant="body2"
            sx={({ palette }) => ({
              color: palette.grey[500],
            })}
          >
            Withdrawal will be available at {formatDateUTC(new Date())}
          </Typography>
        </Box>
      </PageView>
    </form>
  );
};
