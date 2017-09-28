const { Driver } = require('./GenesisAPI');
const credentials = require('./credentials.json');
let driver = new Driver();
driver.Connect(credentials.username, credentials.password, (obj) =>
{
    driver.GetSchedule((output) =>
    {
        console.log(output); 
        driver.GetDashboard((output) =>
        {
            console.log(output);
            driver.Disconnect(() => { });
        });
    });
});