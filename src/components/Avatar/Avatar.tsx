import React from 'react';

import styles from './Avatar.module.scss';

interface Props {
  user: any,
}

const colors = [
  ['#F4D03F', '#EBAF3C', '#E9662C'],
  ['#00AEA3', '#0C8D85', '#005142'],
  ['#16A05E', '#008B49', '#00540D'],
  ['#E9662C', '#D44B11', '#A60000'],
  ['#FFFFFF', '#DAE7E6', '#224749'],
  ['#191919', '#505050', '#FFFAE7'],
];

function Avatar({
  user
}: Props) {
  let image;

  if (user) {
    const mask = `mask${user.id}`;
    const schema = user.icon_schema;
    const index = schema[2];
    const colorScheme = colors[index];
  
    image = <svg width="100%" height="100%" viewBox={`${schema[0]} ${schema[1]} 80 80`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect mask={`url(#${mask})`} width="216" height="216" fill={colorScheme[0]} />
        <g opacity="0.5">
          <mask id={mask} mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="216" height="216">
            <circle cx={schema[0] + 40} cy={schema[1] + 40} r="40" fill="#000" />
          </mask>
          <g mask={`url(#${mask})`}>
            <path d="M201.866 69.1425L106.348 61.4545C102.709 61.1616 99.088 62.2082 96.1665 64.3975V64.3975C93.3512 66.5071 89.8829 67.5582 86.3701 67.3664L23 63.9054C24.6582 86.7054 61.2188 98.5476 109.637 114.133C111.101 114.604 111.598 116.433 110.565 117.572L85.468 145.265C84.2061 146.658 85.2486 148.882 87.126 148.802L176.456 145.033C179.371 144.91 181.294 141.946 180.221 139.233C178.491 134.857 176.035 128.61 173.955 123.186C168.245 108.301 166.158 100.999 203.478 74.6251C205.825 72.9668 204.738 69.2265 201.866 69.1425Z" fill={colorScheme[1]} />
            <path d="M88.4277 107.223C125.472 91.7279 164.39 79.8213 204.747 71.9377C204.824 72.92 204.438 73.9467 203.478 74.625C166.158 100.999 168.245 108.301 173.955 123.186C176.035 128.61 178.491 134.857 180.221 139.233C181.294 141.946 179.371 144.91 176.456 145.033L87.1261 148.802C85.2486 148.882 84.2062 146.658 85.468 145.265L110.565 117.572C111.598 116.433 111.101 114.604 109.637 114.133C102.265 111.76 95.1685 109.474 88.4277 107.223Z" fill={`url(#paint${mask}_linear)`}/>
          </g>
        </g>
        <defs>
          <linearGradient id={`paint${mask}_linear`} x1="137.941" y1="90.1765" x2="137.941" y2="139.238" gradientUnits="userSpaceOnUse">
            <stop stopColor={colorScheme[2]} />
            <stop offset="1" stopColor={colorScheme[1]} />
          </linearGradient>
        </defs>
      </svg>;
  };

  return(
    <div
      className={styles.avatar}
    >{image}</div>
  );
};

export default Avatar;