import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <MaxWidthWrapper className="mb-12 mt-20 flex flex-col items-center justify-center text-center">
      <SignIn />
    </MaxWidthWrapper>
  );
}
