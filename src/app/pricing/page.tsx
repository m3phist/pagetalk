import { Dashboard } from '@/components/Dashboard';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { db } from '@/db';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/auth-callback?origin=pricing');
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect('/auth-callback?origin=dashboard');
  }

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or ready to take up
            a notch unlocked its full potential, we&apos;ve got you covered.
          </p>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
