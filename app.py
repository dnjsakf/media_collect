from utils.common import logging
from tasks import crawl

logger = logging.getLogger(__file__)

'''
crawl.getImages.delay("https://www.google.com")
'''

from utils.common.sendmail import sendText, sendTemplate

templateFile = 'public/templates/sendmail.html'
sendTemplate('메일발송 테스트', templateFile)

'''

with open(templateFile, "r", encoding=self.ENCODING) as r:
  print( r.read() )
'''