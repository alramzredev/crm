import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Shared/Icon';

export default ({ text, link, icon }) => {
  return (
    <Link
      href={route(link)}
      className="group flex items-center py-3 text-indigo-100 hover:text-white focus:text-white"
    >
      <Icon
        name={icon}
        className="mr-3 w-6 h-6 text-indigo-400 group-hover:text-white group-focus:text-white fill-current"
      />
      {text}
    </Link>
  );
};
