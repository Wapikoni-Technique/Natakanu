/* eslint-disable no-useless-constructor */
import React from 'react';

import PageContainer from './PageContainer';
import Button from './Button';
import EditableText from './EditableText';

import styles from './ProjectView.css';
import localization from '../localization';

export default function ProjectView({
  projectInfo,
  files,
  subpath,
  numPeers,
  onDownloadFile,
  onAddFiles,
  onDeleteFile,
  onNavigateTo,
  onSetSaved,
  onUpdateInfo
}) {
  const {
    title,
    description,
    author,
    community,
    nation,
    writable,
    isSaved
  } = projectInfo;

  const addButton = writable ? (
    <Button onClick={() => onAddFiles()}>
      {localization.project_view_add_files}
    </Button>
  ) : null;

  function goUp() {
    onNavigateTo('..');
  }

  const upButton =
    subpath && subpath !== '/' ? (
      <div className={styles.filecontainer}>
        <button className={styles.file} onClick={goUp}>
          📁 ../
        </button>
      </div>
    ) : null;

  const saveForm = writable ? null : (
    <label>
      <input
        type="checkbox"
        checked={!!isSaved}
        onChange={({ target }) => onSetSaved(target.checked)}
      />
      {localization.project_view_save_locally}
    </label>
  );

  const peersLabel = numPeers ? `(${numPeers})` : '';

  return (
    <PageContainer
      backgroundClass={styles.background}
      contentClass={styles.content}
    >
      <div className={styles.files}>
        <h3>
          {title} /{subpath} {peersLabel}
        </h3>
        {upButton}
        {files.map(({ stat, name }) => {
          const isDirectory = stat.isDirectory();
          const endSlash = isDirectory ? '/' : '';
          const icon = isDirectory ? '📁' : '📃';
          const onClick = isDirectory
            ? () => onNavigateTo(name)
            : () => onDownloadFile(name);
          const onClickDelete = () => onDeleteFile(name);
          const deleteButton =
            !isDirectory && writable ? (
              <button className={styles.filedelete} onClick={onClickDelete}>
                🗑
              </button>
            ) : null;
          const downloadIndicator =
            stat.isDownloaded && !writable ? '💾' : null;
          return (
            <div key={name} className={styles.filecontainer}>
              <button className={styles.file} onClick={onClick}>
                {`${icon} /${name}${endSlash}`}
              </button>
              {deleteButton}
              {downloadIndicator}
            </div>
          );
        })}
        <div>{addButton}</div>
      </div>
      <div className={styles.info}>
        <dl>
          <InfoItem
            writable={writable}
            label={localization.new_project_author}
            value={author}
            onUpdate={value => onUpdateInfo('author', value)}
          />
          <InfoItem
            writable={writable}
            label={localization.new_project_community}
            value={community}
            onUpdate={value => onUpdateInfo('community', value)}
          />
          <InfoItem
            writable={writable}
            label={localization.new_project_nation}
            value={nation}
            onUpdate={value => onUpdateInfo('nation', value)}
          />
          <InfoItem
            writable={writable}
            label={localization.new_project_credits}
            value={description}
            onUpdate={value => onUpdateInfo('description', value)}
          />
        </dl>
        {saveForm}
      </div>
    </PageContainer>
  );
}

function InfoItem({ label, value, onUpdate, writable }) {
  if (writable)
    return (
      <>
        <dt>{label}</dt>
        <dd>
          <EditableText value={value} onUpdate={onUpdate} />
        </dd>
      </>
    );

  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
