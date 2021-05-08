const {create_slash_commands, delete_slash_commands} = require('./slash_discord')
const {on_slash_commands_models} = require('../commands/index')

const args = process.argv.slice(2);
let commands_len = 0
Object.keys(on_slash_commands_models).map(key => {
    commands_len++
})

if (args.includes('update')){
    Object.keys(on_slash_commands_models).map(async key => {
        await create_slash_commands(on_slash_commands_models[key], '785700685144260659') // updated to be a guild command
        commands_len--
    })
}
else if (args.includes('delete')){
    Object.keys(on_slash_commands_models).map(async key => {
        await create_slash_commands(on_slash_commands_models[key]).then(async id=>{
            await delete_slash_commands(id)
            commands_len--
        })
    })
}

setTimeout(()=>{
    if (commands_len == 0) process.exit()
},commands_len*2000);
