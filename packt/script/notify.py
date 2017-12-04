from notification.gmail import Gmail
from notification.ifttt import Ifttt
from logs import *
from notification.join import Join
from notification.mypushover import Pushover

SERVICE_GMAIL = 'gmail'
SERVICE_IFTTT = 'ifttt'
SERVICE_JOIN = 'join'
SERVICE_PUSHOVER = 'pushover'

class Notify(object):
    """
    TODO interface or abstract class for notification services
    """

    def __init__(self, config, packpub_info, upload_info, service_type):
        self.__config = config
        self.info = {
            'details': []
        }
        if service_type == SERVICE_GMAIL:
            self.service = Gmail(config, packpub_info, upload_info)
        elif service_type == SERVICE_IFTTT:
            self.service = Ifttt(config, packpub_info, upload_info)
        elif service_type == SERVICE_JOIN:
            self.service = Join(config, packpub_info, upload_info)
        elif service_type == SERVICE_PUSHOVER:
            self.service = Pushover(config, packpub_info, upload_info)

    def run(self):
        """
        """
        self.service.send()


    def sendError(self, exception, source):
        """
        """
        self.service.sendError(exception, source)
