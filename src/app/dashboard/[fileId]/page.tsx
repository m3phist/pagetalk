import ChatWrapper from '@/components/chat/ChatWrapper';
import { PdfRenderer } from '@/components/PdfRenderer';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { auth } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {
    fileId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileId } = params;

  const { userId } = auth();

  if (!userId) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) notFound();

  const plan = await getUserSubscriptionPlan();

  console.log(file);

  return (
    /* 3.5rem to offset navbar height */
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/* right side */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper isSubscribed={plan.isSubscribed} fileId={fileId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
