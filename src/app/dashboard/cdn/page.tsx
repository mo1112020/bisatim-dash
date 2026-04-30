import { loadCdnData } from './data';
import { UploadForm } from './UploadForm';

export default async function CdnPage() {
  const files = await loadCdnData();
  return <UploadForm files={files} />;
}
