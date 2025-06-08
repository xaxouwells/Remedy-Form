import React, {useCallback, useMemo, useState, memo} from 'react'

  
interface ParentProps {
    children: (events: { onClick: () => void; onHover: () => void }) => React.ReactNode;
  }
  
  export default function Parent({ children }: ParentProps) {
    const [count, setCount] = useState(0);

    const handleCount = useCallback(()=> {
        setCount((prev)=> prev+1);
    },[]);
    const events = useMemo(() => ({
      onClick: () =>  setCount((prev)=> prev+1),
      onHover: () =>  setCount((prev)=> prev+1)
    }), [handleCount]);
    const memoizedChildren = useMemo(() => children(events), [children, events]);

    return <div>
        <span>{count}</span>
       {memoizedChildren}
    </div>;
  }
  
  // Usage
