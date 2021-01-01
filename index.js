#!/usr/bin/env node

const ora = require('ora')

const chalk = require('chalk')

const clear = require('clear')

const logSymbols = require('log-symbols')

const ui = require('./lib/ui')

const inquirer = require('./lib/inquirer')

const { program } = require('commander')

const { readDirList, checkDir, saveRecentDir, readRecentDir } = require('./lib/util')
const fs = require('fs')

program.version('1.0.0', '-v, --version', 'output the version number')

async function findAndRemove(dir) {
  const fileList = readDirList(dir)
  const choices = fileList.map((item, index) => {
    return { name: `${item.name}(${item.path})`, value: index, short: item.name }
  })
  const { option: selectList } = await inquirer.selectToRemove(choices)

  selectList.forEach((index) => {
    fs.rmdir(fileList[index].path, { recursive: true }, () => {
      console.log(`${fileList[index].path} removed!`)
    })
  })
}
program
  .command('c <dir>')
  .option('-f, --force', 'Remove forcelly')
  .description('clean a directory')
  .action(async (dir, cmdObj) => {
    if (!checkDir(dir)) {
      return console.error(`${dir} is not a directory`)
    }
    saveRecentDir(dir)
    findAndRemove(dir)
  })

program
  .command('start')
  .description('start node-clean cli')
  .action(async () => {
    ui.title()
    let dirs = readRecentDir()

    const choices = dirs.map((item, index) => {
      return { name: `${item.name}(${item.path})`, value: index, short: item.name }
    })

    const { option: index } = await inquirer.mainOptions(choices)

    if (index === -1) {
      let { option: dir } = await inquirer.askFolderName()
      saveRecentDir(dir)
      findAndRemove(dir)
    } else {
      saveRecentDir(dirs[index].path)
      findAndRemove(dirs[index].path)
    }
  })

program.parse(process.argv)
