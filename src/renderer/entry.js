require('./lib/events/click')
require('./lib/events/ipc')

const { ipcRenderer } = require('electron');
let employee_id
let process_id
let flow_id

ipcRenderer.on('protocolUrl', (event, url) => {
    console.log('Received URL:', url);
    //get the values of employee_id and process_id from the url using string manipulation. the url is like myapp-protocol://action?employee_id=value1&process_id=value2
    let myURL = new URL(url);
    let params = new URLSearchParams(myURL.search);
    empId = params.get('empId');
    processId = params.get('processId');
    flowId = params.get('flowId');

    console.log(empId, processId, flowId);
    
    // Display the URL in your HTML
    document.getElementById('empId').textContent = empId;
    document.getElementById('processId').textContent = processId;
    document.getElementById('flowId').textContent = flowId;
});

ipcRenderer.on('server-ready', () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    console.log("Uvicorn is ready!");
  });
