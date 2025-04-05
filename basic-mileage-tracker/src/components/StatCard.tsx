// src/components/StatCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';

export interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  link?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, link, linkText }) => (
  <Card>
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      </div>
      <div className="flex items-baseline">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {link && (
          <Link to={link} className="ml-auto text-blue-500 hover:text-blue-700 text-sm">
            {linkText || 'View All'}
          </Link>
        )}
      </div>
    </div>
  </Card>
);

export default StatCard;