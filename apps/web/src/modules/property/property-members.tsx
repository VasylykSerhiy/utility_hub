'use client';

import { useState } from 'react';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  getPropertyMembers,
  useAddPropertyMember,
  useRemovePropertyMember,
  useUpdatePropertyMemberRole,
} from '@/hooks/use-property';
import { useModalStore } from '@/stores/use-modal-state';

type InviteBy = 'email' | 'userId';
const MEMBER_ROLES: { value: 'viewer' | 'admin'; labelKey: string }[] = [
  { value: 'viewer', labelKey: 'PROPERTY.MEMBERS.ROLE_VIEWER' },
  { value: 'admin', labelKey: 'PROPERTY.MEMBERS.ROLE_ADMIN' },
];

const PropertyMembers = ({ propertyId }: { propertyId: string }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const [inviteBy, setInviteBy] = useState<InviteBy>('email');
  const [inviteValue, setInviteValue] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'admin'>('viewer');
  const { data: members, isLoading } = getPropertyMembers(propertyId);
  const { mutateAsync: addMember, isPending: isAdding } = useAddPropertyMember();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdatePropertyMemberRole();
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemovePropertyMember();

  const handleInvite = async () => {
    const trimmed = inviteValue.trim();
    if (!trimmed) {
      toast.error(
        inviteBy === 'email'
          ? t('PROPERTY.MEMBERS.EMAIL_REQUIRED')
          : t('PROPERTY.MEMBERS.USER_ID_REQUIRED'),
      );
      return;
    }
    try {
      await addMember({
        propertyId,
        ...(inviteBy === 'email' ? { email: trimmed } : { userId: trimmed }),
        role: inviteRole,
      });
      setInviteValue('');
      toast.success(t('PROPERTY.MEMBERS.INVITE_SUCCESS'));
    } catch (e) {
      const msg = (e as Error)?.message ?? '';
      const key = msg.toLowerCase().includes('not found')
        ? 'PROPERTY.MEMBERS.USER_NOT_FOUND'
        : 'PROPERTY.MEMBERS.INVITE_ERROR';
      toast.error(t(key));
    }
  };

  const handleRemoveClick = (memberUserId: string, displayName: string) => {
    openModal('alertModal', {
      title: t('PROPERTY.MEMBERS.REMOVE_CONFIRM_TITLE'),
      message: t('PROPERTY.MEMBERS.REMOVE_CONFIRM_MESSAGE', { name: displayName }),
      actions: [
        {
          children: t('BUTTONS.DELETE'),
          variant: 'destructive',
          isLoading: isRemoving,
          onClick: async () => {
            try {
              await removeMember({ propertyId, memberUserId });
              closeModal();
              toast.success(t('PROPERTY.MEMBERS.REMOVE_SUCCESS'));
            } catch (err) {
              toast.error((err as Error)?.message ?? t('PROPERTY.MEMBERS.REMOVE_ERROR'));
            }
          },
        },
        {
          children: t('BUTTONS.CANCEL'),
          variant: 'default',
          onClick: closeModal,
        },
      ],
    });
  };

  const handleRoleChange = async (memberUserId: string, newRole: 'viewer' | 'admin') => {
    try {
      await updateRole({ propertyId, memberUserId, role: newRole });
      toast.success(t('PROPERTY.MEMBERS.ROLE_UPDATE_SUCCESS'));
    } catch (e) {
      toast.error((e as Error)?.message ?? t('PROPERTY.MEMBERS.ROLE_UPDATE_ERROR'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('PROPERTY.MEMBERS.TITLE')}</CardTitle>
        <p className='text-muted-foreground text-sm'>{t('PROPERTY.MEMBERS.DESCRIPTION')}</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap items-end gap-2'>
          <Select
            value={inviteBy}
            onValueChange={(v: InviteBy) => {
              setInviteBy(v);
              setInviteValue('');
            }}
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='email'>{t('PROPERTY.MEMBERS.BY_EMAIL')}</SelectItem>
              <SelectItem value='userId'>{t('PROPERTY.MEMBERS.BY_USER_ID')}</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={
              inviteBy === 'email'
                ? t('PROPERTY.MEMBERS.EMAIL_PLACEHOLDER')
                : t('PROPERTY.MEMBERS.USER_ID_PLACEHOLDER')
            }
            value={inviteValue}
            onChange={e => setInviteValue(e.target.value)}
            type={inviteBy === 'email' ? 'email' : 'text'}
            className='min-w-[200px] flex-1'
          />
          <Select value={inviteRole} onValueChange={(v: 'viewer' | 'admin') => setInviteRole(v)}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBER_ROLES.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  {t(r.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleInvite} disabled={isAdding}>
            {t('PROPERTY.MEMBERS.INVITE')}
          </Button>
        </div>
        {isLoading ? (
          <p className='text-muted-foreground text-sm'>{t('LOADING')}</p>
        ) : members?.length ? (
          <ul className='divide-border divide-y rounded-md border'>
            {members.map(m => {
              const displayName = m.email ?? `${m.userId.slice(0, 8)}…`;
              return (
                <li
                  key={m.id}
                  className='flex flex-wrap items-center justify-between gap-2 px-3 py-2'
                >
                  <span className='text-sm' title={m.userId}>
                    {displayName}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        m.role === 'admin'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {t(m.role === 'admin' ? 'PROPERTY.MEMBERS.ROLE_ADMIN' : 'PROPERTY.MEMBERS.ROLE_VIEWER')}
                    </span>
                    <Select
                      value={m.role}
                      onValueChange={(v: 'viewer' | 'admin') => handleRoleChange(m.userId, v)}
                      disabled={isUpdatingRole}
                    >
                      <SelectTrigger className='h-8 w-[100px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBER_ROLES.map(r => (
                          <SelectItem key={r.value} value={r.value}>
                            {t(r.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemoveClick(m.userId, displayName)}
                      disabled={isRemoving}
                    >
                      {t('BUTTONS.DELETE')}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='text-muted-foreground text-sm'>{t('PROPERTY.MEMBERS.NO_MEMBERS')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyMembers;
