// https://blog.garstasio.com/you-dont-need-jquery/ajax/

export function post(url, params = {}) {
  const xhr = new XMLHttpRequest();
  const data = paramsToData({ ...params, ...csrfParams() });

  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(data);
  return xhr;
}

export function get(url, params = {}) {
  const xhr = new XMLHttpRequest();
  const data = paramsToData({ ...params, ...csrfParams() });

  if(data) {
    xhr.open('GET', url + '?' + data);
  } else {
    xhr.open('GET', url);
  }

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();
  return xhr;
}

function paramsToData(params) {
  return Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  }).join('&');
}

function csrfParams() {
  const csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  const csrfValue = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  return { [csrfParam]: csrfValue };
}
