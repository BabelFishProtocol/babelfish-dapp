import wave1Icon from '../../../assets/icons/wave1.svg';
import wave2Icon from '../../../assets/icons/wave2.svg';
import wave3Icon from '../../../assets/icons/wave3.svg';

const waves = [wave1Icon, wave2Icon, wave3Icon];

export const WaveImage = ({ index = 1 }) => (
  <img
    src={waves[index - 1]}
    alt="wave"
    style={{
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 0,
    }}
  />
);
