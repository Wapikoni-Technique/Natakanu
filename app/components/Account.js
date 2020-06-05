import React from 'react';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';
import Projects from './Projects';

import localization from '../localization';

import styles from './Account.css';

export default function Account({ accountInfo, projects, onGoCreate }) {
  const { name, image, writable } = accountInfo;

  console.log({ projects });

  const newProjectButton = writable ? (
    <div className={styles.newProjectButton}>
      <Button onClick={onGoCreate}>{localization.account_new_project}</Button>
    </div>
  ) : null;

  let mainContent = null;
  if (projects.length) {
    mainContent = <Projects projects={projects} />;
  } else if (writable) {
    mainContent = (
      <section className={styles.noProjects}>
        <p>{localization.account_no_projects_self_1}</p>
        <p>{localization.account_no_projects_self_2}</p>
      </section>
    );
  } else {
    mainContent = (
      <section className={styles.noProjects}>
        {localization.account_no_projects_other}
      </section>
    );
  }

  return (
    <PageContainer backgroundClass={styles.background}>
      <div className={styles.accountInfo}>
        <AccountIcon image={image} name={name} />
        <div className={styles.accountName}>{name}</div>
      </div>
      {mainContent}
      {newProjectButton}
    </PageContainer>
  );
}
