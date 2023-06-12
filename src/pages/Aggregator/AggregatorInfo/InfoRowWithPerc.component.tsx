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
  hidden,
}: InfoRowWithPercProps) => {
  const isUpdate = !value || state === 'loading';
  return (
    <>
      <Typography
        sx={{
          textAlign: 'right',
          fontWeight: 600,
          fontSize: 12,
          visibility: hidden ? 'hidden' : 'visible',
        }}
      >
        {label}:
      </Typography>
      {isUpdate ? (
        <Skeleton
          sx={{
            height: '1em',
            width: '100%',
            visibility: hidden ? 'hidden' : 'visible',
          }}
        />
      ) : (
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: 12,
            visibility: hidden ? 'hidden' : 'visible',
          }}
        >
          {value} {unit} {calculatePercStr(value, total)}
        </Typography>
      )}
    </>
  );
};

function calculatePercStr(value?: string, total?: string): string {
  console.log(value,total);
  if (Number(total) === 0) return '';
  const tv = Number(value ?? '');
  const tt = Number(total ?? '');
  const p = Math.round((10000 * tv) / tt) / 100;
  return p > 0 ? `(${p}%)` : '';
}
