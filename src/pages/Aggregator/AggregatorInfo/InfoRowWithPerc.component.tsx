import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { FiniteStates } from '../../../utils/types';

type InfoRowWithPercProps = {
  hidden?: boolean;
  label: string;
  value?: string;
  total?: string;
  unit?: String;
  state: FiniteStates;
};

export const InfoRowWithPerc = ({
  label,
  value,
  unit,
  total,
  state,
  hidden
}: InfoRowWithPercProps) => {
  const isUpdate = !value || state === 'loading';
  return hidden ? null : (
    <>
      <Typography
        sx={{
          textAlign: 'right',
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {label}:
      </Typography>
      {isUpdate ? (
        <Skeleton sx={{ height: '1em', width: '100%' }} />
      ) : (
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: 12,
          }}
        >
          {value} {unit} {calculatePercStr(value, total)}
        </Typography>
      )}
    </>
  );
};

function calculatePercStr(value?: string, total?: string): string {
  if (Number(total) === 0) return '';
  const tv = Number(value ?? '');
  const tt = Number(total ?? '');
  const p = Math.floor((10000 * tv) / tt) / 100;
  return p > 0 ? `(${p}%)` : '';
}
