'use client';

import { useState } from 'react';

import type { IAuditLogEntry } from '@workspace/types';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getPropertyAuditLog } from '@/hooks/use-property';

const PAGE_SIZE = 20;

/** UA: Журнал аудиту по об'єкту (лише для власника). EN: Property audit log (owner only). */
const PropertyAuditLog = ({ propertyId }: { propertyId: string }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = getPropertyAuditLog(propertyId, page, PAGE_SIZE);

  const actionLabel = (action: string): string => {
    const key = `AUDIT.ACTION.${action}`;
    const translated = t(key);
    return translated !== key ? translated : t('AUDIT.ACTION_UNKNOWN');
  };

  const userDisplay = (entry: IAuditLogEntry): string => {
    const email = entry.details && typeof entry.details.actor_email === 'string' ? entry.details.actor_email : null;
    return email ?? (entry.userId ? `${entry.userId.slice(0, 8)}…` : '—');
  };

  const detailsSummary = (entry: IAuditLogEntry): string => {
    const d = entry.details;
    if (!d || typeof d !== 'object') return '';
    const parts: string[] = [];
    if (typeof d.email === 'string') parts.push(d.email);
    if (typeof d.role === 'string') parts.push(d.role);
    if (typeof d.name === 'string') parts.push(d.name);
    if (typeof d.date === 'string') parts.push(d.date);
    return parts.join(' · ') || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('AUDIT.TITLE')}</CardTitle>
        <p className='text-muted-foreground text-sm'>{t('AUDIT.DESCRIPTION')}</p>
      </CardHeader>
      <CardContent>
        <Table
          withPagination
          handlePage={setPage}
          page={page}
          totalPages={data?.totalPages ?? 1}
        >
          <TableHeader>
            <TableRow>
              <TableHead>{t('AUDIT.DATE')}</TableHead>
              <TableHead>{t('AUDIT.USER')}</TableHead>
              <TableHead>{t('AUDIT.ACTION')}</TableHead>
              <TableHead>{t('AUDIT.DETAILS')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {(data?.data ?? []).length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='text-muted-foreground text-center'>
                  {t('AUDIT.NO_ENTRIES')}
                </TableCell>
              </TableRow>
            ) : (
              (data?.data ?? []).map((entry: IAuditLogEntry) => (
                <TableRow key={entry.id}>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(entry.createdAt), 'dd.MM.yyyy HH:mm')}
                  </TableCell>
                  <TableCell
                    className='font-mono text-muted-foreground text-xs'
                    title={typeof entry.details?.actor_email === 'string' ? entry.details.actor_email : entry.userId}
                  >
                    {userDisplay(entry)}
                  </TableCell>
                  <TableCell>{actionLabel(entry.action)}</TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {detailsSummary(entry)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PropertyAuditLog;
