const { Driver } = require('./GenesisAPI');
let driver = new Driver();
driver.Connect((obj) =>
{
    driver.GetSchedule((sched) =>
    {
        console.log("Getting Schedule");
        console.log(sched);
        driver.Disconnect(() => { });
    });
});