export const WaveImage = ({ imgSrc = '' }) => (
  <img
    src={imgSrc}
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
