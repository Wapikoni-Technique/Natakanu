First, you need to install node.js. Goto: https://nodejs.org/en/
Then, install yarn. https://yarnpkg.com/lang/en/docs/install/#windows-stable
Then, call yarn from root folder.
Finally, call yarn dev to start the application in dev mode.

---

## Milestones / Deliverables

### 1. Basic file sharing

- [ ] Have structure for localizing the app
  - Initially have an English version, maybe start translations to french right away?
- [ ] Look into existing component framework to customize or start our own?
- [] Figure out how the Node.js part with the Dat code will interface with the front-end window - Custom RPC over the existing electron stuff?
  - Is there a library to proxy objects?
  - Will this run in the background or only while the main window is open?
  - Will there be a system tray icon?
  - What will we use to store data related to the project (indexeddb?)
- [ ] Have profile creation - Create root Dat archive using hyperdrive 10, store username in dat.json
  - Persist this archvie between reboots
- [ ] Navigation with URL bar at the top?
  - Should be able to copy-paste URls, navigate to project page on invalid URL
  - Update URL as you navigate
  - Back / forward button?
  - Have custom URL scheme (natakanu://?) and register the app for it so it'll auto-open
  - Refresh button? Maybe the top level view has a `key` which is an integer that the refresh button increments to force a component reload
- [ ] Basic project list with own projects
  - Populated from archives mounted within your profile archive
- [ ] Basic project creation / Project view
  - Basic info about the project
  - Use default image or have a file selection?
  - Image should be saved as `thumbnail.png` or whatever in the project root.
  - Creates a new archive and mounts it on your main archive
  - All your projects should be mounted in `/projects/`
- [ ] File view for archive
  - Navigate through folders (updating the URL) - Basic file-add feature (navigate FS and add it to the folder)

## Internal APIs

- `const has = await hasAccount()`
- `const account = await accounts.create([name], {name})`
- `const account = await accounts.get([name])`
- `for (let account of await accounts.list())`
- `for (let project of await account.getProjects())`
- `const { name, description } = await project.getInfo()`
- `const archive = project.archive` `archive` is a Hyperdrive or `multi-hyperdrive` instance
- `for await (let project of core.findProjects())`
- `on('found-project', (project) => {})`
- `const projects = await core.projects.getRecent()`
- `const project = await account.createProject({name, description})`
- `await project.updateInfo({name, description})`
- `const project = await core.projects.get(url)`
- `for await (let peer of core.findPeers())`
- `const account = await peer.getAccount()`
