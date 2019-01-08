#!/usr/bin/env node

/**
 * W.I.P => timeout due to too many files ??
 *
 * @type {SSH}
 */

let node_ssh = require('node-ssh')
let path = require('path')
let ssh = new node_ssh()

ssh.connect({
  host: 'ec2-52-47-66-164.eu-west-3.compute.amazonaws.com',
  username: 'ubuntu',
  privateKey: '.ssh/wecitizens.pem' // Ask to have it
}).then(() => {
  // Putting entire directories
  const failed = []
  const successful = []

  ssh.putDirectory('dist', '/home/user/web/gps/', {
    recursive: true,
    concurrency: 10,
    validate: function(itemPath) {
      const baseName = path.basename(itemPath)
      return baseName.substr(0, 1) !== '.' && // do not allow dot files
        baseName !== 'node_modules' // do not allow node_modules
    },
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
      } else {
        successful.push(localPath)
      }
    }
  }).then(function(status) {
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
    console.log('failed transfers', failed.join(', '))
    console.log('successful transfers', successful.join(', '))
  }).catch((err) => {
    console.log('Error', err);
  })
});