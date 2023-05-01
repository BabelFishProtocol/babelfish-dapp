import { getIncentive } from ".";

describe('getIncentive', () => {
    it('gadi test', async () => {
        const r = await getIncentive('0x4d5A316d23EBe168D8f887b4447BF8DBfA4901cc', '1000000000000');
        console.log(r);
    });
});

