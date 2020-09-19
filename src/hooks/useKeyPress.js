import { useState, useEffect } from 'react';

const useKeyPress = callback => {
  const [keyPressed, setKeyPressed] = useState();

  useEffect(() => {
    const downHandler = ({ key }) => {
      console.log(key);
      if (keyPressed !== key && (key.length === 1 || key === 'Enter')) {
        setKeyPressed(key);
        callback && callback(key);
      }
    };
    const upHandler = () => {
      setKeyPressed(null);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });
  return keyPressed;
};

export default useKeyPress;