export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

function request(method: string) {
  return (url: string, body?: any, contentType?: string) => {
    const endcontentType = contentType ? contentType : 'application/json'
    const requestOptions: any = {
      method,
      headers: {}
    }
    if (body) {
      if (contentType && contentType === 'multipart/form-data') {
        requestOptions.body = body
      } else {
        requestOptions.headers['Content-Type'] = contentType ? contentType : 'application/json'
        requestOptions.body = JSON.stringify(body)
      }
    }
    requestOptions.headers['Authorization'] = localStorage.getItem('sessionId')
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
function handleResponse(response: any) {
  return response.text().then((text: string) => {
    //console.log("Text : ", text)
    const data = text && JSON.parse(text)

    if (!response.ok) {
      if ([401, 403].includes(response.status)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return { status: response.status, data: data }
  })
}
