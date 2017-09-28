const credentials = require('./credentials.json');
const { Chromeless } = require('chromeless');
module.exports.Driver =  class Driver
{
    constructor()
    {
        this.Initialize();
    }
    Initialize()
    {
        this.adapter = new Chromeless({
            launchChrome: true
        });
    }
    async Connect(_onComplete)
    {
        let instance = await this.adapter
            .goto("https://students.sbschools.org/genesis/parents?gohome=true")
            .type(credentials.username + "@sbstudents.org", "input[name='j_username']")
            .type(credentials.password, "input[name='j_password']")
            .click("input[class='saveButton']")
            .wait(1000)        
            .evaluate(() =>
            {
                return document.documentElement.innerHTML;
            });
        _onComplete(instance);
    }
    async GetSchedule(_onComplete)
    {
        let instance = await this.adapter
            .goto("https://students.sbschools.org/")
            .click("span[onClick=\"header_goToTab('studentdata&tab2=studentsummary','studentid=" + credentials.username + "');\"]")
            .wait(1000)
            .evaluate(() =>
            {
                let _return = {};
                let elements = [].map.call(document.querySelectorAll('.list'), e =>
                {
                    return e;
                });
                let rows = [].map.call(elements[2].querySelectorAll('tr'), e =>
                {
                    let columns = [].map.call(e.querySelectorAll('td'), e =>
                    {
                        return e.innerHTML;
                    });
                    return columns;
                });
                for (let i = 1; i < rows.length; i++)
                {
                    let period = rows[i][0] + rows[i][3];
                    let bypass = {
                        "ap": true,
                        "i": true,
                        "ii": true,
                        "iii": true,
                        "iv": true,
                        "v": true,
                        "vi": true
                    };
                    let termConvert = {
                        "FY": "Full Year"
                    }
                    let json = {
                        course: (() =>
                        {
                            let raw = rows[i][1].toLowerCase();
                            while (raw.includes("&amp;"))
                            {
                                raw = raw.replace("&amp;", "&");
                            }
                            while (raw.includes("-"))
                            {
                                raw = raw.replace("-", ": ");
                            }    
                            let split = raw.split(/[ -]+/);
                            let _return = "";
                            for (let i = 0; i < split.length; i++)
                            {
                                if (bypass[split[i]])
                                {
                                    _return += split[i].toUpperCase();
                                }    
                                else
                                {
                                    _return += split[i].substring(0, 1).toUpperCase() + split[i].substring(1);
                                }    
                                if (i < split.length - 1)
                                {
                                    _return += " ";
                                }    
                            }    
                            return _return;
                        })(),
                        teacher: rows[i][5],
                        room: rows[i][4],
                        term: rows[i][2]
                    };
                    if (!_return[period])
                    {
                        _return[period] = json;
                    }
                    else if (_return[period].length)
                    {
                        _return[period].push(json);
                    }    
                    else
                    {
                        let obj = _return[period];
                        _return[period] = [obj, json];
                    }    
                }
                return _return;
                //return document.documentElement.innerHTML;
            });
        _onComplete(instance);
    }
    async GetDashboard(_onComplete)
    {
        let instance = await this.adapter
            .goto("https://students.sbschools.org/")
            .click("span[onClick=\"header_goToTab('studentdata&tab2=gradebook','studentid=" + credentials.username + "');\"]")
            .wait(1000)
            .evaluate(() =>
            {
                return document.documentElement.innerHTML;
            });
        _onComplete(instance);
    }
    async Disconnect(_onComplete)
    {
        await this.adapter.end();
        _onComplete();
    }
}