/* eslint-disable no-useless-constructor */
import React from 'react';

import PageContainer from './PageContainer';
import Button from './Button';
import EditableText from './EditableText';
import EditableAccountIcon from './EditableAccountIcon';
import AccountIcon from './AccountIcon';
import Box from './Box';

import styles from './ProjectView.css';
import localization from '../localization';
import backgroundSrc from '../../resources/dimmig_skog_svartvit_display.jpg';

const BACKGROUND_STYLE = {
  backgroundImage: `url(${backgroundSrc})`
};

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
  onUpdateInfo,
  onUpdateImage
}) {
  const {
    title,
    description,
    author,
    community,
    nation,
    image,
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
        <Button
          flat
          className={styles.file}
          onClick={goUp}
          label={localization.project_view_go_up}
        >
          <i className="fas fa-folder" />
          {` ../`}
        </Button>
      </div>
    ) : null;

  const saveForm = writable ? null : (
    <label htmlFor="save_project_checkbox">
      <input
        id="save_project_checkbox"
        type="checkbox"
        checked={!!isSaved}
        onChange={({ target }) => onSetSaved(target.checked)}
      />
      {localization.project_view_save_locally}
    </label>
  );

  const peersLabel = numPeers ? `(${numPeers})` : '';

  const titleElement = writable ? (
    <EditableText
      value={title}
      onUpdate={value => onUpdateInfo('title', value)}
    />
  ) : (
    title
  );

  return (
    <PageContainer style={BACKGROUND_STYLE} contentClass={styles.content}>
      <Box className={styles.files}>
        <h3>
          {titleElement} {subpath} {peersLabel}
        </h3>
        {upButton}
        {files.map(({ stat, name }) => {
          const isDirectory = stat.isDirectory();
          const endSlash = isDirectory ? '/' : '';
          const icon = isDirectory ? (
            <i className="fas fa-folder" />
          ) : (
            <i className="fas fa-file" />
          );
          const onClick = isDirectory
            ? () => onNavigateTo(name)
            : () => onDownloadFile(name);
          const onClickDelete = () => onDeleteFile(name);
          const deleteButton =
            !isDirectory && writable ? (
              <Button
                flat
                type="button"
                className={styles.filedelete}
                onClick={onClickDelete}
                label={localization.project_view_delete_file}
              >
                <i className="fas fa-trash" />
              </Button>
            ) : null;
          const downloadIndicator =
            stat.isDownloaded && !writable ? (
              <i
                className="fas fa-file-download"
                title={localization.project_view_downloaded}
                aria-label={localization.project_view_downloaded}
              />
            ) : null;

          return (
            <div key={name} className={styles.filecontainer}>
              <Button
                flat
                className={styles.file}
                onClick={onClick}
                label={`${localization.project_view_open_file} ${name}`}
              >
                {icon}
                {` /${name}${endSlash}`}
              </Button>
              {deleteButton}
              {downloadIndicator}
            </div>
          );
        })}
        <div>{addButton}</div>
      </Box>
      <Box className={styles.info}>
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
        <ImageInfoItem
          image={image}
          onUpdate={onUpdateImage}
          writable={writable}
        />
        {saveForm}
      </Box>
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

function ImageInfoItem({ image, onUpdate, writable }) {
  if (writable) {
    return <EditableAccountIcon image={image} onChange={onUpdate} />;
  }

  if (!image) return null;

  return <AccountIcon image={image} />;
}
