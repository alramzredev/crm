import React from 'react';
import { Link } from '@inertiajs/react';
import classNames from 'classnames';

const PageLink = ({ active, label, url, preserveScroll = false, preserveState = false }) => {
  const className = classNames(
    [
      'mr-1 mb-1',
      'px-4 py-3',
      'border border-solid border-gray-300 rounded',
      'text-sm',
      'hover:bg-white',
      'focus:outline-none focus:border-indigo-700 focus:text-indigo-700'
    ],
    {
      'bg-white': active
    }
  );

  // Append tab parameter if it exists in current URL
  const urlWithTab = new URL(url, window.location.origin);
  const currentParams = new URLSearchParams(window.location.search);
  const tab = currentParams.get('tab');
  if (tab) {
    urlWithTab.searchParams.set('tab', tab);
  }

  return (
    <Link 
      className={className} 
      href={urlWithTab.href}
      preserveScroll={preserveScroll}
      preserveState={preserveState}
    >
      <span dangerouslySetInnerHTML={{ __html: label }}></span>
    </Link>
  );
};

const PageInactive = ({ label }) => {
  const className = classNames(
    'mr-1 mb-1 px-4 py-3 text-sm border rounded border-solid border-gray-300 text-gray'
  );
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: label }} />
  );
};

export default ({ links = [], preserveScroll = false, preserveState = false, showSinglePage = false }) => {
  // dont render, if there's only 1 page (previous, 1, next)
  if (!showSinglePage && links.length === 3) return null;
  return (
    <div className="flex flex-wrap mt-6 -mb-1">
      {links.map(({ active, label, url }) => {
        return url === null ? (
          <PageInactive key={label} label={label} />
        ) : (
          <PageLink 
            key={label} 
            label={label} 
            active={active} 
            url={url}
            preserveScroll={preserveScroll}
            preserveState={preserveState}
          />
        );
      })}
    </div>
  );
};
