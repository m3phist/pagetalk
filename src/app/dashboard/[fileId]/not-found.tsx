import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl  mb-6">404: This page could not be found.</h1>
      <Link
        href="/dashboard"
        className={buttonVariants({
          variant: 'outline',
          size: 'sm',
        })}
      >
        Back to dashboard
      </Link>
    </MaxWidthWrapper>
  );
}
