const inquirer = require('inquirer')
const { checkDir } = require('./util')
const logSymbols = require('log-symbols')
module.exports = {
  selectToRemove: async (choices) => {
    return inquirer.prompt([
      {
        name: 'option',
        type: 'checkbox',
        message: 'Choose to remove:\n',
        choices
      }
    ])
  },
  mainOptions: async (choices) => {
    return inquirer.prompt([
      {
        name: 'option',
        type: 'list',
        message: 'Enter or choose a folder:\n',
        choices: [
          {
            name: 'Manually input a folder',
            value: -1
          },
          new inquirer.Separator('----PICK ONE FOLDER----'),
          ...choices
        ]
      }
    ])
  },
  askFolderName: async () => {
    return inquirer.prompt([
      {
        name: 'option',
        type: 'input',
        message: 'Input a folder path:',
        validate: (value) => (checkDir(value) ? true : logSymbols.warning + ' Please enter a valid folder path')
      }
    ])
  }
}
