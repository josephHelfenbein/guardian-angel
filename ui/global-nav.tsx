'use client';

import { demos, type Item } from '#/lib/demos';
import { NextLogoDark } from '#/ui/next-logo';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export function GlobalNav() {
  return (
    <div className="fixed top-0 z-10 flex h-14 w-full items-center bg-transparent px-4 py-4">
      <ThemeToggle />
    </div>
  );
}

function GlobalNavItem({
  item,
  close,
}: {
  item: Item;
  close: () => false | void;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      onClick={close}
      href={`/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300 dark:hover:text-gray-200',
        {
          'text-gray-400 hover:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700':
            !isActive,
          'text-white': isActive,
        },
      )}
    >
      {item.name}
    </Link>
  );
}
