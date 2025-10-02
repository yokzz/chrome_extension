function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.tox-edit-area__iframe').then((iframe) => {
  console.log("ready");
  let iframeDoc = iframe.contentWindow.document;
  let iframeBody = iframe.contentWindow.document.querySelector("body").innerHTML;

  let selectedHtmlWithTags = ""; 
  let currentRange = null;

  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  iframeDoc.addEventListener('keydown', (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      const selection = iframeDoc.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      
      if (selectedText) {
        const container = range.commonAncestorContainer;
        const parentElement = container.nodeType === 3 ? container.parentElement : container;
        
        const selectedContent = range.cloneContents();
        const tempDiv = iframeDoc.createElement('div');
        tempDiv.appendChild(selectedContent);
        
        const blockElements = tempDiv.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6');
        
        if (blockElements.length > 0) {
          blockElements.forEach(block => {
            const textContent = block.textContent.trim();
            const indent = (textContent.length > 0 && numbers.includes(textContent[1])) 
              ? '\u00A0\u00A0' 
              : '\u00A0\u00A0\u00A0\u00A0';
            
            if (block.firstChild) {
              const indentNode = iframeDoc.createTextNode(indent);
              block.insertBefore(indentNode, block.firstChild);
            }
          });
        } else {
          let html = tempDiv.innerHTML;
          let lines = html.split(/<br\s*\/?>/i);
          
         lines = lines
          .map((line) => {
            const textContent = line.replace(/<[^>]*>/g, '').trim();
            const indent = (textContent.length > 0 && numbers.includes(textContent[0])) 
              ? '&nbsp;&nbsp;' 
              : '&nbsp;&nbsp;&nbsp;&nbsp;';
            return indent + line;
          });
          
          tempDiv.innerHTML = lines.join('&nbsp;');
        }
        
        range.deleteContents();
        const fragment = iframeDoc.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        range.insertNode(fragment);
        
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const indent = iframeDoc.createTextNode('\u00A0\u00A0\u00A0\u00A0');
        range.insertNode(indent);
        range.setStartAfter(indent);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
});
