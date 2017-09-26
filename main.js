const credentials = require('./credentials.json');
const { Chromeless } = require('chromeless');

let TestVar = 0;

class Test
{
    constructor()
    {
        this.TESTVAR = 0;
        this.run = this.run.bind(this);
        this.evaluate1 = this.evaluate1.bind(this);
        this.evaluate2 = this.evaluate2.bind(this);
    }
    async run()
    {
        const chromeless = new Chromeless({launchChrome: true});
        const instance = await chromeless.goto("https://students.sbschools.org/genesis/parents?gohome=true")
            .type(credentials.username + "@sbstudents.org", "input[name='j_username']")
            .type(credentials.password, "input[name='j_password']")
            .click("input[class='saveButton']")
            .click("span[onClick=\"header_goToTab('studentdata&tab2=gradebook','studentid=" + credentials.username + "');\"]")
            .evaluate(() =>
            {
                this.evaluate1();
                return "";
                //return document.documentElement.innerHTML;
            });
        await chromeless.end();
        console.log(instance);
        console.log(this.TESTVAR);
    }
    evaluate1()
    {
        console.log("YAS");
    }
    evaluate2()
    {
        return "TEST";
    }
}
let t = new Test();
t.run().catch(console.error.bind(console));
/*async function run()
{
    const chromeless = new Chromeless({launchChrome: true});
    const instance = await chromeless.goto("https://students.sbschools.org/genesis/parents?gohome=true")
        .type(credentials.username + "@sbstudents.org", "input[name='j_username']")
        .type(credentials.password, "input[name='j_password']")
        .click("input[class='saveButton']")
        .click("span[onClick=\"header_goToTab('studentdata&tab2=gradebook','studentid=" + credentials.username + "');\"]")
        .evaluate(evaluate1)
        .evaluate(evaluate2)
    console.log(instance);
    console.log(TestVar);
    await chromeless.end();
}
function evaluate1()
{
    TestVar = 2;
    return document.documentElement.innerHTML;
}
function evaluate2()
{
    return "TEST";
}
run().catch(console.error.bind(console))*/