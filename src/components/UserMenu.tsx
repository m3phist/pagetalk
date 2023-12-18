'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { _User } from '@/types/interfaces';
import {
  CalendarCheck2,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const UserMenu = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, isLoading } = trpc.getUserInfo.useQuery();

  return (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <DropdownMenu
          open={isOpen}
          onOpenChange={(v) => {
            setIsOpen(v);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5">
              Hello, {user?.firstName}!
              {!isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
