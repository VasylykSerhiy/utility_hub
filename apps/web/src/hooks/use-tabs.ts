'use client';

import { useCallback, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

type Tab = {
  id: string;
  label: string;
};

type Options = {
  syncWithUrl?: boolean;
  urlKey?: string;
};

export const useTabs = (tabs: Tab[], options?: Options) => {
  const { syncWithUrl = false, urlKey = 'tab' } = options || {};
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialTabId = () => {
    if (syncWithUrl) {
      const urlTab = searchParams.get(urlKey);
      if (urlTab && tabs.some(tab => tab.id === urlTab)) {
        return urlTab;
      }
    }
    return tabs[0]?.id || '';
  };

  const [activeTabId, setActiveTabId] = useState(getInitialTabId);

  const changeTab = useCallback(
    (id: string) => {
      setActiveTabId(id);
      if (syncWithUrl) {
        const newParams = new URLSearchParams(Array.from(searchParams.entries()));
        newParams.set(urlKey, id);
        router.replace(`?${newParams.toString()}`, { scroll: false });
      }
    },
    [router, searchParams, syncWithUrl, urlKey],
  );

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return {
    activeTabId,
    activeTab,
    changeTab,
  };
};
