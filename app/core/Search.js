import AbortController from 'abort-controller';
import { SEARCH_LIMIT } from '../constants/core';

export default class Search {
  constructor(projects, accounts) {
    this.projects = projects;
    this.accounts = accounts;
    this.aborter = null;
  }

  async *search(query, { signal: _signal, limit = SEARCH_LIMIT } = {}) {
    let signal = _signal;
    // If there's no signal passed in
    // Use the global signal for all searches
    // Cancel the existing search, make a new one
    if (!signal) {
      if (this.aborter) this.aborter.abort();
      this.aborter = new AbortController();
      signal = this.aborter.signal;
    }

    // Generate regex for matching searches
    const regexText = query
      .split(' ')
      .reduce((result, letter) => `${result}.*${letter}`, '');
    const filter = new RegExp(regexText, 'iu');

    const recentProjects = await this.projects.getRecent();

    let i = 0;
    for (const project of recentProjects) {
      const info = await project.getInfo();
      const { title } = info;
      // If the search matches, send it out
      if (title.match(filter)) {
        yield info;
        i += 1;
        if (i > limit) return;
      }

      // If the search has been aborted, don't search more
      if (signal && signal.aborted) return;
    }
  }
}
