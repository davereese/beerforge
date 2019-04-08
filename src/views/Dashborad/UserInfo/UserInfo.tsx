import React from 'react';

import styles from './UserInfo.module.scss';
import Avatar from '../../../components/Avatar/Avatar';

interface Props {
  user: {
    firstName: string;
    lastName: string;
    beers: number;
    badges: number;
    avatar?: string;
  }
}

function UserInfo({
  user
}: Props) {
  return(
    <div className={styles.user}>
      <div className={styles.avatarContainer}>
        <Avatar currentUser={true} />
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.infoContainer__header}>{user.firstName} {user.lastName}</h1>
        <p className={styles.infoContainer__stats}>
          Beers Brewed: <span>{user.beers}</span> 
          Badges Earned: <span>{user.badges}</span>
        </p>
      </div>
    </div>
  );
};

export default UserInfo;