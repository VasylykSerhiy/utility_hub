'use client';

import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useTranslation } from 'react-i18next';

type TTableBase = React.ComponentProps<'table'>;

interface ITableWithPagination extends TTableBase {
  withPagination: true;
  page: number;
  totalPages: number;
  handlePage: (page: number) => void;
}

interface ITableWithoutPagination extends TTableBase {
  withPagination?: false;
}

type TableProps = (ITableWithoutPagination | ITableWithPagination) & {
  classNameWrapper?: string;
  isLoading?: boolean;
};

function Table({
  className,
  children,
  withPagination,
  classNameWrapper,
  isLoading,
  ...props
}: TableProps) {
  const { t } = useTranslation();
  const { page, totalPages, handlePage, ...rest } = props as ITableWithPagination;

  const setPage = (side: 'previous' | 'next') => {
    if (side === 'previous') {
      handlePage(Math.max(page - 1, 1));
    } else {
      handlePage(page + 1);
    }
  };

  return (
    <div
      data-slot='table-container'
      className={cn('relative w-full overflow-hidden rounded-xl border', classNameWrapper)}
    >
      <div className='overflow-x-auto'>
        <table
          data-slot='table'
          className={cn('w-full caption-bottom text-sm', className)}
          {...rest}
        >
          {children}
        </table>
      </div>
      {withPagination && totalPages > 1 && (
        <div className='bg-background flex items-center justify-between border-t p-4'>
          <Button
            variant='secondary'
            onClick={() => setPage?.('previous')}
            disabled={page <= 1 || isLoading}
            className='select-none'
          >
            {t('BUTTONS.PREVIOUS')}
          </Button>
          <p className='text-sm md:text-base'>
            {t('TABLE.PAGINATION', { page: page, totalPages: totalPages })}
          </p>
          <Button
            variant='secondary'
            onClick={() => setPage?.('next')}
            disabled={page >= totalPages || isLoading}
            className='select-none'
          >
            {t('BUTTONS.NEXT')}
          </Button>
        </div>
      )}
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({
  className,
  children,
  isLoading,
  noDataText,
  ...props
}: React.ComponentProps<'tbody'> & {
  isLoading?: boolean;
  noDataText?: string;
}) {
  const { t } = useTranslation();
  const noChildren = React.Children.count(children) === 0;

  return (
    <tbody
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={99999} className='text-center'>
            {t('TABLE.LOADING')}...
          </TableCell>
        </TableRow>
      ) : null}

      {noChildren && !isLoading ? (
        <TableRow>
          <TableCell colSpan={99999} className='text-center'>
            {noDataText ?? t('TABLE.NO_DATA')}
          </TableCell>
        </TableRow>
      ) : null}

      {!noChildren && !isLoading && children}
    </tbody>
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'text-foreground h-10 whitespace-nowrap px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
