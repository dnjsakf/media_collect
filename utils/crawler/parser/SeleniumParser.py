from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def parseImage(response=None, timeout=0):
  item = None

  if timeout > 0:
    item = WebDriverWait(response, timeout).until(
      EC.presence_of_all_elements_located((By.CSS_SELECTOR, "img"))
    )
  else:
    item = response.find_emenets_by_css_selector("img")

  return item