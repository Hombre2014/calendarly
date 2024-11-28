import { requireUser } from '../lib/hooks';

const DashboardPage = async () => {
  const session = await requireUser();

  return (
    <div>
      <h1>DashboardPage</h1>
    </div>
  );
};

export default DashboardPage;
