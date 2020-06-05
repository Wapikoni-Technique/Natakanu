import React, { useState } from 'react';
import Carousel from 'react-spring-3d-carousel';

import Link from './Link';

import styles from './Projects.css';

export default function Projects({ projects }) {
  const [currentSlide, setSlide] = useState(Math.floor(0));

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

  return (
    <div className={styles.projects}>
      <Carousel offsetRadius={3} goToSlide={currentSlide} slides={slides} />
    </div>
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
