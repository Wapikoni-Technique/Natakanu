import React, { useState } from 'react';

import getCore from '../core/get';

import AsyncPage from './AsyncPage';

import RecentProjects from '../components/RecentProjects';
import Search from '../components/Search';

export default function RecentProjectsPage() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');

  async function onSearch(query) {
    setSearch(query);
    const core = await getCore();
    setResults([]);
    let newResults = [];

    // consume() is needed to turn fake async
    for await (const item of consume(core.search(query))) {
      newResults = newResults.concat(item);
      setResults(newResults);
    }
  }

  console.log(results, search);

  if (!search) {
    return (
      <AsyncPage promiseFn={load} watch={results.length + search}>
        {({ recent, saved, seen }) => (
          <RecentProjects
            recent={recent}
            saved={saved}
            seen={seen}
            onSearch={onSearch}
          />
        )}
      </AsyncPage>
    );
  }
  return <Search search={search} results={results} onSearch={onSearch} />;
}

async function* consume(iterator) {
  try {
    while (true) {
      const { value, done } = await iterator.next();

      if (done) break;
      yield value;
    }
  } finally {
    if (iterator.return) iterator.return();
  }
}

async function load() {
  const core = await getCore();

  const [rawRecent, rawSaved, rawSeen] = await Promise.all([
    await core.projects.getRecent(),
    await core.projects.getSaved(),
    await core.accounts.listSeen()
  ]);

  console.log('Got raw recent, fetching info');

  const [recent, saved, seen] = await Promise.all([
    await Promise.all(rawRecent.map(project => project.getInfo())),
    await Promise.all(rawSaved.map(project => project.getInfo())),
    await Promise.all(rawSeen.map(account => account.getInfo()))
  ]);

  return { recent, saved, seen };
}
