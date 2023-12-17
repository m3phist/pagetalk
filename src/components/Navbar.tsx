import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { UserButton, auth } from '@clerk/nextjs';
import { UserMenu } from './UserMenu';

export const Navbar = ({ userId }: { userId: string | null }) => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>pagetalk.</span>
          </Link>

          {/* TODO: Add Mobile Navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              {!userId ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      size: 'sm',
                    })}
                  >
                    Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>
                </>
              ) : (
                <div className="flex space-x-">
                  <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <div className="flex items-center gap-2">
                    <UserMenu />
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
