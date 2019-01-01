require('dotenv').config()

const { Resource } = require('./src/models')

class Message extends Resource {
  static get ModelName() {
    return 'messages'
  }
}

class Template extends Resource {
  static get ModelName() {
    return 'templates'
  }
}

const listAll = async () => {
  const templates = await Template.all()
  const messages = await Message.all()

  console.log('All Templates', templates)
  console.log('All Messages', messages)
}

const debug = async () => {
  await listAll()

  const template = await Template.create({
    body: 'Hello {{ noun }}'
  })

  console.log('New Template', template)

  await listAll()

  const message = await Message.create({}, { template_id: template.id })

  console.log('New Message', message)

  await listAll()

  await message.update({ body: 'updated' })

  console.log('Updated Message', message)

  await listAll()

  await message.destroy()
  await template.destroy()

  await listAll()
}

debug()

// Message.all().then(msgs => {
//   console.log('Messages:', msgs)
// }).catch(err => {
//   console.error('Error!', err)
// })

// Message.get('0d305730-07f3-11e9-8b4e-99caf0cabd4f').then(msg => {
//   console.log('Single Message:', msg)
// }).catch(err => {
//   console.error('Error!', err)
// })

// Message.get('0d305730-07f3-11e9-8b4e-99caf0cabd4f').then(msg => {
//   console.log('Single Message:', msg)

//   msg.update({ body: `updated body + ${Math.random() * 1000}`}).then(msg => {
//     console.log('Updated Message:', msg)
//   }).catch(err => {
//     console.error('Error!', err)
//   })
// }).catch(err => {
//   console.error('Error!', err)
// })

// Message.get('0d305730-07f3-11e9-8b4e-99caf0cabd4f').then(msg => {
//   console.log('Single Message:', msg)

//   msg.destroy().then(msg => {
//     console.log('Destroyed Message:', msg)
//   }).catch(err => {
//     console.error('Error!', err)
//   })
// }).catch(err => {
//   console.error('Error!', err)
// })
