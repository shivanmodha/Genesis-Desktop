const { Chromeless } = require('chromeless');
module.exports.Driver =  class Driver
{
    constructor()
    {
        this.Initialize();
        this.wait = 500;
    }
    Initialize()
    {
        this.adapter = new Chromeless({
            launchChrome: true
        });
        this.username = "";
        this.password = "";
    }
    async Connect(username, password, _onComplete)
    {
        this.username = username;
        this.password = password;
        let instance = await this.adapter
            .goto("https://students.sbschools.org/genesis/parents?gohome=true")
            .type(username + "@sbstudents.org", "input[name='j_username']")
            .type(password, "input[name='j_password']")
            .click("input[class='saveButton']")
            .wait(this.wait)
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
            .click("span[onClick=\"header_goToTab('studentdata&tab2=studentsummary','studentid=" + this.username + "');\"]")
            .wait(this.wait)
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
                let bypass = {
                    "ap": true,
                    "cs": true,
                    "i": true,
                    "ii": true,
                    "iii": true,
                    "iv": true,
                    "v": true,
                    "vi": true
                };
                for (let i = 1; i < rows.length; i++)
                {
                    let period = rows[i][0] + rows[i][3];
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
            });
        _onComplete(instance);
    }
    async GetDashboard(_onComplete)
    {
        let instance = await this.adapter
            .goto("https://students.sbschools.org/")
            .click("span[onClick=\"header_goToTab('studentdata&tab2=gradebook','studentid=" + this.username + "');\"]")
            .wait(this.wait)
            .evaluate(() =>
            {
                let elements = [].map.call(document.querySelectorAll('.list'), e =>
                {
                    return e;
                });
                let rows = [].map.call(elements[0].querySelectorAll('tr'), e =>
                {
                    let columns = [].map.call(e.querySelectorAll('td'), e =>
                    {
                        return e;
                    });
                    return columns;
                });
                let _return = {};
                let bypass = {
                    "ap": true,
                    "cs": true,
                    "i": true,
                    "ii": true,
                    "iii": true,
                    "iv": true,
                    "v": true,
                    "vi": true
                };
                for (let i = 1; i < rows.length; i += 2)
                {
                    let course = rows[i][0].querySelector('u').innerHTML;
                    while (course.includes("\n"))
                    {
                        course = course.replace("\n", "");
                    }
                    course = course.trim().toLowerCase();
                    while (course.includes("&amp;"))
                    {
                        course = course.replace("&amp;", "&");
                    }
                    while (course.includes("-"))
                    {
                        course = course.replace("-", ": ");
                    }
                    let split = course.split(/[ -]+/);
                    course = "";
                    for (let k = 0; k < split.length; k++)
                    {
                        if (bypass[split[k]])
                        {
                            course += split[k].toUpperCase();
                        }
                        else
                        {
                            course += split[k].substring(0, 1).toUpperCase() + split[k].substring(1);
                        }
                        if (k < split.length - 1)
                        {
                            course += " ";
                        }
                    }
                    let teacher = rows[i][1].innerHTML;
                    while (teacher.includes("\n"))
                    {
                        teacher = teacher.replace("\n", "");
                    }
                    teacher = teacher.trim();
                    let email = teacher.substring(teacher.indexOf("mailto:") + 7);
                    email = email.substring(0, email.indexOf("\""));
                    teacher = teacher.substring(0, teacher.indexOf("<br>")).trim();
                    let grade = rows[i][2].querySelector('div').innerHTML;
                    while (grade.includes("\n"))
                    {
                        grade = grade.replace("\n", "");
                    }
                    grade = eval(grade.replace("%", "").trim());
                    let letter = [].map.call(rows[i][2].querySelectorAll('td'), e =>
                    {
                        return e;
                    });
                    letter = letter[1].innerHTML;
                    while (letter.includes("\n"))
                    {
                        letter = letter.replace("\n", "");
                    }
                    letter = letter.trim();
                    let args = rows[i][0].innerHTML;
                    while (args.includes("\n"))
                    {
                        args = args.replace("\n", "");
                    }
                    while (args.includes("&amp;"))
                    {
                        args = args.replace("&amp;", "&");
                    }
                    args = args.trim();
                    args = args.substring(args.indexOf("showAssignmentsByMPAndCourse" + ("showAssignmentsByMPAndCourse").length));
                    args = args.substring(args.indexOf(",") + 1, args.indexOf(";"));  
                    args = args.replace(")", "");
                    args = args.substring(1, args.length - 1);
                    let argArr = [args.substring(0, args.indexOf(":")), args.substring(args.indexOf(":") + 1)];
                    _return[course] = {
                        teacher: teacher,
                        email: email,
                        grade: grade,
                        letter: letter,
                        args: argArr
                    };
                }
                return _return;
            });
        _onComplete(instance);
    }
    async GetClass(args, MP, _onComplete)
    {
        let instance = await this.adapter
            .goto("https://students.sbschools.org/genesis/parents?tab1=studentdata&tab2=gradebook&tab3=coursesummary&studentid=" + this.username + "&action=form&courseCode=" + args[0] + "&courseSection=" + args[1] + "&mp=" + MP)
            .wait(this.wait)
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