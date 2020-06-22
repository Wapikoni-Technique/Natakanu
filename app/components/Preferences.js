import React from 'react';

import PageContainer from './PageContainer';

import localization from '../localization';

export default function Preferences({ preferences, onSetSuperPeer }) {
  const { superpeer } = preferences;

  function onSuperPeerChange(e) {
    onSetSuperPeer(e.target.checked);
  }

  return (
    <PageContainer>
      <label htmlFor="superpeer">
        <input
          name="superpeer"
          type="checkbox"
          checked={superpeer}
          onChange={onSuperPeerChange}
        />
        {localization.preferences_superpeer}
      </label>
    </PageContainer>
  );
}
