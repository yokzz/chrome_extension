let textarea;
var allTextareas = document.querySelectorAll("textarea");
for(let i = 0, length = allTextareas.length; i < length; i++) {
    allTextareas[i].onmouseenter = function() {
        textarea = this;
    } 
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case "Tab":
            if (textarea) {
                event.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = textarea.value.substring(start, end);

                let initial_text = selectedText.split(/[\n]+/).filter(Boolean);
                let finalText = initial_text.map(item => {
                    if ((numbers.indexOf(item[1])) >= 0) {
                        return '  ' + item;
                    } else {
                        return '    ' + item;
                    }
                });
                textarea.setRangeText(finalText.join('\n'), start, end, 'end');
            }
    }
});