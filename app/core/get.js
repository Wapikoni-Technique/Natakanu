import { remote } from 'electron';

export default function getCore() {
  return remote.getGlobal('loadCore')();
}
