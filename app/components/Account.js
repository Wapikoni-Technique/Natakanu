import React, { Component } from 'react';
import Link from './Link';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import styles from './Account.css';

export default class Account extends Component {
  componentDidMount() {
    const { match, loadAccount } = this.props;
    const { params } = match;
    const { account } = params;
    loadAccount(account);
  }

  async loadIfWrong() {
    const { accountInfo, match, loadAccount } = this.props;
    const { params } = match;
    const { account: urlAccount } = params;

    if (this.isReloading === urlAccount) return;

    const { key } = accountInfo;

    if (urlAccount === key) return;

    console.log('Rendering wrong account');

    try {
      this.isReloading = urlAccount;
      await loadAccount(urlAccount);
    } finally {
      this.isReloading = null;
    }
  }

  render() {
    const { accountInfo, projects, push } = this.props;

    if (!accountInfo)
      return (
        <PageContainer backgroundClass={styles.background} {...this.props}>
          <i className="fas fa-spinner fa-pulse" />
        </PageContainer>
      );

    const { name, image, key } = accountInfo;

    const goToCreate = () => push(`/account/${key}/projects/new/`);

    const headerContent = <Button onClick={goToCreate}>New Project</Button>;

    this.loadIfWrong();

    return (
      <PageContainer
        backgroundClass={styles.background}
        headerContent={headerContent}
        {...this.props}
      >
        <div className={styles.accountInfo}>
          <AccountIcon image={image} />
          <div className={styles.accountName}>{name}</div>
        </div>
        <div className={styles.projects}>
          {projects.map(({ key: projectKey, url, title }) => (
            <Link
              className={styles.project}
              to={`${url}view/`}
              key={projectKey}
            >
              {title}
            </Link>
          ))}
        </div>
      </PageContainer>
    );
  }
}
