const credentials = require('./credentials.json');
const { Chromeless } = require('chromeless');
async function run()
{
    const chromeless = new Chromeless({launchChrome: true});
    const instance = await chromeless.goto("https://students.sbschools.org/genesis/parents?gohome=true")
        .type(credentials.username + "@sbstudents.org", "input[name='j_username']")
        .type(credentials.password, "input[name='j_password']")
        .click("input[class='saveButton']")
        .wait(1000)
        .evaluate(() =>
        {
            return document.documentElement.innerHTML;            
        });
    console.log(instance);
    console.log("****************SEP****************");
    const instance2 = await chromeless
        .click("span[onClick=\"header_goToTab('studentdata&tab2=gradebook','studentid=" + credentials.username + "');\"]")
        .evaluate(() =>
        {
            return document.documentElement.innerHTML;            
        });
    console.log(instance2);
    await chromeless.end();
}
run().catch(console.error.bind(console))