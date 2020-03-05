import os
import smtplib
 
from email import encoders
from email.utils import formataddr
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
 
 
class SendMailClient(object):
  ENCODING = 'UTF-8'
 
  host = None
  port = None
  from_addr = None
  to_addrs = None
  message = None
  
  debug = False
  _isLogin = False
  _existAttachments = False
 
  def __init__(self, address:tuple, from_addr:str, to_addrs:list, debug=False, **kwargs):
    self.host, self.port = address
    self.from_addr = from_addr
    self.to_addrs = to_addrs
    
    # 인증 계정
    if kwargs.get("username") is not None:
      self.setAuth(
        kwargs.get("username")
        , kwargs.get("password")
      )
    
    # 디버그 모드
    self.debug = debug is not False
  
    # 첨부파일로 전송 불가능한 확장자
    self.blocked_extensions = (
      ".ade", ".adp", ".apk", ".appx", ".appxbundle", ".bat"
      , ".cab", ".chm", ".cmd", ".com", ".cpl", ".dll", ".dmg"
      , ".exe", ".hta", ".ins", ".isp", ".iso", ".jar", ".js"
      , ".jse", ".lib", ".lnk", ".mde", ".msc", ".msi", ".msix"
      , ".msixbundle", ".msp", ".mst", ".nsh", ".pif", ".ps1"
      , ".scr", ".sct", ".shb", ".sys", ".vb", ".vbe", ".vbs"
      , ".vxd", ".wsc", ".wsf", ".wsh"
    )
 
  def setAuth(self, username, password):
    self._isLogin = True
    self.username = username
    self.password = password
    
  def setTemplate(self, subject, template, attachments=None):
    with open(template, "r", encoding=self.ENCODING) as r:
      text = r.read()
    
    self.setMail( subject, text, text_type='html', attachments=attachments )
 
  def setMail(self, subject, text, text_type='plain', attachments=None):
    '''
    Content-Type:
      - multipart/alternative: 평문 텍스트와 HTML과 같이 다른 포맷을 함께 보낸 메시지 
      - multipart/mixed: 첨부파일이 포함된 메시지
 
    REF:
      - https://ko.wikipedia.org/wiki/MIME#Content-Type
    '''
    # 첨부파일 여부
    self._existAttachments = attachments is not None
    self.content_sub_type = "mixed" if self._existAttachments else "alternative"
 
    # 메일 콘텐츠 설정
    self.message = MIMEMultipart( self.content_sub_type )
 
    # 받는 사람 주소 설정. [( 이름 <이메일> )]
    self.FROM_ADDR_FMT = formataddr( self.from_addr )
    self.TO_ADDRS_FMT = ",".join([ formataddr( addr ) for addr in self.to_addrs ])
    
    # 메일 헤더 설정
    self.message.set_charset( self.ENCODING )
    self.message['From'] = self.FROM_ADDR_FMT
    self.message['To'] = self.TO_ADDRS_FMT
    self.message['Subject'] = subject
    
    # 메일 콘텐츠 - 내용
    self.message.attach(MIMEText( text, text_type, self.ENCODING ))
 
    # 메일 콘텐츠 - 첨부파일
    if self._existAttachments:
      self._attach_files( attachments )
 
    return self
  
  def _attach_files(self, attachments):
    '''
    Content-disposition:
      - 파일명 지정
    MIME type:
      - application/octect-stream: Binary Data
    REF:
      - https://www.freeformatter.com/mime-types-list.html
    '''
 
    for attachment in attachments:
      attach_binary = MIMEBase("application", "octect-stream")
      try:
        binary = open(attachment, "rb").read() # read file to bytes
 
        attach_binary.set_payload( binary )
        encoders.encode_base64( attach_binary ) # Content-Transfer-Encoding: base64
        
        filename = os.path.basename( attachment )
        attach_binary.add_header("Content-Disposition", 'attachment', filename=(self.ENCODING, '', filename))
        
        self.message.attach( attach_binary )
      except Exception as e:
        print( e )
 
  def send(self):
    session = None
    try:
      # 메일 세션 생성
      session = smtplib.SMTP( self.host, self.port )
      session.set_debuglevel( self.debug )
      session.ehlo()
 
      # SMTP 서버 계정 인증
      if self._isLogin:
        session.starttls()
        session.login(self.username, self.password)
      
      # 메일 발송
      session.sendmail(self.FROM_ADDR_FMT, self.TO_ADDRS_FMT, self.message.as_string())
      print( 'Successfully sent the mail!!!' )
      
    except Exception as e:
      print( e )
    finally:
      if session is not None:
        session.quit()
