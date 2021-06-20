const { permissions } = require('../model/remove')

const commands = [
  require('../model/verify'),
  require('../model/remove'),
  require('../model/who')
]

module.exports = {
  name: "help",
  description: "all available commands and examples",
  async execute(client, interaction, command, args, user, guild) {

    for (const command of commands) {

      let fields = []

      let perms_str = ""
      if (command.permissions){
        for (const perm of command.permissions){
          perms_str += perm + " "
        }
      }
      let obj = {
        name: "Permissions",
        value: perms_str ? perms_str:"Anyone can"
      }
      fields.push(obj)
      
      if (command.options){
        for (const option of command.options){
          let obj = {
            name: `${option.name} (${option.description.required?"required":"optional"})`,
            value: option.description
          }
          fields.push(obj)
        }
      }

      if (command.examples){
        let str = ""
        for (const example of command.examples){
          str += example + "\n"
        }
        let obj = {
          name: "Example",
          value: str
        }
        fields.push(obj)
      }

      const embed = {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL()
        },
        title: "/"+command.name,
        description: command.description,
        fields: fields,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL(),
          text: "© SCE"
        }
      }
      await user.send({embed}).catch(console.error);
    }

  }
}
