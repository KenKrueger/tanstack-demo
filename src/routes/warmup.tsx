import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/warmup')({
  component: RouteComponent,
})

function RouteComponent() {
    useEffect(() => {
        const preloadAssets = async () => {
          try {
            await Promise.all([
              import('./move-money'),
            ]);
          } catch (error) {
            console.error('Error preloading assets:', error);
          }
        };
    
        preloadAssets();
      }, []
    );
    return <></>
}
