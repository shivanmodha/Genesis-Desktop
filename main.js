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
            driver.GetClass(output[Object.keys(output)[2]].args, "MP1", (output) =>
            {
                console.log(output);
                driver.Disconnect(() => { });
            });
            /*let keys = Object.keys(output);
            let func = (i, arr, obj, _onComplete) =>
            {
                if (i < keys.length)
                {
                    let child = [];
                    driver.GetClass(obj[keys[i]].args, "MP1", (output) =>
                    {
                        child.push(output);
                        driver.GetClass(obj[keys[i]].args, "MP2", (output) =>
                        {
                            child.push(output);
                            driver.GetClass(obj[keys[i]].args, "MP3", (output) =>
                            {
                                child.push(output);
                                driver.GetClass(obj[keys[i]].args, "MP4", (output) =>
                                {
                                    child.push(output);
                                    arr.push(child);
                                    func(i + 1, arr, obj, _onComplete);
                                })
                            })
                        })
                    })
                }
                else
                {
                    _onComplete(arr);
                }
            };

            func(0, [], output, (output) =>
            {
                console.log(output);
                driver.Disconnect(() => { });
            })*/
        });
    });
});