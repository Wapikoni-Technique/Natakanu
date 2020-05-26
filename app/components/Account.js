import React, { useState } from 'react';
import Carousel from 'react-spring-3d-carousel';

import Link from './Link';
import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import localization from '../localization';

import styles from './Account.css';

export default function Account({ accountInfo, projects, onGoCreate }) {
  const { name, image, writable } = accountInfo;
  const [currentSlide, setSlide] = useState(Math.floor(0));

  console.log({ projects });

  const newProjectButton = writable ? (
    <div className={styles.newProjectButton}>
      <Button onClick={onGoCreate}>{localization.account_new_project}</Button>
    </div>
  ) : null;

  const slides = projects.map(
    ({ key: projectKey, url, title, image: projectImage }, index) => ({
      key: projectKey,
      content: (
        <Project
          key={projectKey}
          image={projectImage}
          url={url}
          title={title}
          isCurrent={currentSlide === index}
          setActive={() => setSlide(index)}
        />
      )
    })
  );

  let mainContent = null;
  if (projects.length) {
    mainContent = (
      <div className={styles.projects}>
        <Carousel offsetRadius={3} goToSlide={currentSlide} slides={slides} />
      </div>
    );
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

function Project({ url, title, image, isCurrent, setActive }) {
  const style = {};
  if (image) {
    style.backgroundImage = `url(${image})`;
  }
  if (isCurrent) {
    return (
      <Link
        autoFocus
        className={styles.project}
        style={style}
        to={`${url}view/`}
      >
        {title}
      </Link>
    );
  }

  return (
    <button className={styles.project} style={style} onClick={setActive}>
      {title}
    </button>
  );
}
