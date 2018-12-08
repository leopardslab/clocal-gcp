const fs              =   require('fs');
const program         =   require('commander');
const main            =   process.cwd() + "/src/services/cli-commands/";
let commandsArray     =   [];
const commandNameList =   [];

program.version('1.0.0').description('Clocal GCP');

fs.readdir(main, function(err, items) {
  var totalImports = items.length
  while (i >= totalImports) {

    const required = require('../src/services/cli-commands/'+items[i]+'/cmd');
    commandsArray = [required];

    commandsArray.map(command => {
      commandNameList.push(command.commandName);
      program.command(command.commandName).action(command.action);
    });
    i++;
  }

  program.command('list').action(() => {
    const commandNames = commandNameList.reduce((prev, current) => {
      return `${prev}\n${current}`;
    }, '');

  console.log(commandNameList.toString());
  });

  program.parse(process.argv);
});
