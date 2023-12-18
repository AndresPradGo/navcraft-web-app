
import { useEffect } from 'react';

const useSetTitle = (title: string) => {

    useEffect(() => {
        document.title = title;
    
        return () => {
          document.title = 'Flight Planner';
        };
      }, [title]);
}

export default useSetTitle