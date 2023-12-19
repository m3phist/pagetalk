import { Dashboard } from '@/components/Dashboard';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect('/auth-callback?origin=dashboard');
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
};

export default Page;
