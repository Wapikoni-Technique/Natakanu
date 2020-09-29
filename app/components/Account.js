import React from 'react';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';
import Projects from './Projects';
import EditableText from './EditableText';
import EditableAccountIcon from './EditableAccountIcon';

import localization from '../localization';

import styles from './Account.css';

export default function Account({
  accountInfo,
  projects,
  numPeers,
  onGoCreate,
  onUpdateName,
  onUpdateImage,
  onDestroyAccount
}) {
  const { name, image, writable } = accountInfo;

  const newProjectButton = writable ? (
    <Button onClick={onGoCreate} label={localization.account_new_project}>
      <i className="fas fa-folder-plus" />
    </Button>
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

  const peersLabel = numPeers
    ? `(${localization.project_view_connected} ${numPeers})`
    : '';

  const accountIcon = writable ? (
    <EditableAccountIcon image={image} name={name} onChange={onUpdateImage} />
  ) : (
    <AccountIcon image={image} name={name} />
  );

  const accountName = writable ? (
    <EditableText
      value={name}
      onUpdate={onUpdateName}
      className={styles.accountName}
    >
      {peersLabel}
    </EditableText>
  ) : (
    <div className={styles.accountName}>
      {name} {peersLabel}
    </div>
  );

  const destroyButton = writable ? (
    <Button red onClick={onDestroyAccount} label="Delete this account">
      <i className="fas fa-trash" />
    </Button>
  ) : null;

  const headerContent = (
    <>
      {newProjectButton}
      {destroyButton}
    </>
  );

  return (
    <PageContainer
      backgroundClass={styles.background}
      headerContent={headerContent}
    >
      <div className={styles.accountInfo}>
        {accountIcon}
        {accountName}
      </div>
      {mainContent}
    </PageContainer>
  );
}
