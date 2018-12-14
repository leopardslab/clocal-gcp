#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const figlet = () => {
    return chalk.cyan("\n"+
    "____ _    ____ ____ ____ _       ____ ____ ___  \n"+
    "|    |    |  | |    |  | |       |    |    |  | \n"+
    "|    |    |  | |    |__| |    __ | __ |    |__] \n"+
    "|___ |___ |__| |___ |  | |___    |__] |___ |    \n"+
    "                                                \n"
  );
}
module.exports = {
  commandName: '',
  figlet:figlet,
};
