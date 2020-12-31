const chalk = require('chalk')
const figlet = require('figlet')
const boxen = require('boxen')

module.exports = {
  title: () => {
    const boxenOptions = {
      padding: 1,
      borderStyle: 'classic',
      borderColor: 'green',
      align: 'center'
    }
    console.log(`${chalk.blue('Node Cleaner v1.0.0  Powered by alfalfaw')}`)
    console.log(`${boxen(chalk.white('Node Cleaner') + '\n' + chalk.yellow('A node tool to clean your computer.'), boxenOptions)}\n`)
  }
}
