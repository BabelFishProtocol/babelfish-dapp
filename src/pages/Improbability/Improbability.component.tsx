import Typography from '@mui/material/Typography';
import { PageView } from '../../components/PageView/PageView.component';
import { ImprobabilityComponentProps } from './Improbability.types';

export const ImprobabilityComponent = ({
  coins,
  state,
}: ImprobabilityComponentProps) => {
  console.log(coins);
  return (
    <PageView
      title={
        <Typography variant="h2" padding={1}>
          Improbability Drive
          {coins.map((coin) => (
            <img src={coin.icon} />
          ))}
        </Typography>
      }
    >
      Improbability{' '}
    </PageView>
  );
};
