import { createContext } from 'react';

const createContextAndProvider = () => {
    const context = createContext(null);
    const provider = context.Provider;
    return {context, provider};
}

export const contexts = {
    App : createContextAndProvider(),
    Slider : createContextAndProvider(),
}
