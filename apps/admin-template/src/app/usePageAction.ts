import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePageAction(actionName: string, onAction: () => void) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentAction = searchParams.get('action');

  useEffect(() => {
    if (currentAction !== actionName) {
      return;
    }

    onAction();

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('action');
    setSearchParams(nextParams, { replace: true });
  }, [actionName, currentAction, onAction, searchParams, setSearchParams]);
}
