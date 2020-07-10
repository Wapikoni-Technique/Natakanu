import React from 'react';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';

import styles from './Online.css';

export default function Online({ gossiped, onGoAccount }) {
  const gossipedAccounts = gossiped.map((info, index) => (
    <Person
      key={info.key}
      info={info}
      position={index / gossiped.length}
      onGoAccount={onGoAccount}
    />
  ));

  return (
    <PageContainer
      backgroundClass={styles.background}
      contentClass={styles.mainContainer}
    >
      <section className={styles.accountContainer}>{gossipedAccounts}</section>
    </PageContainer>
  );
}

function Person({ info, position, onGoAccount }) {
  const { key, name, image } = info;
  const angle = Math.PI * 2 * position;
  const top = Math.round(yAt(angle) * 100 * 100) / 100;
  const left = Math.round(xAt(angle) * 100 * 100) / 100;

  return (
    <button
      key={key}
      onClick={() => onGoAccount(key)}
      className={styles.person}
      style={{
        top: `${top}%`,
        left: `${left}%`
      }}
      type="button"
    >
      <AccountIcon image={image} name={name} />
      <span>{name}</span>
    </button>
  );
}

function xAt(theta) {
  return Math.cos(theta);
}

function yAt(theta) {
  return Math.sin(theta);
}
