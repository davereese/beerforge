import React from 'react';

import styles from './Avatar.module.scss';
import userAvatar from '../../resources/images/user-default.svg';
import otherUserAvatar from '../../resources/images/other-user-default.svg';

interface Props {
  currentUser: boolean,
  path?: string,
}

function Avatar({
  currentUser,
  path
}: Props) {

  let image;
  if (path) {
    image = path;
  } else if (currentUser) {
    image = userAvatar;
  } else {
    image = otherUserAvatar;
  }

  return(
    <div
      className={styles.avatar}
      style={{backgroundImage: `url(${image})`}}
    ></div>
  );
};

export default Avatar;