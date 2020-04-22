/* eslint-disable no-useless-constructor */
import React from 'react';

import PageContainer from './PageContainer';
import Button from './Button';

import styles from './ProjectView.css';

export default function ProjectView({
  projectInfo,
  files,
  onDownloadFile,
  onAddFiles,
  onDeleteFile
}) {
  const {
    title,
    description,
    author,
    community,
    nation,
    writable
  } = projectInfo;

  const addButton = writable ? (
    <Button onClick={() => onAddFiles()}>Add File</Button>
  ) : null;

  return (
    <PageContainer
      backgroundClass={styles.background}
      contentClass={styles.content}
    >
      <div className={styles.files}>
        <h3>{title}</h3>
        {files.map(({ stat, name }) => {
          const isDirectory = stat.isDirectory();
          const endSlash = isDirectory ? '/' : '';
          const icon = isDirectory ? '📁' : '📃';
          const onClick = isDirectory
            ? () => false
            : () => onDownloadFile(name);
          const onClickDelete = () => onDeleteFile(name);
          const deleteButton =
            !isDirectory && writable ? (
              <button className={styles.filedelete} onClick={onClickDelete}>
                🗑
              </button>
            ) : null;
          return (
            <div key={name} className={styles.filecontainer}>
              <button
                className={styles.file}
                onClick={onClick}
              >{`${icon} /${name}${endSlash}`}</button>
              {deleteButton}
            </div>
          );
        })}
        <div>{addButton}</div>
      </div>
      <div className={styles.info}>
        <dl>
          <dt>Author</dt>
          <dd>{author}</dd>
          <dt>Community</dt>
          <dd>{community}</dd>
          <dt>Nation</dt>
          <dd>{nation}</dd>
          <dt>Credits</dt>
          <dd>{description}</dd>
        </dl>
      </div>
    </PageContainer>
  );
}
