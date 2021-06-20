/**
 * exports all commands we define 
 */
//message trigger
const on_message_commands = {
    ping: require('./on_message/ping'),
}
/**
 * Slash command export
 * in `execution folder`
 */
const on_slash_command_executions = {
    //sample: require('./on_slash/execution/sample_slash')
    verify: require('./on_slash/execution/verify'),
    remove: require('./on_slash/execution/remove'),
    who: require('./on_slash/execution/who'),
    help: require('./on_slash/execution/help'),
    status: require('./on_slash/execution/status')
}

/**
 * Slash command models export
 * in `models folder`
 */
 const on_slash_commands_models = {
    //sample: require('./on_slash/model/sample_slash')
    verify: require('./on_slash/model/verify'),
    remove: require('./on_slash/model/remove'),
    who: require('./on_slash/model/who'),
    help: require('./on_slash/model/help'),
    status: require('./on_slash/model/status')
}

module.exports = {
    on_message_commands, on_slash_commands_models, on_slash_command_executions
};