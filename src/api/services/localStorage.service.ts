export const userDetailsKey = 'oauth_user_details'
export const saveToLocalStorage = (key: string, value: any): void => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const getFromLocalStorage = (key: string): any | null => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

export const removeFromLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};
