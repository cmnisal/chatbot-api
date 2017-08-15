module.exports = function ConversationProviderService(config,
                                                      q,
                                                      conversation,
                                                      helpersUtil,
                                                      exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.conversation = conversation.instance;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;

    this.sendMessage = function(text, context) {
        var messsage = self.q.nbind(self.conversation.message, self.conversation);

        var payload = {
            workspace_id: self.config.conversation.workspaceId,
            input: {
                text: text
            },
            context: context ? context : {}
        };
        return message(payload)
            .then(function(result) {
                console.log(result);
            })
    };


};

module.exports.$inject = [
    'config',
    'q',
    'conversation',
    'helpersUtil',
    'exceptionFac'
];