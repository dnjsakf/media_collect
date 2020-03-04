import config.database as db
import os

LOGGING_LEVEL = "DEBUG"
LOGGING_PATH = os.path.abspath("logs")
LOGGING_FILE = True

MONGO_CONNECT = "{protocol}://{username}:{password}@{host}:{port}/{database}".format(
  protocol=db.MONGO_PROTOCOL    # mongodb
  , username=db.MONGO_USERNAME
  , password=db.MONGO_PASSWORD
  , host=db.MONGO_HOST
  , port=db.MONGO_PORT
  , database=db.MONGO_DATABASE
)

SELENIUM_DRIVER_PATH = os.path.join(os.path.abspath("utils/crawler/drivers"), "chromedriver")
SELENIUM_DRIVER_VERSION = "80.0.3987.16"