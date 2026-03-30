import { PageLayout } from './components/PageLayout';
import { ContentRenderer } from './components/ContentRenderer';
import { Navigation } from './components/Navigation';
import contentData from './data/content.json';
import type { ContentData } from './types/content';

function App() {
  return (
    <>
      <Navigation data={contentData as ContentData} />
      <PageLayout>
        <ContentRenderer data={contentData as ContentData} />
      </PageLayout>
    </>
  );
}

export default App;