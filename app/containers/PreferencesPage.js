import React from 'react';
import { once } from 'events';

import getCore from '../core/get';

import Preferences from '../components/Preferences';
import LoaderPage from '../components/LoaderPage';

import AsyncGeneratorPage from './AsyncGeneratorPage';

export default function PreferencesPage() {
  return (
    <AsyncGeneratorPage>
      {async function* renderPreferences() {
        const core = await getCore();

        const { preferences } = core;

        async function onSetSuperPeer(superpeer) {
          console.log('Setting superpeer preference', superpeer);
          preferences.setSuperPeer(superpeer);
        }

        while (true) {
          yield (<LoaderPage />);

          const superpeer = await preferences.getSuperPeer();
          const currentPreferences = { superpeer };

          console.log('Loading latest superpeer data', currentPreferences);

          yield (
            <Preferences
              preferences={currentPreferences}
              onSetSuperPeer={onSetSuperPeer}
            />
          );

          await once(preferences, 'changed');
        }
      }}
    </AsyncGeneratorPage>
  );
}
