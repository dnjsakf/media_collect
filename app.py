import os
import dotenv

from utils.common import logging
from routes import createApp
from config import DOT_ENV

logger = logging.getLogger(__file__)

if __name__ == '__main__':
    dotenv.load_dotenv( dotenv_path=DOT_ENV )

    server = createApp('dev')
    server.run(host='0.0.0.0', port='3000')

'''
from tasks import crawl
from utils.common.sendmail import sendText, sendTemplate

crawl.getImages.delay("https://www.google.com")

templateFile = 'public/templates/sendmail.html'
sendTemplate('메일발송 테스트', templateFile)

with open(templateFile, "r", encoding=self.ENCODING) as r:
  print( r.read() )
'''