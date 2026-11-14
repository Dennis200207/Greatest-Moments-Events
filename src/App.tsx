import type { Theme } from './settings/types';
import { GreatestMomentsEventsWebsite } from './components/generated/GreatestMomentsEventsWebsite';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <>
      <GreatestMomentsEventsWebsite />
    </>
  ); // %EXPORT_STATEMENT%
}

export default App;
