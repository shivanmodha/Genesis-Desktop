const { Driver } = require('./GenesisAPI');
const credentials = require('./credentials.json');
let driver = new Driver();
driver.Connect(credentials.username, credentials.password, (obj) =>
{
    driver.GetSchedule((sched) =>
    {
        console.log(sched);
        driver.Disconnect(() => { });
    });
});