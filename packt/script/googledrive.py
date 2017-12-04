from os.path import exists
import webbrowser
from oauth2client.client import flow_from_clientsecrets, OOB_CALLBACK_URN
from oauth2client.file import Storage
import httplib2
import magic
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from utils import thread_loader
from logs import *

class GoogleDrive(object):
    """
    """

    def __init__(self, config):
        self.__config = config
        self.__googledrive_service = None
        self.info = {}

    def __guess_info(self, file_path):
        if not exists(file_path):
            raise IOError('file not found!')

        self.info = {
            'path': file_path,
            'name': file_path.split('/')[-1],
            'mime_type': magic.from_file(file_path, mime=True),
        }
        log_info('[+] new file upload on Google Drive:')
        # log_dict(self.file_info)

    def __init_service(self):
        auth_token = self.__config.get('googledrive', 'googledrive.auth_token')

        if not exists(auth_token):
            self.__save_credentials(auth_token)

        storage = Storage(auth_token)
        credentials = storage.get()

        http = httplib2.Http()
        http = credentials.authorize(http)
        self.__googledrive_service = build('drive', 'v2', http=http)

    def __save_credentials(self, auth_token):
        flow = flow_from_clientsecrets(
            self.__config.get('googledrive', 'googledrive.client_secrets'),
            self.__config.get('googledrive', 'googledrive.oauth2_scope'),
            OOB_CALLBACK_URN)

        authorize_url = flow.step1_get_authorize_url()

        print '[-] open browser...'
        webbrowser.open(authorize_url)

        code = raw_input('[*] Please, enter verification code: ').strip()
        credentials = flow.step2_exchange(code)

        storage = Storage(auth_token)
        storage.put(credentials)
        log_info('[+] new credentials saved')

    def __create_folder(self): #Create folder with provided name
        try: #Check default folder name
            default_folder_name = self.__config.get('googledrive', 'googledrive.default_folder')
        except:
            default_folder_name = 'packtpub'

        metadata = {
            'title': default_folder_name,
            'mimeType' : 'application/vnd.google-apps.folder'
        }
        folder = self.__googledrive_service.files().insert(body = metadata).execute()
        self.__config.set('googledrive', 'googledrive.upload_folder', folder['id'])
        log_success('[+] creating new directory...')
        print '[+] updating folder permissions...'
        permissions = {
            'role': 'reader',
            'type': 'anyone',
            'value': self.__config.get('googledrive', 'googledrive.gmail')
        }
        self.__googledrive_service.permissions().insert(fileId=folder['id'], body=permissions).execute()
        log_dict({'folder_name':  default_folder_name,
                  'id': folder['id'],})
                  #'share_link': folder['webContentLink']}) #TODO Fix
        log_success('[+] Please add this line after [googledrive] in your configuration file:')
        log_info('googledrive.upload_folder=' + folder.get('id'))

        return folder.get('id') #Return folder object ID
        
    def __get_folder(self): #Get folder name settings
        try:
            return self.__config.get('googledrive', 'googledrive.upload_folder')
        except:
            return self.__create_folder() #new folder ID

    def __insert_file(self):
        print '[+] uploading file...'
        media_body = MediaFileUpload(
            self.info['path'], mimetype=self.info['mime_type'], resumable=True)
        body = {
            'title': self.info['name'],
            'description': 'uploaded with packtpub-crawler',
            'mimeType': self.info['mime_type'],
            'parents': [{'id': self.__get_folder()}]
        }
        file = self.__googledrive_service.files().insert(body=body, media_body=media_body).execute()
        # log_dict(file)

        print '[+] updating file permissions...'
        permissions = {
            'role': 'reader',
            'type': 'anyone',
            'value': self.__config.get('googledrive', 'googledrive.gmail')
        }
        self.__googledrive_service.permissions().insert(fileId=file['id'], body=permissions).execute()

        # self.__googledrive_service.files().get(fileId=file['id']).execute()

        self.info['id'] = file['id']
        self.info['download_url'] = file['webContentLink']

    def upload(self, file_path):
        self.__guess_info(file_path)
        self.__init_service()
        thread_loader(self.__insert_file)
