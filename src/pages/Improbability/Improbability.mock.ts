import { tokens } from '../../config/tokens';

export const mockCoins = Object.values(tokens).map((token) => ({
  ...token,
  apr: 15,
  pool: 20,
  balance: '20',
  earnedInKind: '-',
  earnedInXusd: '-',
}));
