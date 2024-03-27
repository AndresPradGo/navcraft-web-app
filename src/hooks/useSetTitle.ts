import { useEffect } from 'react';

const useSetTitle = (title: string) => {
  useEffect(() => {
    document.title =
      title.trim().length > 0 ? `${title.trim()} | NavCraft` : 'NavCraft';

    return () => {
      document.title = 'NavCraft';
    };
  }, [title]);
};

export default useSetTitle;
