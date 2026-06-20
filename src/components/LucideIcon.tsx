import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number | string;
  className?: string;
  id?: string;
}

export default function LucideIcon({ name, size = 20, className = '', id }: LucideIconProps) {
  // Safe fallbacks to prevent rendering errors if names are loaded from custom templates
  const IconComponent = (Icons as Record<string, React.ComponentType<any>>)[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} id={id} />;
}
