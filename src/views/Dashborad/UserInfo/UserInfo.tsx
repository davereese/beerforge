import React from 'react';

import styles from './UserInfo.module.scss';
import Avatar from '../../../components/Avatar/Avatar';

interface Props {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    brewCount: number;
    badgeCount: number;
  },
  brewsNum: number,
}

function UserInfo({
  user,
  brewsNum
}: Props) {

  return(
    <div className={styles.user}>
      <div className={styles.avatarContainer}>
      {user.username && <Avatar user={user} />}
      </div>
      <div className={styles.infoContainer}>
        {user.username && <h1 className={styles.infoContainer__header}>
          {user.username ? user.username : `${user.first_name} ${user.last_name}`}
        </h1>}
        <p className={styles.infoContainer__stats}>
          Beers Brewed: <span>{brewsNum ? brewsNum : 0}</span> 
          {/* Badges Earned: <span>{user.badges ? user.badges : 0}</span> */}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;