import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Shared/Icon';

export default ({ text, link, icon }) => {
  const { url } = usePage().props;

  const isActive = () => {
    try {
      const routeUrl = route(link);
      return url && url.startsWith(routeUrl);
    } catch (e) {
      return false;
    }
  };

  const active = isActive();

  return (
    <Link
      href={route(link)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        active
          ? 'bg-white text-indigo-900 shadow-lg'
          : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
      }`}
    >
      <Icon
        name={icon}
        className={`w-5 h-5 flex-shrink-0 fill-current ${
          active ? 'text-indigo-600' : 'text-indigo-300 group-hover:text-white'
        }`}
      />
      <span className="flex-1 text-left font-medium text-sm">{text}</span>
    </Link>
  );
};
