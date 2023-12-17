import { SignUp } from '@clerk/nextjs';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function Page() {
  return (
    <MaxWidthWrapper className="mb-12 mt-20 flex flex-col items-center justify-center text-center">
      <SignUp />
    </MaxWidthWrapper>
  );
}
