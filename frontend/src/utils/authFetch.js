// src/utils/authFetch.js
const authFetch = (url, options = {}) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
      },
    });
  };
  
  export default authFetch;  
  