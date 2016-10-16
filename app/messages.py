from app import socketio


class Messages():
    def __init__(self):
        self.messages = {}

        self.errorMessages = {
            'server_error': {
                'currentMessage': (lambda *x: "Server error: %s" % x)
            }
        }

    def relayMessage(self, key, args):
        msg = self.messages[key]
        self.__relayServerMessage(msg, key, args)

    def relayError(self, key, args):
        msg = self.errorMessages[key]
        self.__relayServerMessage(msg, key, args)

    def __calculateProgress(self, *args):
        current, total = args

    def __relayServerMessage(self, msg, key, args):
        socketio.emit(
            key, {
                'data': {
                    'currentMessage': msg['currentMessage'](args['message']),
                    'progress': (
                        0 if key is 'server_error'
                        else self.__calculateProgress(args['progress'])
                    )
                }
            }
        )
