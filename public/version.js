fetch('./version.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('version-info').innerText = 
      `Version: ${data.version} | Build Date: ${data.buildDate}`;
  })
  .catch(error => console.error('Error loading version:', error));