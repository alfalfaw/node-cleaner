const fs = require('fs')
const path = require('path')
const ConfigStore = require('configstore')
const configStore = new ConfigStore('node-cleaner')

const fixPath = (dir) => {
  return dir.length > 1 && dir.endsWith('/') ? dir.slice(0, -1) : dir
}
const saveRecentDir = (path) => {
  // configStore.clear('DIRS')
  const dirs = configStore.get('DIRS') || []
  path = fixPath(path)
  const dirname = path.substring(path.lastIndexOf('/') + 1)
  const index = dirs.findIndex((dir) => dir.path === path)
  if (index > -1) {
    dirs[index].count++
  } else {
    dirs.push({
      path,
      name: dirname,
      count: 1
    })
  }
  configStore.set('DIRS', dirs)
  // console.log(configStore.get('DIRS'))
}

const readRecentDir = () => {
  const dirs = configStore.get('DIRS') || []
  const sorted = dirs.sort((a, b) => b.count - a.count)
  return sorted.slice(0, 5)
}
const accessDir = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

const readDirList = (dir) => {
  const target = []
  const traverse = function (dir, dirname) {
    if (!accessDir(dir)) return
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    let flag = true
    for (let dirent of dirents) {
      if (dirent.name.startsWith('.') || dirent.name === 'Library') continue
      if (dirent.name === 'node_modules') {
        target.push({ name: dirname, path: path.join(dir, dirent.name) })
        flag = false
        break
      }
    }
    if (flag) {
      for (let dirent of dirents) {
        if (dirent.name.startsWith('.') || dirent.name === 'Library') continue

        if (dirent.isDirectory()) {
          traverse(path.join(dir, dirent.name), dirent.name)
        }
      }
    }
  }

  dir = fixPath(dir)
  const dirname = dir.substring(dir.lastIndexOf('/') + 1)
  traverse(dir, dirname)
  return target
}
const checkDir = (dir) => {
  return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()
}

module.exports = {
  fixPath,
  saveRecentDir,
  readRecentDir,
  readDirList,
  checkDir
}
