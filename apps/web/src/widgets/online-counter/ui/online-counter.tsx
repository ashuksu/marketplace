'use client';

import { useEffect, useState } from 'react';

import { socket } from '@/shared/lib/socket';
import { Badge } from '@/shared/ui/badge';

export function OnlineCounter() {
  const [onlineCount, setOnlineCount] = useState<number>(0);

  useEffect(() => {
    socket.connect();

    function onCountChange(count: number) {
      setOnlineCount(count);
    }

    socket.on('online:count', onCountChange);

    return () => {
      socket.off('online:count', onCountChange);
      socket.disconnect();
    };
  }, []);

  return (
    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 font-normal">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>Online on site: {onlineCount}</span>
    </Badge>
  );
}
