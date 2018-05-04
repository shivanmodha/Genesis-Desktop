const { Driver } = require('./GenesisAPI');
const credentials = require('./credentials.json');
let driver = new Driver();
console.log("testing");
driver.Connect(credentials.username, credentials.password, (obj) =>
{
    console.log("Connection");
    driver.GetSchedule((output) =>
    {
        console.log(output);
        driver.GetClass(output[Object.keys(output)[2]].args, "MP1", (output) =>
        {
            console.log(output);
            driver.Disconnect(() => { });
        });
    });
});
