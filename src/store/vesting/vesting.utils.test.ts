import { mockProvider } from '../../testUtils';
import { getVesting } from './vesting.utils';

jest.mock('../../contracts/types/factories/Vesting__factory', () => ({
  Vesting__factory: {
    connect: jest.fn().mockReturnValue('mock connect'),
  },
}));

describe('getVesting', () => {
  const vestingAddress = '0x03444';

  it('returns connect method output', async () => {
    const result = getVesting(vestingAddress, mockProvider);
    expect(result).toEqual('mock connect');
  });
});
