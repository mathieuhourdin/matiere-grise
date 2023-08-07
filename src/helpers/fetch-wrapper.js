export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

function request(method) {
  return (url, body) => {
    const requestOptions = {
      method
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    return fetch(import.meta.env.VITE_API_URL + url, requestOptions).then(handleResponse)
  }
}

// helper functions

/*function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore()
  const isLoggedIn = !!user?.token
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL)
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` }
  } else {
    return {}
  }
}*/
function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      if ([401, 403].includes(response.status)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
